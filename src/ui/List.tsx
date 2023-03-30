import { useRef } from "react";
import { useDOMEvent, useFocusedRef } from "./hooks";

export default function List(props: {
        onItemSelect: {[key: string]: (id: string)=>void},
        onNullSelect?: {[key: string]: ()=>void}, 
        examinationOutputs: {glyph:string, name: string, description: string, id: string}[]
    }) {
    const {examinationOutputs}  = props;
    const focused = useFocusedRef()
    const itemRefs = useRef({})
    function getSelectedId() {
        for(const id in itemRefs.current) {
            if (focused.current && itemRefs.current[id]===focused.current) {
                return id
            }
        }
    }
    useDOMEvent('keydown', (e)=>{
        const selected = getSelectedId()
        if (selected===undefined) {
            for(const key in props.onItemSelect) {
                if (e.key===key) {
                    props.onNullSelect?.[key]()
                }
            }
        }else {
            for(const key in props.onItemSelect) {
                if (e.key===key) {
                    props.onItemSelect?.[key](selected)
                }
            }
        }
    })
    itemRefs.current = {}
    return (
        <div>
            {examinationOutputs.map((output) => {
                return (<button key={output.id} ref={el=>{itemRefs.current[output.id] = el}}>
                    <h3>{output.glyph +' '+ output.name}</h3>
                    <p>{output.description}</p>
                </button>)
                }
            )}
        </div>)

}