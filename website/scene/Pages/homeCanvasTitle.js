import { BM } from "~/helpers/core/utils"
import TitleMSDF from "../Components/TitleMSDF"

export default class indexCanvasTitle {
  constructor({ gl, scene, camera }) {
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.canvasSize = useCanvasSize()
    this.camera = camera

    BM(this, ['render', 'update', 'resize'])
    const { $RafR, $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize)
    this.ro.trigger()

    this.rafStack = []
    this.rafRender = new $RafR(this.render)
    this.rafUpdate = new $RafR(this.update)

    this.titleMSDF = new TitleMSDF(this.gl)


    this.init()
  }
  init() {
    this.rafRender.run()
    this.rafUpdate.run()
    
    this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }) {

  }

  update({ elapsed, delta }) {
  }

  render(e) {
    this.titleMSDF.post.render(e, {
      scene: this.titleMSDF.scene,
      camera: this.camera
    })
  }

  destroy() {
    this.rafUpdate.stop()
    this.rafRender.stop()
    this.ro.off()
    this.titleMSDF.destroy()
    this.titleMSDF = null
  }
}
