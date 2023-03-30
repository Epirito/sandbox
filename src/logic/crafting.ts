import { examinables } from "../stuff/examinables"
export class Recipe {
    constructor(readonly output: string, readonly inputs: [number, string][]) {
    }
    get examinableComp() {
        return examinables[this.output]
    }
}

export class CraftingComponent {
    constructor(readonly recipes: Recipe[]) {}
}