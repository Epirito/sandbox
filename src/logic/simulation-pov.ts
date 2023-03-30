import { open } from "./actions";
import { IContainerSystem } from "./container";
import Entity from "./entity";
import { IPhysicsSystem } from "./physics";
import { IProngSystem } from "./prong";
import Simulation from "./simulation";

export class SimulationPOV {
    listFront = false;
    openContainer?: Entity;
    constructor(private sim: Simulation, public player: Entity) {
        this.sim.onActionDone = ({action, terms}) => {
            this.listFront = false;
            if (action===open) {
                this.openContainer = terms[1]
            }else {
                this.openContainer = undefined
            }
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
    get container(): IContainerSystem {
        return this.sim.systems['container']
    }
    playerAction(actionIota: number, ids: string[], vals?: Object) {
        this.sim.doAction(actionIota, [this.player.id, ...ids], vals)
    }
}