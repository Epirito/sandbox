import { useEffect, useState } from "react";
import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import List from "./List";
import { getGlyph } from "./glyphs";
import { useGameState } from "./hooks";

export default function ItemsInFrontOf(props: {entity: Entity, physics: PhysicsSystem, screenUpdater: EventTarget}) {
    const outputs = useGameState(()=>props.physics.entitiesAt(props.physics.position(props.entity)!)
        .filter(entity=>entity!==props.entity)
        .map(entity=>{
            const examinable = entity.examinableComp!;
            const [name, description] = examinable.examine(props.entity, entity);
            return {
            glyph: getGlyph(entity),
            name,
            description,
            id: entity.id
            }
        }), props.screenUpdater)
    return (
        <List examinationOutputs={outputs} /*selected={selected}*//>
    );
}