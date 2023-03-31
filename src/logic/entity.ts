import { ProngedComponent, IProngedComponent } from "./prong"
import { DamageableComponent } from "./damageable";
import random from "../utils/random"
import { ContainerComponent, HandComponent, CredentialComponent } from "./container";
import { ExaminableComponent } from "./examinable";
import { LightSourceComponent } from "./lighting";
import { CraftingComponent } from "./crafting";
import { CooldownComponent } from "./scheduler";
import { SaturatedAction } from "./action";
import { SignalQueueComponent } from "./mux";
export default class Entity implements IEntity {
    essence?: string;
    examinableComp?: ExaminableComponent;
    prongedComp?: ProngedComponent;
    sustainedDmgComp?: DamageableComponent;
    handComp?: HandComponent;
    containerComp?: ContainerComponent;
    credentialComp?: CredentialComponent;
    lightSourceComp?: LightSourceComponent;
    craftingComp?: CraftingComponent;
    cooldownComp?: CooldownComponent;
    timeOut?: SaturatedAction;
    signalQueueComp?: SignalQueueComponent
    constructor(readonly id: string, readonly size: number, public blocksMovement = false) {
    }
    copy() {
      const newEntity = new Entity(this.id, this.size, this.blocksMovement)
      newEntity.essence = this.essence
      newEntity.examinableComp = this.examinableComp
      newEntity.handComp = this.handComp
      newEntity.containerComp = this.containerComp
      newEntity.lightSourceComp = this.lightSourceComp
      newEntity.craftingComp = this.craftingComp
      newEntity.prongedComp = this.prongedComp?.copy(newEntity)
      newEntity.cooldownComp = this.cooldownComp?.copy()
      return newEntity
    }
  }
export interface IEntity {
    readonly essence?: string;
    readonly id: string;
    readonly size: number;
    readonly blocksMovement: boolean;
    readonly examinableComp?: ExaminableComponent;
    readonly prongedComp?: IProngedComponent;
    readonly handComp?: HandComponent;
    readonly containerComp?: ContainerComponent;
    readonly credentialComp?: CredentialComponent;
    readonly lightSourceComp?: LightSourceComponent;
    readonly craftingComp?: CraftingComponent
    readonly cooldownComp?: CooldownComponent
}