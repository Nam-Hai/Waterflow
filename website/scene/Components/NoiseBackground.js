import { Mesh, Program, Plane } from 'ogl'
import noiseCommon from '../shaders/noise-common'
import { basicVer } from '../shaders/BasicVer'
import noise3d from '../shaders/noise3d'
import noise4d from '../shaders/noise4d'
import noise from '../shaders/noise'
import { BM } from '~/helpers/core/utils'
export default class NoiseBackground {
  constructor(gl) {
    this.gl = gl
    this.canvasSize = useCanvasSize()

    this.seed = Math.random()
    this.scrollOffset = 0

    this.createMesh()

    BM(this, ['update', 'resize'])
    const { $RafR, $ROR } = useNuxtApp()
    this.raf = new $RafR(this.update)
    this.ro = new $ROR(this.resize)

    useLenisScroll(this.scroll.bind(this))
    this.raf.run()
    this.ro.on()
  }
  scroll(e) {
    this.scrollOffset = e.current
    this.mesh.program.uniforms.uScroll.value = this.scrollOffset

    this.backgroundMesh.program.uniforms.uScroll.value = this.scrollOffset
  }

  update({ elapsed, delta }) {
    this.mesh.program.uniforms.uTime.value = elapsed / 6000 + this.scrollOffset / 20000
    this.backgroundMesh.program.uniforms.uTime.value = elapsed / 6000 + this.scrollOffset / 20000 + 204 * this.seed
  }

  resize() {
    this.mesh.scale.set(this.canvasSize.value.width * 3, this.canvasSize.value.height / Math.cos(Math.PI/3), 1)
    this.backgroundMesh.scale.set(this.canvasSize.value.width, this.canvasSize.value.height, 1)
  }

  createMesh() {
    const geometry = new Plane(this.gl, {
      widthSegments: 80,
      heightSegments: 80
    })

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uScale: { value: 1 },
      },
    })

    this.backgroundMesh = new Mesh(this.gl, {
      geometry: new Plane(this.gl),
      program: new Program(this.gl, {
        fragment,
        vertex: basicVer,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uScale: { value: 0.2 },
        },
      })
    })
    // this.backgroundMesh.program.uniforms.uScale.value = 0.5
    this.backgroundMesh.scale.set(this.canvasSize.value.width, this.canvasSize.value.height, 1)


    this.mesh = new Mesh(this.gl, {
      program,
      geometry
    })

    // this.mesh.scale.set(this.canvasSize.value.width, this.canvasSize.value.height, 1)
    this.mesh.position.y = 0;
    this.mesh.position.z = -1
    this.mesh.rotation.x = -Math.PI / 3
    this.mesh.scale.set(this.canvasSize.value.width * 3, this.canvasSize.value.height / Math.cos(Math.PI/3), 1)
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
uniform float uScale;

out vec4 FragColor;

${noise}


float io3(float x) {
  float p = -2. * x + 2.;
  return x < 0.5 ? 4. * x * x * x : 1. - p * p * p /2.;
}

void main() {
  float n1 = noise3d(vec3(vUv.x * 1. * uScale, vUv.y * 1. * uScale, uTime));
  float n2 = noise3d(vec3(vUv.x * 2. * uScale, vUv.y * 5. * uScale + 56., 2982. + uTime));
  n1 = io3(n1);
  n2 = io3(n2);

  vec3 color1 = vec3(0.847,0.118,0.357) * n1;
  vec3 color2 = vec3(0.2,0.4,0.6) * n2;
  FragColor.rgb = (color1 + color2 )/ 1.;
  FragColor.a = 1.;
//   FragColor = vec4(1.,1.,0.,1.);
  // FragColor += 0.09 * noise(gl_FragCoord.xy, uTime * 100.);
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

${noiseCommon}
${noise4d}

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uScroll;

out vec2 vUv;

void main() {
  vUv = uv;
  float n = snoise(vec4(uv.x * 2. + uScroll / 7000., uv.y * 2., uTime * 0.4, uScroll /5000.));

    vec4 newPos = vec4(position, 1.);
    // newPos.z += position.y * position.y * 1.;
    newPos.z += n * 1.2 ;
    // newPos.z += n * 0.8;
  gl_Position = projectionMatrix * modelViewMatrix * newPos;
}`;
