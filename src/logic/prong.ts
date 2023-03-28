import Entity from "./entity";
import {PhysicsSystem} from "./physics";
import { absPosition } from "../utils/vector";
import identityFunction from "../utils/identity-function";

export class ProngSpec {
    constructor(
        readonly attachedVector: [number, number],
        readonly kind: string
    ) {}
}

export interface ProngedSpec {
    prongsBySystem: Map<
        ProngSystem,
        {
        inputs: Array<ProngSpec>;
        outputs: Array<ProngSpec>;
        }
    >;
    //this should be made into a component and changed to inputListenerByInputKind. it would be simpler
    inputListenerByEntityIdXInputKindPair?: Map<string, (signal: Signal) => void>;
}
function getProngedSpecListener(prongedEntity: Entity, input: ProngSpec) {
    return prongedEntity.prongedSpec!.inputListenerByEntityIdXInputKindPair?.get(
        JSON.stringify([prongedEntity.id, input.kind])
    )!;
}

export interface Signal {
    muxStack: string[]
    lastHop?: string
}
export function signalHop(signal: Signal, entity: Entity) {
    const newSignal = Object.assign({}, signal)
    newSignal.lastHop = entity.id
    return newSignal
}
export const defaultSignal: Signal = {
    muxStack: [],
};

export class ProngSystem {
    private eventField = new EventTarget();
    private rateLimitedPoints = new Set<string>();
    constructor(private phys: PhysicsSystem, readonly rateLimiting = 1000/15) {}
    output(fromPosition: [number, number], signal: Signal) {
        const jsonPoint= JSON.stringify(fromPosition)
        if (this.rateLimitedPoints.has(jsonPoint)) {
            return
        }
        this.rateLimitedPoints.add(jsonPoint)
        setTimeout(()=>{
            this.rateLimitedPoints.delete(jsonPoint)
        }, this.rateLimiting)
        this.eventField.dispatchEvent(
        new CustomEvent(jsonPoint, { detail: signal })
        );
    }
    entityOutput(fromEntity: Entity, prongKind: string, signal: Signal) {
        fromEntity
        .prongedSpec!.prongsBySystem.get(this)
        ?.outputs.forEach((output) => {
            if (output.kind === prongKind) {
            const absPos = absPosition(output.attachedVector, 
                this.phys.position(fromEntity)!, 
                this.phys.rotation(fromEntity)!);
            this.output(absPos, signal);
            }
        });
    }
    private unplug(entity: Entity) {
        entity.prongedSpec!.prongsBySystem.get(this)?.inputs.forEach((input) => {
        this.eventField.removeEventListener(
            JSON.stringify(absPosition(input.attachedVector, 
                this.phys.position(entity)!, 
                this.phys.rotation(entity)!)),
            e=>{getProngedSpecListener(entity, input)((e as CustomEvent).detail as Signal)}
        );
        });
    }
    private plug(entity: Entity) {
        entity.prongedSpec!.prongsBySystem.get(this)?.inputs.forEach((input) => {
        this.eventField.addEventListener(
            JSON.stringify(absPosition(input.attachedVector, 
                this.phys.position(entity)!, 
                this.phys.rotation(entity)!)),
            e=>{getProngedSpecListener(entity, input)((e as CustomEvent).detail as Signal)}
        );
        });
    }
    addEntity(entity: Entity) {
        this.phys.onUnplaced(entity, () => this.unplug(entity));
        this.phys.onPlaced(entity, () => this.plug(entity));
    }
    makeRelayInputListener(entity: Entity, processing: (signal: Signal) => Signal = identityFunction) {
        return (signal: Signal)=>{
            const newSignal = processing(signal);
            this.entityOutput(entity, '', newSignal);
        }
    }
    isRateLimited(position: [number, number]) {
        return this.rateLimitedPoints.has(JSON.stringify(position))
    }
}