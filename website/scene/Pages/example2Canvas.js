import { BM } from "~/helpers/core/utils"
import { Program, Plane, Mesh } from 'ogl'

export default class example2Canvas {
    constructor({ gl, scene, camera }) {
        this.gl = gl
        this.renderer = this.gl.renderer
        this.scene = scene
        this.camera = camera

        BM(this, ['render', 'update'])
        const { $RafR, $ROR } = useNuxtApp()
        this.ro = new $ROR(this.resize)
        this.canvasSize = useCanvasSize(() => {
            this.ro.trigger()
        })
        this.raf = new $RafR(this.render)
        this.ro.trigger()

        // this.createMesh()
    }
    init() {
        this.raf.run()
    }

    resize({ vh, vw, scale, breakpoint }) {

    }

    update({ elapsed, delta }) {
    }

    render() {
        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
        })
    }

    createMesh() {
        let geometry = new Plane(this.gl)
        let program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
            },
            depthTest: false
        })

        this.mesh = new Mesh(this.gl, { geometry, program })
        this.mesh.setParent(this.scene)
        this.mesh.scale.set(
            this.canvasSize.value.width * 0.8,
            this.canvasSize.value.height * 0.8,
            1
        )
    }

    destroy() {
        this.raf.stop()
        this.mesh && this.mesh.setParent(null)
    }
}
const fragment = /* glsl */ `#version 300 es
precision highp float;

out vec4 FragColor;

void main() {
    vec4 color = vec4(0.878,0.212,0.212, 1.);
    FragColor = color;
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;
