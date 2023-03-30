import { craft, drop, insertInto, open, pickUp, withdraw } from "../logic/actions";
import { IEntity } from "../logic/entity";
import { SimulationPOV } from "../logic/simulation-pov";
import List from "./List";
import { getGlyph, getStaticGlyph } from "./glyphs";
import { useGameState } from "./hooks";
function ListGameItems<T>(props: {
        getItems: ()=>T[],
        presentItem: (item: T)=>{glyph:string, name: string, description: string, id: string},
        onItemSelect,
        onNullSelect?,
        screenUpdater: EventTarget
    }) {
    const items = useGameState(props.getItems, props.screenUpdater)
    return <List
        examinationOutputs={items.map(props.presentItem)}
        onItemSelect={props.onItemSelect}
        onNullSelect={props.onNullSelect}
    />
}
function CraftingUi(props: {pov: SimulationPOV, screenUpdater}) {
    return <ListGameItems
        getItems={()=>props.pov.openContainer?.craftingComp!.recipes ?? []}
        presentItem={recipe=>({
            name: recipe.examinableComp.name,
            description: recipe.examinableComp.description,
            glyph: getStaticGlyph(recipe.examinableComp),
            id: props.pov.openContainer!.craftingComp!.recipes.indexOf(recipe).toString()!
        })}
        onItemSelect={{
            e: (i)=>{props.pov.playerAction(craft.iota, [props.pov.openContainer!.id], {i})}
        }}
        screenUpdater={props.screenUpdater}
    />
}
export default function Ui(props: {pov: SimulationPOV, screenUpdater: EventTarget}) {
    const pov = props.pov;
    const physics = pov.phys;
    const container = pov.container
    const player = useGameState(()=>pov.player, props.screenUpdater)
    const craftingComp = useGameState(()=>pov.openContainer?.craftingComp, props.screenUpdater)
    const getContents = ()=>pov.openContainer ? 
        container.contents(pov.openContainer) : null
    const getEntities = ()=>physics.entitiesAt(pov.listFront ? 
        physics.inFrontOf(player)! : physics.position(player)!).filter(entity=>entity!==player)
    if (craftingComp) {
        return <CraftingUi pov={props.pov} screenUpdater={props.screenUpdater}/>
    }
    return <ListGameItems
        getItems={()=>getContents() ?? getEntities()}
        presentItem={(entity: IEntity)=>{
            const examinable = entity.examinableComp!;
            const [name, description] = examinable.examine(player, entity);
            return {
            glyph: getGlyph(entity, pov),
            name,
            description,
            id: entity.id
            }}
        }
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
        screenUpdater={props.screenUpdater}
    />
}