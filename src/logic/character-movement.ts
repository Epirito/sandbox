import Entity from "./entity";
import { PhysicsSystem } from "./physics";

export default  class CharacterMovement {
    constructor(private phys: PhysicsSystem) {}
    moveForward(actor: Entity) {
        const destination = this.phys.inFrontOf(actor)
        if (this.phys.isBlocked(destination)) {
            return
        }
        this.phys.place(actor, {position: destination})
    }
}