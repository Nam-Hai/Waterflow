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
    // this.titleMSDF.loadText().then(() => {
      // this.titleMSDF.mesh.setParent(this.scene)
    // })

    const noiseBackground = new NoiseBackground(this.gl)
    noiseBackground.backgroundMesh.setParent(this.scene)
    noiseBackground.mesh.setParent(this.scene)
    this.noiseBackground = noiseBackground


    this.bloomPass = new BloomPass(this.gl, {
      bloomStrength: 1,
      threshold: 0.3,
      iteration: 10,
      enabled: true,
      direction: {
        x: 4,
        y: 4
      }
    })

    this.post = new PostProcessor(this.gl)
    this.post
      .addPassEffect(this.bloomPass)


    this.init()
  }
  init() {
    this.rafRender.run()
    this.rafUpdate.run()
    
    this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }) {
    if (this.titleMSDF) {
    }
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

    this.bloomPass.pass.program.uniforms.tTitle.value = this.titleMSDF.post.uniform.value
    this.post.render(e, {
      scene: this.scene,
      camera: this.camera,
      // texture: this.titleMSDF.post.uniform.value
    })
  }

  destroy() {
    for (const raf of this.rafStack) {
      raf.stop()
    }
    this.ro.off()
    this.noiseBackground.destroy()
  }
}
