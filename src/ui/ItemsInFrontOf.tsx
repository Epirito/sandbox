import { sim } from "../example";
import { drop, pickUp } from "../logic/actions";
import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import List from "./List";
import { getGlyph } from "./glyphs";
import { useGameState } from "./hooks";

export default function ItemsInFrontOf(props: {player: Entity, physics: PhysicsSystem, screenUpdater: EventTarget}) {
    const outputs = useGameState(()=>props.physics.entitiesAt(props.physics.position(props.player)!)
        .filter(entity=>entity!==props.player)
        .map(entity=>{
            const examinable = entity.examinableComp!;
            const [name, description] = examinable.examine(props.player, entity);
            return {
            glyph: getGlyph(entity),
            name,
            description,
            id: entity.id
            }
        }), props.screenUpdater)
    return (
        <List examinationOutputs={outputs} onSelect={console.log} onQSelect={(id)=>{sim.doAction(pickUp.iota, [props.player.id, id])}} onNullQSelect={()=>{sim.doAction(drop.iota, [props.player.id])}}/>
    );
}