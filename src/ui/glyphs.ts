import { trivialSystem } from "../example";
import Entity, { IEntity } from "../logic/entity";
import { ExaminableComponent } from "../logic/examinable";
import { IPhysicsSystem, PhysicsSystem } from "../logic/physics";
import { SimulationPOV } from "../logic/simulation-pov";
import { examinables } from "../stuff/examinables";

const glyphs: Map<ExaminableComponent | undefined, (entity: IEntity, phys?)=>string> = new Map()
const rawGlyphs = {
    craftingTable: ['🛠️'],
    chest: ['🗄️'],
    man: ['👨'],
    wire: ['➰'],
    pressurePlate: ['_'],
    bimux: ['>', 'A', '<', 'V'],
    belt: ['➡️', '⬆️', '⬅️', '⬇️'],
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
    }else{
        glyphs.set(examinables[glyph], (entity, phys: IPhysicsSystem)=> {
            const rotations = rawGlyphs[glyph]
            const glyphRotation = (phys.rotation(entity)??0) % rotations.length
            return rotations[glyphRotation]
        })
    }
}
export function getGlyph(entity: IEntity, pov: SimulationPOV):string {
    return glyphs.get(entity.examinableComp)!(entity, pov.phys)
}
const dummyEntity =  new Entity('',1)
const dummyPhysics = new PhysicsSystem(trivialSystem())
export function getStaticGlyph(examinable: ExaminableComponent) {
    return glyphs.get(examinable)!(dummyEntity, dummyPhysics)
}