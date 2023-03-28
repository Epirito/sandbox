import { ProngSpec, ProngSystem, Signal, signalHop } from "../logic/prong";
import { LightSourceComponent } from "../logic/lightning";
import Entity from "../logic/entity";
export const inputSpec = (dependencies)=> {
    const electricity = dependencies.electricity;
    return {
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
}
export const lampSpec = dependencies=> {
    const electricity = dependencies.electricity;
    let timeOut:  number | undefined = undefined;
    return {
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
        inputListenerFactories: new Map([
            ["", (entity)=> (_)=> {
                entity.lightSourceComp = new LightSourceComponent(5);
                clearTimeout(timeOut);
                timeOut = setTimeout(()=>{
                    entity.lightSourceComp = undefined;
                }, 1000)
            }]
        ]),
    }
}
export const wireSpec = dependencies=> {
    const electricity = dependencies.electricity;
    return {
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
        inputListenerFactories: new Map([
            ["", electricity.makeRelayInputListener]
        ])
    }
};
export const bimuxSpec = (dependencies: Object)=> {
    const electricity = (dependencies as {electricity: ProngSystem}).electricity ;
    const  makeDemuxListener = (entity)=> (signal: Signal) => {
        if (signal.lastHop === entity.id) {
            return
        }
        const newSignal = Object.assign({}, signal)
        const prong = newSignal.muxStack.pop()
        if (prong) {
            electricity.entityOutput(entity, prong, signalHop(newSignal, entity))
        }
    }
    const queue: {signal: Signal, prong: string}[] = []
    let timeOut: number | undefined = undefined
    const makeMuxListener = (prong: string)=> (entity: Entity)=> (signal: Signal) => {
        if (signal.lastHop === entity.id) {
            return
        }
        function outputMuxed(signalKind: {prong: string, signal: Signal}) {
            const newSignal = Object.assign({}, signal)
            newSignal.muxStack.push(signalKind.prong)
            electricity.entityOutput(entity, "", signalHop(newSignal, entity))
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
    return {
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
        inputListenerFactories: new Map([
            ["", makeDemuxListener],
            ["a", makeMuxListener("a")],
            ["b", makeMuxListener("b")],
            ["c", makeMuxListener("c")],
        ]),
    }
};