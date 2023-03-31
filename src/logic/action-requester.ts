import { SaturatedAction } from "./action";
import { System } from "./simulation";

export interface ActionRequester extends System {
    doAction?(actionIota: number, termIds: string[], vals?: Object): void;
}