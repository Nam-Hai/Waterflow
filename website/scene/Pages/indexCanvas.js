import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"

export default class indexCanvas {
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

    const noiseBackground = new NoiseBackground(this.gl)
    noiseBackground.backgroundMesh.setParent(this.scene)
    noiseBackground.mesh.setParent(this.scene)
    this.noiseBackground = noiseBackground


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

    this.noiseBackground.post.render(e, {
      scene: this.scene,
      camera: this.camera,
    })
  }

  destroy() {
    this.rafUpdate.stop()
    this.rafRender.stop()
    this.ro.off()
    this.noiseBackground.destroy()
    this.noiseBackground = null
  }
}
