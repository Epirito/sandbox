import Entity from "../logic/entity";
import { ExaminableComponent } from "../logic/examinable";
import { examinables } from "../stuff/examinables";

const glyphs: Map<ExaminableComponent | undefined, (entity: Entity)=>string> = new Map()
const rawGlyphs = {
    chest: '🗄️',
    man: '👨‍🦲',
    wire: '+',
    pressurePlate: '_',
    mux: '>',
    demux: '<',
    lamp: {on: '💡', off: 'O'},
}
for(const glyph in rawGlyphs) {
    if (rawGlyphs[glyph].on) {
        glyphs.set(examinables[glyph], (entity: Entity)=>{
            if (entity.lightSourceComp) {
                return rawGlyphs[glyph].on
            }
            return rawGlyphs[glyph].off
        })
    }else {
        glyphs.set(examinables[glyph], ()=>rawGlyphs[glyph])
    }
}
export function getGlyph(entity: Entity):string {
    return glyphs.get(entity.examinableComp)!(entity)
}