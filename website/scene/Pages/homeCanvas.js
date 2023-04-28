import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"
import Media from "../Components/Media"

export default class homeCanvas {
  constructor({ gl, scene, camera }) {
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    BM(this, ['render','resize'])
    const { $RafR, $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize)
    this.canvasSize = useCanvasSize(()=>{
      this.ro.trigger()
    })
    this.ro.trigger()

    this.raf = new $RafR(this.render)

    // const noiseBackground = new NoiseBackground(this.gl)
    // noiseBackground.backgroundMesh.setParent(this.scene)
    // noiseBackground.mesh.setParent(this.scene)
    // this.noiseBackground = noiseBackground

    // this.init()
  }
  init() {
    this.raf.run()
    
    // this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }) {
  }


  render(e) {
    // this.noiseBackground.post.render(e,{
    //   scene: this.noiseBackground.scene,
    //   camera: this.camera
    // })
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }

  destroy() {
    console.error('DESTROY');
    this.raf.stop()
    // this.ro.off()
    this.noiseBackground && this.noiseBackground.destroy()
    this.noiseBackground && (this.noiseBackground = null)

  }

  addMedia(el){
    this.media = new Media(this.gl, {el, scene: this.scene})
  }
}
