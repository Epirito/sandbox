import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem, ProngedComponent, defaultSignal} from "../logic/prong";
import { equals, rotatedBy, sum } from "../utils/vector";
import { lampSpec, inputSpec, wireSpec, bimuxSpec } from "./pronged-specs";
import { CraftingComponent, Recipe } from "../logic/crafting";
import { Scheduler } from "../logic/scheduler";
import { push } from "./actions";
import { SaturatedAction } from "../logic/action";
import { onPlacedOnBelt, onPressureListenerPlaced, onPressureListenerUnplaced, pressurePlateDetection, schedule } from "./world-actions";
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
        const {phys, scheduler} = dependencies as {phys: PhysicsSystem, scheduler: Scheduler}
        const belt = bare;
        let timeOut: SaturatedAction | undefined = undefined
        const listener = onPlacedOnBelt.from([belt], {})
        phys.onPlaced(belt, onPressureListenerPlaced.from([belt], {listener}))
        phys.onUnplaced(belt, onPressureListenerUnplaced.from([belt], {listener}))
        return belt;
    },
    pressurePlate: (dependencies, bare)=> {
        const {phys, electricity} = dependencies as {phys: PhysicsSystem, electricity: ProngSystem}
        const plate = bare;
        electricity.addEntity(plate);
        plate.prongedComp = new ProngedComponent(inputSpec(dependencies), plate);
        const listener = pressurePlateDetection.from([plate], {delay: 60})
        phys.onPlaced(plate, onPressureListenerPlaced.from([plate], {listener}))
        phys.onUnplaced(plate, schedule.from([], {action: onPressureListenerUnplaced.from([plate], {listener}), delay: 0}))
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
        bimux.signalQueueComp = []
        return bimux;
    }
}