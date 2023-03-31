import { entities } from "../stuff/entities";
import { examinables } from "../stuff/examinables";
import random from "../utils/random";
import { Action } from "./action";
import Entity from "./entity";
export interface System {
    cleanUpDestroyed?(entity: Entity): void;
    copy(dependencies?): System
}
export default class Simulation {
    static hierarchy = [
        ['clock', 'actionRequester', 'thingMaker', 'phys'],
        ['scheduler', 'container', 'electricity']
    ]
    private entityById: Map<string, Entity> = new Map();
    constructor(readonly systems: {[x: string]: System}, public onActionDone?: (data: {action: Action, terms: Entity[]})=>void, public onActionFailed?: (data: {action: Action, terms: Entity[], error: string})=>void) {
        this.systems['thingMaker']['make'] = this.make;
        this.systems['thingMaker']['destroy'] = this.destroy;
        this.systems['actionRequester']['doAction'] = this.doAction;
    }
    doAction = (actionIota: number, ids: string[], vals?: Object)=>{
        const terms = ids.map(x=>this.entityById.get(x)!)
        const action = Action.byIota(actionIota)!
        const error = action.effect?.(this.systems)(terms, vals)
        if (error===undefined) {
            this.onActionDone!({action, terms})
        }else {
            this.onActionFailed!({action, terms, error})
        }
    }
    static getId() {
        return random.next().toString(36).substring(2)
    }
    destroy(entity: Entity) {
        for(const system in this.systems) {
            this.systems[system].cleanUpDestroyed?.(entity)
        }
        this.entityById.delete(entity.id)
    }
    make = (thing: string)=>{
        const entity = entities[thing](this.systems,this.bareEntity(1))
        entity.examinableComp = examinables[thing]
        entity.essence = thing
        return entity
    }
    bareEntity(size, blocksMovement = false) {
        const entity = new Entity(Simulation.getId(), size, blocksMovement)
        this.entityById.set(entity.id, entity)
        return entity
    }
    copy() {
        const systems: {[x: string]: System} = {}
        for(const tier in Simulation.hierarchy) {
            for(const system of Simulation.hierarchy[tier]) {
                systems[system] = this.systems[system].copy(systems)
            }
        }
        const newSim = new Simulation(systems)
        this.entityById.forEach((entity, id)=>{
            newSim.entityById.set(id, entity.copy())
        })
        return newSim
    }
}