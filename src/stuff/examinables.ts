import { LightSourceExaminableComponent, PlainExaminableComponent } from "../logic/examinable";

export const examinables = {
    chest: new PlainExaminableComponent('chest', 'An unlocked chest.'),
    man: new PlainExaminableComponent('man', ''),
    wire: new PlainExaminableComponent('wire', ''),
    pressurePlate: new PlainExaminableComponent('pressure plate', ''),
    lamp: new LightSourceExaminableComponent('lamp', ''),
    mux: new PlainExaminableComponent('mux', 'Joins signals together.'),
    demux: new PlainExaminableComponent('demux', 'Splits muxed signals.')
}