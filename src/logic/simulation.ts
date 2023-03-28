import { Action } from "./actions";
import Entity from "./entity";

export default class Simulation {
    constructor(private systems: Object, readonly onActionDone: (data: {action: Action, terms: Entity[]})=>void = console.log, readonly onActionFailed: (data: {action: Action, terms: Entity[], error: string})=>void = console.log) {}
    doAction(actionIota: number, ids: string[]) {
        const terms = ids.map(id=>Entity.byId.get(id)!)
        const action = Action.byIota.get(actionIota)!
        const error = action.effect(this.systems)(terms)
        if (error===undefined) {
            this.onActionDone({action, terms})
        }else {
            this.onActionFailed({action, terms, error})
        }
    }
    make(stuffMaker: (dependencies)=>Entity) {
        return stuffMaker(this.systems)
    }
}