import { ProngedComponent, IProngedComponent } from "./prong"
import { DamageableComponent } from "./damageable";
import random from "../utils/random"
import { ContainerComponent, HandComponent, CredentialComponent } from "./container";
import { ExaminableComponent } from "./examinable";
import { LightSourceComponent } from "./lightning";
import { CraftingComponent } from "./crafting";
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
    constructor(readonly id: string, readonly size: number, public blocksMovement = false) {
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
}