import CanvasTitle from '~/scene/CanvasTitle'
import { Motion, TL } from './core/motion'
import { RafR,  Delay, Timer} from './core/raf'
import { ROR } from './core/resize'
import Canvas from "~/scene/canvas"

export default defineNuxtPlugin(nuxtApp =>{
  const N = {
    Delay,
    Timer,
    RafR,
    Motion,
    TL,
    ROR,
  }

  return {
    provide: {
      ...N,
      canvas: new Canvas(),
      canvasTitle: new CanvasTitle()
    }
  }

})