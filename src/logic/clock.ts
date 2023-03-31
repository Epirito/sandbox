import { System } from "./simulation"

export class Clock implements System {
    private events = new EventTarget()
    constructor(private time: number = 0) {
    }
    get t() {return this.time}
    tick() {
        this.time += 1
        this.events.dispatchEvent(new CustomEvent('tick', {detail: this.time}))
    }
    onTick = (cb)=> {
        this.events.addEventListener('tick', cb)
    }
    removeOnTick = (cb)=> {
        this.events.removeEventListener('tick', cb)
    }
    copy() {
        return new Clock(this.time)
    }
}