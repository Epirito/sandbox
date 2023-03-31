import { PriorityQueue } from "../utils/priority-queue";
import { SaturatedAction } from "./action";
import { Clock } from "./clock";
import Entity from "./entity";
import { System } from "./simulation";
export class CooldownComponent implements ICooldownComponent {
    constructor(public cooldown: number = -1) {}
    copy() {return new CooldownComponent(this.cooldown)}
}
export interface ICooldownComponent {
    readonly cooldown: number;
}
export class Scheduler implements System {
    priorityQueue!: PriorityQueue<SaturatedAction>
    cooldowns: Set<Entity> = new Set()
    constructor(private clock: Clock,private actionRequester, priorityQueue?: PriorityQueue<SaturatedAction>) {
        this.priorityQueue = priorityQueue ?? new PriorityQueue()
        clock.onTick(this.onTick)
    }
    schedule(delay: number, action: SaturatedAction) {
        this.priorityQueue.enqueue(this.clock.t + delay, action)
        return action
    }
    setCooldown(entity: Entity, cooldown: number) {
        entity.cooldownComp = entity.cooldownComp ?? new CooldownComponent()
        entity.cooldownComp.cooldown = cooldown
        this.cooldowns.add(entity)
    }
    clear(action: SaturatedAction | undefined) {
        if (action) {
            this.priorityQueue.remove(action)
        }
    }
    onTick = (evt: Event)=>{
        if ((evt as CustomEvent).detail >= this.priorityQueue.head()?.[0]) {
            const [actionIota, termIds, val] = this.priorityQueue.dequeue()!
            this.actionRequester.doAction(actionIota, termIds, val)
        }
    }
    cleanUpDestroyed(entity: Entity) {
        this.cooldowns.delete(entity)
    }
    copy() {return this}
}