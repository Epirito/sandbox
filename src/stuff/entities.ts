import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem, ProngedComponent, defaultSignal} from "../logic/prong";
import { examinables } from "../stuff/examinables";
import { equals, rotatedBy, sum } from "../utils/vector";
import { lampSpec, inputSpec, wireSpec, bimuxSpec } from "./pronged-specs";

export const wire = (dependencies)=> {
    const {electricity} = dependencies as {electricity: ProngSystem}
    const wire = new Entity(2);
    wire.examinableComp = examinables.wire;
    electricity.addEntity(wire);
    wire.prongedComp = new ProngedComponent(wireSpec(dependencies), wire);
    return wire;
}
export const belt = (dependencies)=> {
    const {phys} = dependencies as {phys: PhysicsSystem}
    const belt = new Entity(1);
    belt.examinableComp = examinables.belt;
    let timeOut: number | undefined = undefined
    const listener = (evt: CustomEvent)=>{
        const entity = evt.detail
        const pos = phys.position(belt)!
        if (entity!==belt) {
            timeOut = setTimeout(()=>{
                const entityPos = phys.position(entity)
                if (entityPos &&  equals(entityPos, pos)) {
                    phys.place(entity, {position: sum(pos, rotatedBy([1,0], phys.rotation(belt)!))})
                }
            }, 100)
        }
    }
    phys.onPlaced(belt, ()=>{
        phys.onPlacedAt(phys.position(belt)!, listener)
    })
    phys.onUnplaced(belt, ()=>{
        clearTimeout(timeOut)
        phys.removeOnPlacedAt(phys.position(belt)!, listener)
    })
    return belt;
}
export const pressurePlate = (triggeringSize: number)=> (dependencies)=> {
    const {phys, electricity} = dependencies as {phys: PhysicsSystem, electricity: ProngSystem}
    const plate = new Entity(1);
    plate.examinableComp = examinables.pressurePlate;
    electricity.addEntity(plate);
    plate.prongedComp = new ProngedComponent(inputSpec(dependencies), plate);
    let timeOut: number | undefined = undefined
    const detection = (_)=>{
        function getCombinedSize() {
            return phys.entitiesAt(phys.position(plate)!).reduce((acc, entity)=>acc+entity.size, 0)
        }

        if (getCombinedSize()>triggeringSize) {
            function pulse() {
                clearTimeout(timeOut)
                if (getCombinedSize()>triggeringSize) {
                    electricity.entityOutput(plate, "", defaultSignal)
                    timeOut = setTimeout(()=>{
                        pulse()
                    }, 1000)
                }
            }
            pulse()
        }else {
            clearTimeout(timeOut)
        }
    }
    phys.onPlaced(plate, ()=>{
        phys.onPlacedAt(phys.position(plate)!, detection)
    })
    phys.onUnplaced(plate, ()=>{
        phys.removeOnPlacedAt(phys.position(plate)!, detection)
        clearTimeout(timeOut)
    })
    return plate;
}

export const lamp = (dependencies)=>{
    const {electricity} = dependencies as {electricity: ProngSystem};
    const lamp = new Entity(2);
    lamp.examinableComp = examinables.lamp;
    electricity.addEntity(lamp);
    lamp.prongedComp = new ProngedComponent(lampSpec(dependencies), lamp);
    return lamp;
}
export const bimux = (dependencies)=>{
    const {electricity} = dependencies as {electricity: ProngSystem};
    const bimux = new Entity(2);
    bimux.examinableComp = examinables.mux;
    electricity.addEntity(bimux);
    bimux.prongedComp = new ProngedComponent(bimuxSpec(dependencies), bimux);
    return bimux;
}