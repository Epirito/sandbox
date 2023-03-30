import { drop, insertInto, open, pickUp, withdraw } from "../logic/actions";
import { IPhysicsSystem } from "../logic/physics";
import { SimulationPOV } from "../logic/simulation-pov";
import List from "./List";
import { getGlyph } from "./glyphs";
import { useGameState } from "./hooks";

export default function Ui(props: {pov: SimulationPOV, screenUpdater: EventTarget}) {
    const pov = props.pov;
    const physics = pov.phys;
    const container = pov.container
    const player = useGameState(()=>pov.player, props.screenUpdater)
    const contents = useGameState(()=>pov.openContainer ? 
        container.contents(pov.openContainer) : null, props.screenUpdater)
    const entities = useGameState(()=>[...physics.entitiesAt(pov.listFront ? 
        physics.inFrontOf(player)! : physics.position(player)!)], props.screenUpdater)
    return <List 
        examinationOutputs={(contents ?? entities.filter(entity=>entity!==player))
            .map(entity=>{
                const examinable = entity.examinableComp!;
                const [name, description] = examinable.examine(player, entity);
                return {
                glyph: getGlyph(entity),
                name,
                description,
                id: entity.id
                }
            })}
        onItemSelect={{
            e: (id)=>{pov.playerAction(open.iota, [id])},
            q: (id)=>{
                if (pov.openContainer) {
                    pov.playerAction(withdraw.iota, [id, pov.openContainer.id])
                }else {
                    pov.playerAction(pickUp.iota, [id])
                }
            }
        }}
        onNullSelect={{
            q: ()=>{
                if (pov.openContainer) {
                    pov.playerAction(insertInto.iota, [pov.openContainer.id])
                }else {
                    pov.playerAction(drop.iota, [])
                }
            }
        }}
    />;
}