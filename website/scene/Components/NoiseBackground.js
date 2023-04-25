import { Mesh, Program, Plane } from 'ogl'
import noiseCommon from '../shaders/noise-common'
import { basicVer } from '../shaders/BasicVer'
import noise3d from '../shaders/noise3d'
import noise4d from '../shaders/noise4d'
import noise from '../shaders/noise'
export default class NoiseBackground {
    constructor(gl, {
        canvasSize,
    } = {}) {
        this.gl = gl
        this.canvasSize = canvasSize || { width: 1, height: 1 }
        console.log('canvasSize', this.canvasSize, canvasSize);


        this.createMesh()
        const { $RafR, $ROR } = useNuxtApp()
        this.raf = new $RafR(this.update.bind(this))

        useLenisScroll(this.scroll.bind(this))
        this.raf.run()
        this.scrollOffset = 0
    }
    scroll(e) {
        console.log(e);
        this.scrollOffset = e.animatedScroll
        this.mesh.program.uniforms.uScroll.value = this.scrollOffset
    }
    update({ elapsed, delta }) {
        this.mesh.program.uniforms.uTime.value = elapsed / 6000 + this.scrollOffset / 20000
    }

    resize() {
        this.mesh.scale.set(this.canvasSize.width, this.canvasSize.height, 1)
    }

    createMesh() {


        const geometry = new Plane(this.gl, {
            widthSegments: 50,
            heightSegments: 50
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                uTime: { value: 0 },
                uScroll: { value: 0 }
            }
        })


        this.mesh = new Mesh(this.gl, {
            program,
            geometry
        })

        this.mesh.scale.set(this.canvasSize.width * 3, this.canvasSize.height * 3, 1)
        // this.mesh.scale.set(this.canvasSize.width, this.canvasSize.height, 1)
        this.mesh.position.y = 1.3;
        this.mesh.position.z = -0
        this.mesh.rotation.x = -Math.PI / 3

    }

    destroy() {
        this.raf.stop()



    }
}

const fragment = /* glsl */`#version 300 es
precision highp float;

in vec2 vUv;

${noiseCommon}
${noise3d}

uniform float uTime;

out vec4 FragColor;

${noise}

void main() {
  float n1 = noise3d(vec3(vUv.x * 1., vUv.y * 1., uTime));
  float n2 = noise3d(vec3(vUv.x * 2., vUv.y * 5. + 56., 2982. + uTime));

  vec3 color1 = vec3(0.847,0.118,0.357) * n1;
  vec3 color2 = vec3(0.2,0.4,0.6) * n2;
  FragColor.rgb = (color1 + color2 )/ 1.;
  FragColor.a = 1.;
//   FragColor = vec4(1.,1.,0.,1.);
  FragColor += 0.09 * noise(gl_FragCoord.xy, uTime * 100.);
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

${noiseCommon}
// ${noise3d}
${noise4d}

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uScroll;

out vec3 n;
out vec2 vUv;

void main() {
  vUv = uv;
  float n = snoise(vec4(uv.x * 2. + uScroll / 7000., uv.y * 2., uTime * 0.4, uScroll /5000.));
//   vec4 newPos = modelViewMatrix * vec4(position, 1.);
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

    vec4 newPos = vec4(position, 1.);
    // newPos.z += position.y * position.y * 1.;
    newPos.z += n * 1.2;
  gl_Position = projectionMatrix * modelViewMatrix * newPos;
}`;