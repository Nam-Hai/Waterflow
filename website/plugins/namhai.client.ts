import { Motion, TL } from './core/motion'
import { RafR,  Delay, Timer} from './core/raf'
import { ROR } from './core/resize'


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
    }
  }

})