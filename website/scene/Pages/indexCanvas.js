import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"

export default class indexCanvas {
    constructor({gl, scene, camera, canvasSize}){
        this.gl = gl
        this.renderer = this.gl.renderer
        this.scene = scene
        this.canvasSize = canvasSize
        this.camera = camera

        BM(this, ['render', 'update'])
        const { $RafR, $ROR} = useNuxtApp()
        this.ro = new $ROR(this.resize)
        this.ro.trigger()

        this.rafStack = []
        this.rafRender = new $RafR(this.render)
        this.rafStack.push(this.rafRender)
        this.rafUpdate = new $RafR(this.update)
        this.rafStack.push(this.rafUpdate)

        const noiseBackground = new NoiseBackground(this.gl)
        noiseBackground.mesh.setParent(this.scene)
        this.rafStack.push(noiseBackground.raf)


        this.init()
    }
    init(){
        for (const raf of this.rafStack) {
            raf.run()
        }
        this.ro.on()
    }

    resize({vh, vw, scale, breakpoint}){

    }

    update({elapsed, delta}){

    }

    render(){
        this.renderer.render({
            scene: this.scene,
            camera: this.camera
        })
    }

    destroy(){
        for (const raf of this.rafStack) {
            raf.stop()
        }
        this.ro.off()
    }
}