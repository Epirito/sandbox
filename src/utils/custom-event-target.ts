import { SaturatedAction } from "../logic/action";
import { ActionRequester } from "../logic/action-requester";
import MultiMap from "./multi-map";


export interface CopiableEventTargetEvent {
    terms?: string[]
    vals?: Object
}
export class CopiableEventTarget<T extends CopiableEventTargetEvent> {
    constructor(private actionRequester: ActionRequester) {}
    private listeners = new MultiMap<string, SaturatedAction>()
    dispatch(type: string, event: T) {
        this.listeners.get(type).forEach(listener=>{
            this.actionRequester.doAction!(
                listener[0], 
                [...listener[1], ...(event.terms ?? [])], 
                {...listener[2], ...(event.vals ?? {})}
            )
        })
    }
    addEventListener(type: string, listener: SaturatedAction) {
        this.listeners.set(type, listener)
    }
    removeEventListener(type: string, listener: SaturatedAction) {
        this.listeners.remove(type, listener)
    }
    copy() {
        const newTarget = new CopiableEventTarget<T>(this.actionRequester)
        this.listeners.forEach((listeners, type)=>{
            listeners.forEach(listener=>{
                newTarget.listeners.set(type, listener)
            })
        })
        return newTarget
    }
}