import CharacterMovement from "../logic/character-movement";
import Entity from "../logic/entity";
import { LightSourceComponent } from "../logic/lightning";
import { PhysicsSystem } from "../logic/physics";
import { ProngSpec, ProngSystem, Signal, defaultSignal, signalHop } from "../logic/prong";
import { examinables } from "../stuff/examinables";
export const physics = new PhysicsSystem();
export const electricity = new ProngSystem(physics);
export const charMov = new CharacterMovement(physics);

export function makeWire(electricity: ProngSystem) {
    const wire = new Entity(2);
    wire.examinableComp = examinables.wire;
    electricity.addEntity(wire);
    wire.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [
                        new ProngSpec([0,0], "")
                    ],
                    outputs: [
                        new ProngSpec([1, 0], ""),
                        new ProngSpec([-1, 0], ""),
                        new ProngSpec([0, 1], ""),
                        new ProngSpec([0, -1], ""),
                    ],
                },
            ],
        ]),
        inputListenerByEntityIdXInputKindPair: new Map([
            [JSON.stringify([wire.id, ""]), electricity.makeRelayInputListener(wire)]
        ]),
    };

    return wire;
}
export function makeMux(electricity: ProngSystem) {
    const mux = new Entity(2);
    mux.examinableComp = examinables.mux;
    electricity.addEntity(mux);
    const queue: {signal: Signal, prong: string}[] = []
    let timeOut: number | undefined = undefined
    const listener = (prong: string) => (signal: Signal) => {
        function outputMuxed(signalKind: {prong: string, signal: Signal}) {
            const newSignal = Object.assign({}, signal)
            newSignal.muxStack.push(signalKind.prong)
            electricity.entityOutput(mux, "", newSignal)
        }
        if (timeOut===undefined) {
            timeOut = setTimeout(()=>{
                const output = queue.shift()
                if (output!==undefined) {
                    outputMuxed(output)
                }
                timeOut = undefined
            }, electricity.rateLimiting + 1)
            outputMuxed({signal, prong})
        }else {
            queue.push({signal, prong})
        }
    }
    mux.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [
                        new ProngSpec([0,-1], "a"),
                        new ProngSpec([-1,0], "b"),
                        new ProngSpec([0,1], "c"),
                    ],
                    outputs: [
                        new ProngSpec([1, 0], ""),
                    ],
                },
            ],
        ]),
        inputListenerByEntityIdXInputKindPair: new Map([
            [JSON.stringify([mux.id, "a"]), listener("a")],
            [JSON.stringify([mux.id, "b"]), listener("b")],
            [JSON.stringify([mux.id, "c"]), listener("c")],
        ]),
    };
    
    
    return mux;
}


export function makeBimux(electricity: ProngSystem) {
    const bimux = new Entity(2);
    bimux.examinableComp = examinables.mux;
    electricity.addEntity(bimux);
    const  demuxListener = (signal: Signal) => {
        if (signal.lastHop === bimux.id) {
            return
        }
        const newSignal = Object.assign({}, signal)
        const prong = newSignal.muxStack.pop()
        if (prong) {
            electricity.entityOutput(bimux, prong, signalHop(newSignal, bimux))
        }
    }
    const queue: {signal: Signal, prong: string}[] = []
    let timeOut: number | undefined = undefined
    const muxListener = (prong: string) => (signal: Signal) => {
        if (signal.lastHop === bimux.id) {
            return
        }
        function outputMuxed(signalKind: {prong: string, signal: Signal}) {
            const newSignal = Object.assign({}, signal)
            newSignal.muxStack.push(signalKind.prong)
            electricity.entityOutput(bimux, "", signalHop(newSignal, bimux))
        }
        if (timeOut===undefined) {
            timeOut = setTimeout(()=>{
                const output = queue.shift()
                if (output!==undefined) {
                    outputMuxed(output)
                }
                timeOut = undefined
            }, electricity.rateLimiting + 1)
            outputMuxed({signal, prong})
        }else {
            queue.push({signal, prong})
        }
    }
    bimux.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [
                        new ProngSpec([1,0], ""),
                        new ProngSpec([0,-1], "a"),
                        new ProngSpec([-1,0], "b"),
                        new ProngSpec([0,1], "c"),
                    ],
                    outputs: [
                        new ProngSpec([1, 0], ""),
                        new ProngSpec([0, -1], "a"),
                        new ProngSpec([-1, 0], "b"),
                        new ProngSpec([0, 1], "c"),
                    ],
                },
            ],
        ]),
        inputListenerByEntityIdXInputKindPair: new Map([
            [JSON.stringify([bimux.id, ""]), signal=>demuxListener(signal)],
            [JSON.stringify([bimux.id, "a"]), muxListener("a")],
            [JSON.stringify([bimux.id, "b"]), muxListener("b")],
            [JSON.stringify([bimux.id, "c"]), muxListener("c")],
        ]),
    };
    
    
    return bimux;
}
export function makeDemux(electricity: ProngSystem) {
    const demux = new Entity(2);
    demux.examinableComp = examinables.demux;
    electricity.addEntity(demux);
    const  listener = (signal: Signal) => {
        const newSignal = Object.assign({}, signal)
        const prong = newSignal.muxStack.pop()
        if (prong) {
            electricity.entityOutput(demux, prong, newSignal)
        }
    }
    demux.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [
                        new ProngSpec([-1,0], "")
                    ],
                    outputs: [
                        new ProngSpec([0, -1], "a"),
                        new ProngSpec([1, 0], "b"),
                        new ProngSpec([0, 1], "c"),
                    ],
                },
            ],
        ]),
        inputListenerByEntityIdXInputKindPair: new Map([
            [JSON.stringify([demux.id, ""]), signal=>listener(signal)]
        ]),
    };
    
    
    return demux;
}
export function makePressurePlate(phys: PhysicsSystem, electricity: ProngSystem, triggeringSize: number) {
    const plate = new Entity(1);
    plate.examinableComp = examinables.pressurePlate;
    electricity.addEntity(plate);
    plate.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [],
                    outputs: [
                        new ProngSpec([1,0], "")
                    ],
                },
            ]
        ]),
    }
    let timeOut: number | undefined = undefined
    const detection = (entity)=>{
        const combinedSize = phys.entitiesAt(phys.position(plate)!).reduce((acc, entity)=>acc+entity.size, 0)

        if (combinedSize>triggeringSize) {
            function pulse() {
                electricity.entityOutput(plate, "", defaultSignal)
                clearTimeout(timeOut)
                timeOut = setTimeout(()=>{
                    pulse()
                }, 1000)
            }
            pulse()
        }else {
            clearTimeout(timeOut)
        }
    }
    phys.onPlaced(plate, ()=>{
        phys.onPlacedAt(phys.position(plate)!,detection)
        phys.onUnplacedFrom(phys.position(plate)!, detection)
    })
    phys.onUnplaced(plate, ()=>{
        phys.removeOnPlacedAt(phys.position(plate)!, detection)
        phys.removeOnUnplacedFrom(phys.position(plate)!, detection)
    })
    return plate;
}
export function makeLamp(electricity: ProngSystem) {
    const lamp = new Entity(2);
    lamp.examinableComp = examinables.lamp;
    electricity.addEntity(lamp);
    let timeOut:  number | undefined = undefined;
    lamp.prongedSpec = {
        prongsBySystem: new Map([
            [
                electricity,
                {
                    inputs: [
                        new ProngSpec([0,0], "")
                    ],
                    outputs: [],
                },
            ]
        ]),
        inputListenerByEntityIdXInputKindPair: new Map([[JSON.stringify([lamp.id, ""]), (_)=>{
            lamp.lightSourceComp = new LightSourceComponent(5);
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                lamp.lightSourceComp = undefined;
            }, 1000)
        }]]),
    }
    return lamp;
}