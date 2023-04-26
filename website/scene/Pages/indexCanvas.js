import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"
import PostProcessor from "../PostProcessor"
import BloomPass from "../BloomPass"
import TitleMSDF from "../Components/TitleMSDF"
import FluidPass from "../FluidPass"

export default class indexCanvas {
  constructor({ gl, scene, camera, canvasSize }) {
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.canvasSize = canvasSize
    this.camera = camera

    BM(this, ['render', 'update', 'resize'])
    const { $RafR, $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize)
    this.ro.trigger()

    this.rafStack = []
    this.rafRender = new $RafR(this.render)
    this.rafStack.push(this.rafRender)
    this.rafUpdate = new $RafR(this.update)
    this.rafStack.push(this.rafUpdate)

    this.titleMSDF = new TitleMSDF(this.gl, { canvasSize })
    this.titleMSDF.loadText().then(() => {
      this.titleMSDF.mesh.setParent(this.scene)
    })

    console.log('indexCanvas', canvasSize)
    const noiseBackground = new NoiseBackground(this.gl, { canvasSize })
    noiseBackground.backgroundMesh.setParent(this.scene)
    noiseBackground.mesh.setParent(this.scene)
    this.noiseBackground = noiseBackground

    this.rafStack.push(noiseBackground.raf)




    const fluidPass = new FluidPass(this.gl, {
      densityDissipation: 0.98,
      pressureDissipation: 0.7,
      curlStrength: 10,
      radius: 0.4
    })
    this.post = new PostProcessor(this.gl)
    this.post
      .addPassEffect(fluidPass)
      .addPassEffect(new BloomPass(this.gl, {
      bloomStrength: 1,
      threshold: 0.3,
      iteration: 10,
      enabled: true,
      direction: {
        x: 4,
        y: 4
      }
    }))

    this.init()
  }
  init() {
    for (const raf of this.rafStack) {
      raf.run()
    }
    this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }) {
    console.log('innerCanvas')

    this.post && this.post.resize({ width: vw, height: vh});
    if (this.titleMSDF) {
      // console.log('BAITED')
      // this.titleMSDF.canvasSize = this.canvasSize
      // this.titleMSDF.resize({ vh, vw, scale })
    }
  }

  update({ elapsed, delta }) {

  }

  render(e) {
    // this.renderer.render({
    //     scene: this.scene,
    //     camera: this.camera
    // })

    this.post.render(e, {
      scene: this.scene,
      camera: this.camera
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
