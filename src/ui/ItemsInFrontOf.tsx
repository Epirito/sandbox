import { useEffect, useState } from "react";
import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import List from "./List";
import { getGlyph } from "./glyphs";

export default function ItemsInFrontOf(props: {entity: Entity, physics: PhysicsSystem, screenUpdater}) {
    const [outputs, setOutputs] = useState([] as {glyph, name, description}[])
    const listener = ()=>{
        setOutputs(props.physics.entitiesAt(props.physics.inFrontOf(props.entity))
        .map(entity=>{
            const examinable = entity.examinableComp!;
            const [name, description] = examinable.examine(props.entity, entity);
            return {
            glyph: getGlyph(entity),
            name,
            description
            }
        }));
    }
    useEffect(()=>{
        props.screenUpdater.onUpdated = listener
        return ()=>{
            props.screenUpdater.onUpdated = ()=>{}
        }
    })
    return (
        <List examinationOutputs={outputs}/>
    );
}