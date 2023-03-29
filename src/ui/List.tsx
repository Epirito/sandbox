import { useRef } from "react";
import { useDOMEvent, useFocusedRef } from "./hooks";

export default function List(props: {
        onSelect: (id: string)=>void, 
        onESelect: (id: string)=>void, 
        onQSelect: (id: string)=>void, 
        onNullQSelect: ()=>void, 
        examinationOutputs: {glyph:string, name: string, description: string, id: string}[]
    }) {
    const {examinationOutputs}  = props;
    const focused = useFocusedRef()
    const itemRefs = useRef({})
    function getSelectedId() {
        for(const id in itemRefs.current) {
            if (itemRefs.current[id]===focused.current) {
                return id
            }
        }
    }
    useDOMEvent('keydown', (e)=>{
        const selected = getSelectedId()
        if (selected===undefined) {
            if (e.key==='q') {
                props.onNullQSelect()
            }
        }else {
            switch(e.key) {
                case 'enter':
                    props.onSelect(selected)
                break
                case 'e':
                    props.onESelect(selected)
                break
                case 'q':
                    props.onQSelect(selected)
                break
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