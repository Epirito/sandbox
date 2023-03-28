import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {phys, player, charMov, electricity} from './example/index'
import { Drawing } from './ui/draw-rot'
import ItemsInFrontOf from './ui/ItemsInFrontOf'
const drawing = new Drawing(10,10, phys, electricity)
drawing.drawingInit()
const screenUpdater = new EventTarget()
document.addEventListener('keydown', (e) => {
  let rotation: number | undefined = undefined
  switch(e.key) {
    case 'ArrowRight':
      rotation = 0
    break
    case 'ArrowUp':
      rotation = 1
    break
    case 'ArrowLeft':
      rotation = 2
    break
    case 'ArrowDown':
      rotation = 3
    break
  }
  if (rotation===undefined) {
    return
  }
  phys.place(player, {rotation})
  charMov.moveForward(player)
})
setInterval(()=>{
  drawing.draw()
  screenUpdater.dispatchEvent(new Event('updated'))
},1000/60)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ItemsInFrontOf player={player} physics={phys} screenUpdater={screenUpdater}/>
  </React.StrictMode>,
)
