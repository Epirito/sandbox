import ContainerSystem from "./container";
import Entity from "./entity";
import { PhysicsSystem } from "./physics";
export class Action {
    static n = 0;
    static readonly byIota = new Map<number, Action>();
    readonly iota!: number
    constructor(readonly verb: (terms: string[])=>string, readonly effect: (dependencies: Object)=>(terms: Entity[])=>void|(string|undefined)) {
        this.iota = Action.n++;
        Action.byIota.set(this.iota, this);
    }
}
function containerEffect(action: string) {
    return (dependencies: Object)=>(terms: Entity[])=> {
        const {container} = dependencies as {container: ContainerSystem};
        return container[action](...terms);
    }
}

// ui-only action:
const nonEffect = (dependencies: Object)=>(terms: Entity[])=>undefined;

export const interact = new Action((terms) => `${terms[0]} interacts with ${terms[1]}`, ()=>()=>{});
export const apply = new Action((terms) => `${terms[0]} applies ${terms[1]} on ${terms[2]}`, ()=>()=>{});
export const open = new Action(
    (terms) => `${terms[0]} opens ${terms[1]}`,
    nonEffect
);
export const drop = new Action(
    (terms) => `${terms[0]} drops item`, 
    containerEffect('tryDrop')
);
export const pickUp = new Action(
    (terms) => `${terms[0]} picks up ${terms[1]}`, 
    containerEffect('tryPickUp')
);
export const insertInto = new Action(
    (terms) => `${terms[0]} inserts into ${terms[1]}`, 
    containerEffect('tryInsertInto')
);
export default  class CharacterMovement {
    constructor(private phys: PhysicsSystem) {}
    moveForward(actor: Entity) {
        const destination = this.phys.inFrontOf(actor)
        if (this.phys.isBlocked(destination)) {
            return
        }
        this.phys.place(actor, {position: destination})
    }
}