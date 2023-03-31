import React from 'react'
import ReactDOM from 'react-dom/client'
//import './index.css'
import { pov } from './example/index'
import { Drawing } from './ui/draw-rot'
import Ui from './ui/Ui'
import { walk } from './stuff/actions'
import { clock } from './example/index'
const drawing = new Drawing(30,30, pov)

drawing.drawingInit()
const screenUpdater = new EventTarget()
document.addEventListener('keydown', (e) => {
  let rotation: number | undefined = undefined
  switch(e.key) {
    case 'l':
      rotation = 0
    break
    case 'i':
      rotation = 1
    break
    case 'j':
      rotation = 2
    break
    case 'k':
      rotation = 3
    break
  }
  if (rotation===undefined) {
    return
  }
  pov.playerAction(walk.iota, [], {rotation})
})
setInterval(()=>{
  clock.tick()
  drawing.draw()
  screenUpdater.dispatchEvent(new Event('updated'))
},1000/60)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Ui pov={pov} addScreenListener={clock.onTick} removeScreenListener={clock.removeOnTick}/>
  </React.StrictMode>,
)
