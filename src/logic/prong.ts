import Entity from "./entity";
import {PhysicsSystem} from "./physics";
import { absPosition } from "../utils/vector";
import identityFunction from "../utils/identity-function";
import { System } from "./simulation";
import { Action } from "./action";

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
    inputListenerFactories?: Map<string, (prongedEntity: Entity)=>(signal: Signal)=>void>
}
export interface IProngedComponent {
    readonly prongedSpec: ProngedSpec
}
export class ProngedComponent implements IProngedComponent {
    private inputListenerByInputKind?: Map<string, (event: CustomEvent)=>void>
    inputListener(inputKind: string) {
        return this.inputListenerByInputKind?.get(inputKind);
    }
    constructor(readonly prongedSpec: ProngedSpec, me: Entity) {
        if (prongedSpec.inputListenerFactories) {
            this.inputListenerByInputKind = new Map();
            prongedSpec.inputListenerFactories.forEach((factory, inputKind)=>{
                this.inputListenerByInputKind!.set(inputKind, event=>factory(me)(event.detail))
            })
        }
    }
    copy(newEntity) {
        return new ProngedComponent(this.prongedSpec, newEntity)
    }
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
export interface IProngSystem extends System {
    isRateLimited(position: [number, number]): boolean
}

export class ProngSystem implements IProngSystem {
    static plug = new Action(undefined, dependencies=>(terms,vals) => {
        const {electricity} = dependencies as {electricity: ProngSystem}
        const [entity] = terms
        electricity.plug(entity)
    })
    static unplug = new Action(undefined, dependencies=>(terms,vals) => {
        const {electricity} = dependencies as {electricity: ProngSystem}
        const [entity] = terms
        electricity.unplug(entity)
    })
    private eventField = new EventTarget();
    private rateLimitedPoints = new Set<string>();
    phys: PhysicsSystem;
    constructor(private dependencies: Object, readonly rateLimiting = 1000/15) {
        this.phys = dependencies['phys'] as PhysicsSystem;
    }
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
        fromEntity.prongedComp?.prongedSpec.prongsBySystem.get(this)
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
        entity.prongedComp?.prongedSpec.prongsBySystem.get(this)?.inputs.forEach((input) => {
        this.eventField.removeEventListener(
            JSON.stringify(absPosition(input.attachedVector, 
                this.phys.position(entity)!, 
                this.phys.rotation(entity)!)),
            (entity.prongedComp!.inputListener(input.kind)! as (Event)=>void)
        );
        });
    }
    private plug(entity: Entity) {
        entity.prongedComp?.prongedSpec.prongsBySystem.get(this)?.inputs.forEach((input) => {
        this.eventField.addEventListener(
            JSON.stringify(absPosition(input.attachedVector, 
                this.phys.position(entity)!, 
                this.phys.rotation(entity)!)),
            (entity.prongedComp!.inputListener(input.kind)! as (Event)=>void)
        );
        });
    }
    addEntity(entity: Entity) {
        this.phys.onUnplaced(entity, [ProngSystem.unplug.iota, [entity.id], {}]);
        this.phys.onPlaced(entity, [ProngSystem.plug.iota, [entity.id], {}]);
    }
    makeRelayInputListener = (entity: Entity, processing: (signal: Signal) => Signal = identityFunction)=>{
        return (signal: Signal)=>{
            const newSignal = processing(signal);
            this.entityOutput(entity, '', newSignal);
        }
    }
    isRateLimited(position: [number, number]) {
        return this.rateLimitedPoints.has(JSON.stringify(position))
    }
    copy(dependencies) {
        const copy = new ProngSystem(dependencies, this.rateLimiting)
        return copy
    }
}