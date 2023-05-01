import { BM } from "~/helpers/core/utils"

export default class exampleCanvas {
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

        this.rafRender = new $RafR(this.render)
        this.rafUpdate = new $RafR(this.update)

        // insert code

        this.rafRender.run()
        this.rafUpdate.run()
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
}