import { ExaminableComponent } from "../logic/examinable";

export default function List(props: {examinationOutputs: {glyph:string, name: string, description: string}[]}) {
    const {examinationOutputs}  = props;
    return (
        <div>
            {examinationOutputs.map((output) => (
                <div>
                    <h3>{output.glyph +' '+ output.name}</h3>
                    <p>{output.description}</p>
                </div>
            ))}
        </div>
    );
}