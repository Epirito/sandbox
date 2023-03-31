import * as ROT from "rot-js"
import { PhysicsSystem } from "../logic/physics";
import { getGlyph } from "./glyphs";
import { ProngSystem } from "../logic/prong";
import { SimulationPOV } from "../logic/simulation-pov";

const bg = "black"
const fg = "white"

export class Drawing {
    #buffer: Int8Array; #display: ROT.Display | undefined = undefined
    constructor(public w: number, public h: number, private pov: SimulationPOV) {
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
        const cameraPos = this.pov.phys.position(this.pov.player) ?? [0,0]
        for(let y = 0; y < this.h; y++) {
            for(let x = 0; x < this.w; x++) {
                const absX = x + cameraPos[0] - Math.round(this.w / 2)
                const absY = y + cameraPos[1] - Math.round(this.h / 2)
                this.pov.phys.entitiesAt([absX, absY]).forEach(entity => {
                    this.#display!.draw(x, y, getGlyph(entity, this.pov) ?? ' ', fg, this.pov.electricity.isRateLimited([absX,absY]) ? 'blue' : bg)
                })
            }
        }
    }
}