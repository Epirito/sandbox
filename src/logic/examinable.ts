import Entity from "./entity";

export interface ExaminableComponent {
    examine(actor?: Entity, me?: Entity): [string, string]
}

export class PlainExaminableComponent implements ExaminableComponent {
    constructor(private name: string, private description: string) {}
    examine(): [string, string] {
        return [this.name, this.description]
    }
}
export class LightSourceExaminableComponent implements ExaminableComponent {
    constructor(private name: string, private description: string) {}
    examine(_: Entity, me: Entity): [string, string] {
        return [this.name, this.description + (me.lightSourceComp ? "\nIt's turned on." : "")]
    }
}