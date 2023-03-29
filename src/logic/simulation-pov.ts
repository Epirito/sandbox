import Entity from "./entity";
import { IPhysicsSystem } from "./physics";
import { IProngSystem } from "./prong";
import Simulation from "./simulation";

export class SimulationPOV {
    listFront = false;
    constructor(private sim: Simulation, public player: Entity) {
        this.sim.onActionDone = ({action, terms}) => {
            this.listFront = false;
            if (action.verb) {
                console.log(action.verb(terms.map(x=>x.examinableComp?.examine(player, x)[0] || "???")));
            }
        }
        this.sim.onActionFailed = ({action, terms, error}) => {
            if (error==='blocked') {
                this.listFront = true;
            }
            console.log(action, terms, error);
        }
    }
    get phys(): IPhysicsSystem {
        return this.sim.systems['phys']
    }
    get electricity(): IProngSystem {
        return this.sim.systems['electricity']
    }
    playerAction(actionIota: number, ids: string[], vals?: Object) {
        this.sim.doAction(actionIota, [this.player.id, ...ids], vals)
    }
}