import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"
import PostProcessor from "../PostProcessor"
import BloomPass from "../BloomPass"
import TitleMSDF from "../Components/TitleMSDF"
import FluidPass from "../FluidPass"

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

    this.titleMSDF = new TitleMSDF(this.gl)

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
    // this.renderer.render({
    //     scene: this.scene,
    //     camera: this.camera
    // })

    this.titleMSDF.post.render(e, {
      scene: this.titleMSDF.scene,
      camera: this.camera
    })

    this.noiseBackground.bloomPass.pass.program.uniforms.tTitle.value = this.titleMSDF.post.uniform.value
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
    this.titleMSDF.destroy()
    this.titleMSDF = null
  }
}
