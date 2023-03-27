import { ProngedSpec } from "./prong"
import { DamageableComponent } from "./damageable";
import random from "../utils/random"
import { ContainerComponent, HandComponent, CredentialComponent } from "./container";
import { ExaminableComponent } from "./examinable";
import { LightSourceComponent } from "./lightning";
export default class Entity {
    id!: string;
    examinableComp?: ExaminableComponent;
    prongedSpec?: ProngedSpec;
    sustainedDmgComp?: DamageableComponent;
    handComp?: HandComponent;
    containerComp?: ContainerComponent;
    credentialComp?: CredentialComponent;
    lightSourceComp?: LightSourceComponent;
    constructor(readonly size: number, public blocksMovement = false) {
      this.id = random.next().toString(36).substring(2);
    }
  }