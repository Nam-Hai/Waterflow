import Canvas from "~/scene/canvas"

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

