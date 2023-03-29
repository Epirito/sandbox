import Entity, { IEntity } from "../logic/entity";
import { ExaminableComponent } from "../logic/examinable";
import { examinables } from "../stuff/examinables";

const glyphs: Map<ExaminableComponent | undefined, (entity: IEntity)=>string> = new Map()
const rawGlyphs = {
    chest: '🗄️',
    man: '👨‍🦲',
    wire: '+',
    pressurePlate: '_',
    mux: '>',
    demux: '<',
    belt: '⬆️',
    lamp: {on: '💡', off: 'O'},
}
for(const glyph in rawGlyphs) {
    if (rawGlyphs[glyph].on) {
        glyphs.set(examinables[glyph], (entity: IEntity)=>{
            if (entity.lightSourceComp) {
                return rawGlyphs[glyph].on
            }
            return rawGlyphs[glyph].off
        })
    }else {
        glyphs.set(examinables[glyph], ()=>rawGlyphs[glyph])
    }
}
export function getGlyph(entity: IEntity):string {
    return glyphs.get(entity.examinableComp)!(entity)
}