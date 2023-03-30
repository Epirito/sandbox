import { entities } from "../stuff/entities";
import { examinables } from "../stuff/examinables";
import random from "../utils/random";
import { Action } from "./actions";
import Entity from "./entity";

export default class Simulation {
    private entityById: Map<string, Entity> = new Map();
    constructor(readonly systems: Object, public onActionDone?: (data: {action: Action, terms: Entity[]})=>void, public onActionFailed?: (data: {action: Action, terms: Entity[], error: string})=>void) {
        (this.systems as {thingMaker}).thingMaker.make = this.make
    }
    doAction(actionIota: number, ids: string[], vals?: Object) {
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
}