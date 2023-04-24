import { Mesh, Program, Plane } from 'ogl'
import noise2d from '../shaders/noise2d'
import noiseCommon from '../shaders/noise-common'
import { basicVer } from '../shaders/BasicVer'
import noise3d from '../shaders/noise3d'
import { N } from '~/helpers/namhai-utils'
export default class NoiseBackground {
    constructor(gl, {
        canvasSize,
    } = {}) {
        this.gl = gl
        this.canvasSize = canvasSize || { width: 1, height: 1 }


        this.createMesh()
        this.raf = new N.RafR(this.update.bind(this))
    }
    update({ elapsed, delta }) {
        this.mesh.program.uniforms.uTime.value = elapsed / 5000
    }

    createMesh() {


        const geometry = new Plane(this.gl, {
            width: this.canvasSize.width,
            height: this.canvasSize.height
        })

        const program = new Program(this.gl, {
            fragment,
            vertex: basicVer,
            uniforms: {
                uTime: { value: 0 }
            }
        })


        this.mesh = new Mesh(this.gl, {
            program,
            geometry
        })
    }
}

const fragment = /* glsl */`#version 300 es
precision mediump float;

${noiseCommon}
${noise3d}

uniform float uTime;
in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor = vec4(noise3d(vec3(vUv.x, vUv.y, uTime)));
  FragColor.a = 1.;
}
`