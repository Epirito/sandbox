import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem, ProngedComponent, defaultSignal} from "../logic/prong";
import { equals, rotatedBy, sum } from "../utils/vector";
import { lampSpec, inputSpec, wireSpec, bimuxSpec } from "./pronged-specs";
import { CraftingComponent, Recipe } from "../logic/crafting";
export type EntityFactory = (dependencies: Object, bare: Entity)=>Entity
export const entities: {[x: string]: (dep, bare: Entity)=>Entity} = {
    craftingTable: (dependencies, bare: Entity)=> {
        const table = bare;
        const godRecipes: Recipe[] = []
        for(const entity in entities) {
            godRecipes.push(new Recipe(entity, []))
        }
        const godCraftingComp = new CraftingComponent(godRecipes)
        table.craftingComp = godCraftingComp
        table.blocksMovement = true;
        return table;
    },
    wire: (dependencies, bare)=> {
        const {electricity} = dependencies as {electricity: ProngSystem}
        const wire = bare;
        electricity.addEntity(wire);
        wire.prongedComp = new ProngedComponent(wireSpec(dependencies), wire);
        return wire;
    },
    belt: (dependencies, bare)=> {
        const {phys} = dependencies as {phys: PhysicsSystem}
        const belt = bare;
        let timeOut: number | undefined = undefined
        const listener = (evt: CustomEvent)=>{
            const entity = evt.detail
            const pos = phys.position(belt)!
            if (entity!==belt) {
                timeOut = setTimeout(()=>{
                    const entityPos = phys.position(entity)
                    if (entityPos &&  equals(entityPos, pos)) {
                        phys.placeIfNotBlocked(entity, sum(pos, rotatedBy([1,0], phys.rotation(belt)!)))
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
    },
    pressurePlate: (dependencies, bare)=> {
        const triggeringSize = 3
        const {phys, electricity} = dependencies as {phys: PhysicsSystem, electricity: ProngSystem}
        const plate = bare;
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
    },
    lamp: (dependencies, bare)=>{
        const {electricity} = dependencies as {electricity: ProngSystem};
        const lamp = bare;
        electricity.addEntity(lamp);
        lamp.prongedComp = new ProngedComponent(lampSpec(dependencies), lamp);
        return lamp;
    },
    bimux: (dependencies, bare)=>{
        const {electricity} = dependencies as {electricity: ProngSystem};
        const bimux = bare;
        electricity.addEntity(bimux);
        bimux.prongedComp = new ProngedComponent(bimuxSpec(dependencies), bimux);
        return bimux;
    }
}