import { container } from "../example";
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

function containerDependency(effect: (container: ContainerSystem)=>(terms: Entity[], vals?: Object)=>void){
    return (dependencies)=>effect((dependencies as {container: ContainerSystem}).container)
}
export const interact = new Action((terms) => `${terms[0]} interacts with ${terms[1]}`, ()=>()=>{});
export const apply = new Action((terms) => `${terms[0]} applies ${terms[1]} on ${terms[2]}`, ()=>()=>{});
export const open = new Action(
    (terms) => `${terms[0]} opens ${terms[1]}`
);
export const drop = new Action(
    (terms) => `${terms[0]} drops item`, 
    containerDependency(container=>terms=>{return container.tryDrop(terms[0])})
);
export const pickUp = new Action(
    (terms) => `${terms[0]} picks up ${terms[1]}`, 
    containerDependency(container=>terms=>{return container.tryPickUp(terms[0], terms[1])})
);
export const withdraw = new Action(
    (terms) => `${terms[0]} withdraws ${terms[1]} from ${terms[2]}`,
    containerDependency(container=>terms=>{
        return container.tryWithdraw(terms[0], terms[1], terms[2])
    })
)
export const insertInto = new Action(
    (terms) => `${terms[0]} inserts into ${terms[1]}`, 
    containerDependency(container=>terms=>{return container.tryInsertInto(terms[0], terms[1])})
);
export const walk = new Action(
    undefined,
    (dependencies: Object)=>(terms: Entity[], vals?: Object)=> {
        const {rotation} = (vals as {rotation: number});
        const {phys} = dependencies as {phys: PhysicsSystem};
        phys.place(terms[0], {rotation})
        const destination = phys.inFrontOf(terms[0])
        if (!phys.placeIfNotBlocked(terms[0], destination)) {
            return 'blocked'
        }
    }
);