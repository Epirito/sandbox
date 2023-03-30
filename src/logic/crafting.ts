type Recipes = [string, [number, string]][]

export class CraftingComponent {
    constructor(readonly recipes: Recipes) {}
}