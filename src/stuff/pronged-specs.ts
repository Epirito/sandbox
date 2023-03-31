import { ProngSpec, ProngSystem, Signal, signalHop } from "../logic/prong";
import { LightSourceComponent } from "../logic/lighting";
import Entity from "../logic/entity";
import { Scheduler } from "../logic/scheduler";
import { muxDequeue, turnOff } from "./world-actions";
import { ActionRequester } from "../logic/action-requester";
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
    const scheduler = dependencies['scheduler'] as Scheduler;
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
                scheduler.clear(entity.timeOut);
                entity.timeOut = scheduler.schedule(60, turnOff.from([entity], {}))
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
    const {actionRequester, scheduler, electricity} = (dependencies as {scheduler: Scheduler, actionRequester: ActionRequester, electricity: ProngSystem});
    const  makeDemuxListener = (entity: Entity)=> (signal: Signal) => {
        if (signal.lastHop === entity.id) {
            return
        }
        const newSignal = Object.assign({}, signal)
        const prong = newSignal.muxStack.pop()
        if (prong) {
            electricity.entityOutput(entity, prong, signalHop(newSignal, entity))
        }
    }
    const makeMuxListener = (prong: string)=> (entity: Entity)=> (signal: Signal) => {
        if (signal.lastHop === entity.id) {
            return
        }
        entity.signalQueueComp!.push({prong, signal})
        if (entity.signalQueueComp!.length===1) {
            scheduler.schedule!(Math.floor(electricity.rateLimiting*60/1000)+1, muxDequeue.from([entity]))
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