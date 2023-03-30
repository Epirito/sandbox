import { LightSourceExaminableComponent, PlainExaminableComponent } from "../logic/examinable";

export const examinables = {
    craftingTable: new PlainExaminableComponent('crafting table', 'A table for crafting.'),
    chest: new PlainExaminableComponent('chest', 'An unlocked chest.'),
    man: new PlainExaminableComponent('man', ''),
    wire: new PlainExaminableComponent('wire', ''),
    pressurePlate: new PlainExaminableComponent('pressure plate', ''),
    lamp: new LightSourceExaminableComponent('lamp', ''),
    bimux: new PlainExaminableComponent('mux', 'Joins signals together or splits them apart.'),
    belt: new PlainExaminableComponent('belt', 'Moves entities.'),
}