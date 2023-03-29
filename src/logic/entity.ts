import { ProngedComponent, IProngedComponent } from "./prong"
import { DamageableComponent } from "./damageable";
import random from "../utils/random"
import { ContainerComponent, HandComponent, CredentialComponent } from "./container";
import { ExaminableComponent } from "./examinable";
import { LightSourceComponent } from "./lightning";
export default class Entity implements IEntity {
    examinableComp?: ExaminableComponent;
    prongedComp?: ProngedComponent;
    sustainedDmgComp?: DamageableComponent;
    handComp?: HandComponent;
    containerComp?: ContainerComponent;
    credentialComp?: CredentialComponent;
    lightSourceComp?: LightSourceComponent;
    constructor(readonly id: string, readonly size: number, public blocksMovement = false) {
    }
  }
export interface IEntity {
    readonly id: string;
    readonly size: number;
    readonly blocksMovement: boolean;
    readonly examinableComp?: ExaminableComponent;
    readonly prongedComp?: IProngedComponent;
    readonly handComp?: HandComponent;
    readonly containerComp?: ContainerComponent;
    readonly credentialComp?: CredentialComponent;
    readonly lightSourceComp?: LightSourceComponent;
}