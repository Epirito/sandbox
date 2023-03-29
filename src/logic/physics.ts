import MultiMap from "mnemonist/multi-map";
import Entity, { IEntity } from "./entity";
import { sum, rotatedBy } from "../utils/vector";

class PhysicsState {
  constructor(public position: [number, number], public rotation: number) {}
  absPosition(
    attachedVector: [number, number],
  ): [number, number] {
    return sum(this.position, rotatedBy(attachedVector, this.rotation));
  }
}
export class PhysicsSystem implements IPhysicsSystem {
  private unplaced = new EventTarget();
  private placed = new EventTarget();
  private placedAt = new EventTarget();
  private unplacedFrom = new EventTarget();
  private stateByEntity = new Map<Entity, PhysicsState>();
  private entitiesByPosition = new MultiMap<string, Entity>();
  
  position(entity: Entity) {
    return this.stateByEntity.get(entity)?.position;
  }
  rotation(entity: Entity) {
    return this.stateByEntity.get(entity)?.rotation;
  }
  facing(entity: Entity) {
    return rotatedBy([1,0], this.rotation(entity)!);
  }
  inFrontOf(entity: Entity) {
    return sum(this.facing(entity), this.position(entity)!);
  }
  isBlocked(position: [number, number]) {
    return this.entitiesByPosition.get(JSON.stringify(position))?.some(x=>x.blocksMovement) ?? false
  }
  entitiesAt(position: [number, number]) {
    return this.entitiesByPosition.get(JSON.stringify(position)) ?? [];
  }
  onUnplaced(entity: Entity, callback: () => void) {
    this.unplaced.addEventListener(entity.id, callback);
  }
  removeOnUnplaced(entity: Entity, callback: () => void) {
    this.unplaced.removeEventListener(entity.id, callback);
  }
  onPlaced(entity: Entity, callback: () => void) {
    this.placed.addEventListener(entity.id, callback);
  }
  removeOnPlaced(entity: Entity, callback: () => void) {
    this.placed.removeEventListener(entity.id, callback);
  }
  removeOnUnplacedFrom(position: [number, number], callback: (event: CustomEvent) => void) {
    this.unplacedFrom.removeEventListener(JSON.stringify(position), callback as (Event)=>void);
  }
  onPlacedAt(position: [number, number], callback: (evt: CustomEvent) => void) {
    this.placedAt.addEventListener(JSON.stringify(position), callback as (Event)=>void);
  }
  onUnplacedFrom(position: [number, number], callback: (evt: CustomEvent) => void) {
    this.unplacedFrom.addEventListener(JSON.stringify(position), callback as (Event)=>void);
  }
  removeOnPlacedAt(position: [number, number], callback: (evt: CustomEvent) => void) {
    this.placedAt.removeEventListener(JSON.stringify(position), callback as (Event)=>void);
  }
  unplace(entity: Entity) {
    const state =  this.stateByEntity.get(entity);
    if (state) {
      this.unplaced.dispatchEvent(new CustomEvent(entity.id, { detail: entity }));
      this.unplacedFrom.dispatchEvent(new CustomEvent(JSON.stringify(state.position), { detail: entity }));
      this.entitiesByPosition.remove(JSON.stringify(state.position), entity)
      this.stateByEntity.delete(entity);
    }
  }
  private _place(entity: Entity, position: [number, number], rotation: number) {
    const newPosJSON = JSON.stringify(position);
    this.stateByEntity.set(entity, new PhysicsState(position, rotation));
    this.entitiesByPosition.set(newPosJSON, entity)
    this.placed.dispatchEvent(new CustomEvent(entity.id, { detail: entity }));
    this.placedAt.dispatchEvent(new CustomEvent(newPosJSON, { detail: entity }));
  }
  place(entity: Entity, options: {position?: [number, number], rotation?: number}) {
    // to do: make it private and hide it behind a method that checks for collisions
    if (options.position===undefined) {
      options.position = this.stateByEntity.get(entity)!.position;
    }
    if (options.rotation===undefined) {
      options.rotation = this.stateByEntity.get(entity)!.rotation;
    }
    if (this.stateByEntity.has(entity)) {
      this.unplace(entity);
    }
    this._place(entity, options.position, options.rotation);
  }
  destroy(entity: Entity) {
    this.unplace(entity);
  }
}
export interface IPhysicsSystem {
  position(entity: IEntity): [number, number] | undefined;
  rotation(entity: IEntity): number | undefined;
  facing(entity: IEntity): [number, number] | undefined;
  inFrontOf(entity: IEntity): [number, number] | undefined;
  isBlocked(position: [number, number]): boolean;
  entitiesAt(position: [number, number]): IEntity[],
}