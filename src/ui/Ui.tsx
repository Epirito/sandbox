import { listFront } from "../example";
import { drop, open, pickUp } from "../logic/actions";
import { IPhysicsSystem } from "../logic/physics";
import { SimulationPOV } from "../logic/simulation-pov";
import List from "./List";
import { getGlyph } from "./glyphs";
import { useGameState } from "./hooks";

export default function Ui(props: {pov: SimulationPOV, screenUpdater: EventTarget}) {
    const pov = props.pov;
    const physics = pov.phys;
    const player = useGameState(()=>pov.player, props.screenUpdater)
    const outputs = useGameState(()=>physics.entitiesAt(listFront ? 
        physics.inFrontOf(player)! : physics.position(player)!)
        .filter(entity=>entity!==player)
        .map(entity=>{
            const examinable = entity.examinableComp!;
            const [name, description] = examinable.examine(player, entity);
            return {
            glyph: getGlyph(entity),
            name,
            description,
            id: entity.id
            }
        }), props.screenUpdater)
    return <List 
        examinationOutputs={outputs} 
        onSelect={console.log} 
        onESelect={(id)=>{pov.playerAction(open.iota, [id])}} 
        onQSelect={(id)=>{pov.playerAction(pickUp.iota, [id])}} 
        onNullQSelect={()=>{pov.playerAction(drop.iota, [])}}
    />;
}