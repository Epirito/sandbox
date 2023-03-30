import MultiMap from "../utils/multi-map";
import Entity from "./entity";
import {PhysicsSystem} from "./physics";

export class HandComponent {
  constructor(readonly capacity: number) {}
}
export class CredentialComponent {}
export class ContainerComponent {
  constructor(readonly capacity: number, readonly keyCanOpen?: (key: CredentialComponent)=>boolean) {}
}
export interface IContainerSystem {
  getEquipped(actor: Entity): Entity | undefined;
  contents(container: Entity): Entity[];
}
export default class ContainerSystem implements IContainerSystem {
  private containedByContainer: MultiMap<Entity, Entity> = new MultiMap();
  private equippedByEntity: Map<Entity, Entity> = new Map();
  constructor(private phys: PhysicsSystem) {}
  placeInside(container: Entity, item: Entity) {
    this.containedByContainer.set(container, item);
  }
  tryPickUp(actor: Entity, item: Entity) {
    if (this.getEquipped(actor)) {
      return 'already holding something'
    }
    this.phys.unplace(item);
    this.equippedByEntity.set(actor, item);
  }
  tryInsertInto(actor: Entity, into: Entity) {
    const item = this.getEquipped(actor);
    if (!item) {
      return 'not holding item'
    }
    if (this.containedByContainer.get(into)?.length === into.containerComp?.capacity) {
      return 'container full'
    }
    this.equippedByEntity.delete(actor);
    this.containedByContainer.set(into, item);
  }
  enter(actor: Entity, container: Entity) {
    this.phys.unplace(actor);
    this.containedByContainer.set(container, actor);
  }
  tryWithdraw(actor: Entity, item: Entity, container: Entity) {
    if (this.getEquipped(actor)) {
      return 'already holding something'
    }
    this.containedByContainer.remove(container, item);
    this.equippedByEntity.set(actor, item);  
  }
  spill(container: Entity) {
    this.containedByContainer.get(container)?.forEach((item) => {
      this.phys.place(item,{position: this.phys.position(container)!, rotation: 0});
    });
    this.containedByContainer.delete(container);
  }
  tryDrop(actor: Entity) {
    const item = this.equippedByEntity.get(actor);
    if (!item) {
      return 'not holding item'
    }
    this.phys.place(item,{position: this.phys.position(actor)!, rotation: this.phys.rotation(actor)!});
    this.equippedByEntity.delete(actor);
  }
  cleanUpDestroyed(entity: Entity) {
    this.tryDrop(entity);
    this.spill(entity);
  }
  getEquipped(actor: Entity) {
    return this.equippedByEntity.get(actor);
  }
  contents(container: Entity) {
    return this.containedByContainer.get(container);
  }
}

export function canPickUp(actor: Entity, item: Entity) {
  return actor.handComp && actor.handComp.capacity>=item.size
}

export function canInsertInto(item: Entity, container: Entity) {
  return container.containerComp && container.containerComp.capacity>=item.size
}

export function canOpen(actor: Entity, container: Entity) {
  return !container.containerComp!.keyCanOpen || actor.credentialComp && container.containerComp!.keyCanOpen(actor.credentialComp)
}