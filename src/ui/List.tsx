import { ExaminableComponent } from "../logic/examinable";

export default function List(props: {examinationOutputs: {glyph:string, name: string, description: string, id: string}[], /*selected?: number*/}) {
    const {examinationOutputs}  = props;
    return (
        <div>
            {examinationOutputs.map((output, i) => (
                <div key={output.id} /*style={i===props.selected ? {backgroundColor: 'lightcyan'} : {}}*/>
                    <button>{output.glyph +' '+ output.name}</button>
                    <p>{output.description}</p>
                </div>
            ))}
        </div>
    );
}