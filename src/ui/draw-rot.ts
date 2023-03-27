import * as ROT from "rot-js"
import { PhysicsSystem } from "../logic/physics";
import { getGlyph } from "./glyphs";
import { ProngSystem } from "../logic/prong";

const bg = "black"
const fg = "white"

export class Drawing {
    #buffer: Int8Array; #display: ROT.Display | undefined = undefined
    constructor(public w: number, public h: number, private phys: PhysicsSystem, private electricity: ProngSystem) {
        this.#buffer = new Int8Array(w * h)
    }
    drawingInit() {
        const displayOptions = {
            // Configure the #display
            bg, // background
            fg, // foreground
            fontFamily: "Fira Mono", // font (use a mono)
            width: this.w,
            height: this.h, // canvas height and width
            fontSize: 18, // canvas fontsize
        }
        this.#display = new ROT.Display(displayOptions)
        document.querySelector('#canvas')!.appendChild(this.#display.getContainer()!)
    }
    draw() {
        this.#display!.clear()
        for(let y = 0; y < this.h; y++) {
            for(let x = 0; x < this.w; x++) {
                this.phys.entitiesAt([x, y]).forEach(entity => {
                    this.#display!.draw(x, y, getGlyph(entity) ?? ' ', fg, this.electricity.isRateLimited([x,y]) ? 'blue' : bg)
                })
            }
        }
    }
}