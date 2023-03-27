import { MultiMap } from "mnemonist";
import Entity from "./entity";
import {PhysicsSystem} from "./physics";

export class HandComponent {
  constructor(readonly capacity: number) {}
}
export class CredentialComponent {}
export class ContainerComponent {
  constructor(readonly capacity: number, readonly keyCanOpen?: (key: CredentialComponent)=>boolean) {}
}
export default class ContainerSystem {
  private containedByContainer: MultiMap<Entity, Entity> = new MultiMap();
  private equippedByEntity: Map<Entity, Entity> = new Map();
  constructor(private phys: PhysicsSystem) {}
  pickUp(actor: Entity, item: Entity) {
    this.phys.unplace(item);
    this.equippedByEntity.set(actor, item);
  }
  insertInto(actor: Entity, item: Entity, into: Entity) {
    this.equippedByEntity.delete(actor);
    this.containedByContainer.set(into, item);
  }
  withdrawFrom(actor: Entity, item: Entity, container: Entity) {
    this.containedByContainer.remove(container, item);
    this.equippedByEntity.set(actor, item);  
  }
  spill(container: Entity) {
    this.containedByContainer.get(container)?.forEach((item) => {
      this.phys.place(item,{position: this.phys.position(container)!, rotation: 0});
    });
    this.containedByContainer.delete(container);
  }
  dropEquipped(actor: Entity) {
    const item = this.equippedByEntity.get(actor);
    if (item) {
      this.phys.place(item,{position: this.phys.position(actor)!, rotation: 0});
      this.equippedByEntity.delete(actor);
    }
  }
  cleanUpDestroyed(entity: Entity) {
    this.dropEquipped(entity);
    this.spill(entity);
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