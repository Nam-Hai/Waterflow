import { N } from "~/helpers/namhai-utils"

export default class indexCanvas {
    constructor({gl, scene, camera, canvasSize}){
        this.gl = gl
        this.renderer = this.gl.renderer
        this.scene = scene
        this.canvasSize = canvasSize
        this.camera = camera

        N.BM(this, ['render', 'update'])
        this.ro = new N.ROR(this.resize)
        this.ro.trigger()

        this.rafRender = new N.RafR(this.render)
        this.rafUpdate = new N.RafR(this.update)

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