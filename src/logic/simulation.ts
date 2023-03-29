import random from "../utils/random";
import { Action } from "./actions";
import Entity from "./entity";

export default class Simulation {
    private entityById: Map<string, Entity> = new Map();
    constructor(readonly systems: Object, public onActionDone: (data: {action: Action, terms: Entity[]})=>void = console.log, public onActionFailed: (data: {action: Action, terms: Entity[], error: string})=>void = console.log) {}
    doAction(actionIota: number, ids: string[], vals?: Object) {
        const terms = ids.map(x=>this.entityById.get(x)!)
        const action = Action.byIota(actionIota)!
        const error = action.effect?.(this.systems)(terms, vals)
        if (error===undefined) {
            this.onActionDone({action, terms})
        }else {
            this.onActionFailed({action, terms, error})
        }
    }
    static getId() {
        return random.next().toString(36).substring(2)
    }
    make(stuffMaker: (dependencies, bare: Entity)=>Entity) {
        const entity = stuffMaker(this.systems,this.bareEntity(1))
        return entity
    }
    bareEntity(size, blocksMovement = false) {
        const entity = new Entity(Simulation.getId(), size, blocksMovement)
        this.entityById.set(entity.id, entity)
        return entity
    }
}