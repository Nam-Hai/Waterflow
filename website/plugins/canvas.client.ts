
import Canvas from "~/scene/canvas"
import CanvasTitle from '~/scene/CanvasTitle'

const canvas = new Canvas()
const manifest = new Manifest(canvas.gl)

export default defineNuxtPlugin(nuxtApp =>{
  return {
    provide: {
      canvas,
      manifest
    }
  }
})

