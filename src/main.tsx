import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { pov } from './example/index'
import { Drawing } from './ui/draw-rot'
import Ui from './ui/Ui'
import { walk } from './logic/actions'
const drawing = new Drawing(10,10, pov)
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
  pov.playerAction(walk.iota, [], {rotation})
})
setInterval(()=>{
  drawing.draw()
  screenUpdater.dispatchEvent(new Event('updated'))
},1000/60)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Ui pov={pov} screenUpdater={screenUpdater}/>
  </React.StrictMode>,
)
