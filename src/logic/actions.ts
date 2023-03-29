import ContainerSystem from "./container";
import Entity from "./entity";
import { PhysicsSystem } from "./physics";
export class Action {
    static n = 0;
    private static actionByIota = new Map<number, Action>();
    static byIota = (iota: number) => Action.actionByIota.get(iota);
    readonly iota!: number
    constructor(readonly verb?: (terms: string[])=>string, readonly effect?: (dependencies: Object)=>(terms: Entity[], vals?: Object)=>void|(string|undefined)) {
        this.iota = Action.n++;
        Action.actionByIota.set(this.iota, this);
    }
}
function containerEffect(action: string) {
    return (dependencies: Object)=>(terms: Entity[])=> {
        const {container} = dependencies as {container: ContainerSystem};
        return container[action](...terms);
    }
}

export const interact = new Action((terms) => `${terms[0]} interacts with ${terms[1]}`, ()=>()=>{});
export const apply = new Action((terms) => `${terms[0]} applies ${terms[1]} on ${terms[2]}`, ()=>()=>{});
export const open = new Action(
    (terms) => `${terms[0]} opens ${terms[1]}`
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
export const walk = new Action(
    undefined,
    (dependencies: Object)=>(terms: Entity[], vals?: Object)=> {
        const {rotation} = (vals as {rotation: number});
        const {phys} = dependencies as {phys: PhysicsSystem};
        phys.place(terms[0], {rotation})
        const destination = phys.inFrontOf(terms[0])
        if (phys.isBlocked(destination)) {
            return 'blocked'
        }
        phys.place(terms[0], {position: destination})
    }
);