import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {physics, player, charMov, electricity} from './example/index'
import { Drawing } from './ui/draw-rot'
import ItemsInFrontOf from './ui/ItemsInFrontOf'
const drawing = new Drawing(10,10, physics, electricity)
drawing.drawingInit()
const screenUpdater = {onUpdated: ()=>{}}
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowRight':
      physics.place(player, {rotation: 0})
    break
    case 'ArrowUp':
      physics.place(player, {rotation: 1})
    break
    case 'ArrowLeft':
      physics.place(player, {rotation: 2})
    break
    case 'ArrowDown':
      physics.place(player, {rotation: 3})
    break
  }
  charMov.moveForward(player)
})
setInterval(()=>{
  drawing.draw()
  screenUpdater.onUpdated()
},1000/60)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ItemsInFrontOf entity={player} physics={physics} screenUpdater={screenUpdater}/>
  </React.StrictMode>,
)
