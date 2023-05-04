import { Texture, Plane, Program, Mesh } from 'ogl'
// import { basicFrag } from '../shaders/BasicFrag'
import { TL } from '~/plugins/core/motion'
export default class Slice3Canvas {
  constructor(gl, { el, scene }) {
    this.windowSize = {
      vh: innerHeight,
      vw: innerWidth
    }

    this.gl = gl
    this.scene = scene
    this.el = el

    this.uBounds = { value: [1, 1] }
    this.createMesh()

    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))
    this.canvasSize = useCanvasSize(() => {
      this.ro.trigger()
    })

    const { lenis } = useLenisScroll(this.scroll.bind(this), false)
    this.lenis = lenis


    this.init()
  }
  async init() {
    this.ro.trigger()
    this.lenis.on()
  }

  scroll({ current, target, velocity }) {
    this.mesh.position.y = this.canvasSize.value.height / 2 - (-current + this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / this.windowSize.vh
  }

  resize({ vh, vw, scale }) {
    this.windowSize.vh = vh
    this.windowSize.vw = vw
    this.bounds = this.el.getBoundingClientRect()
    this.bounds.y = this.bounds.top + window.scrollY
    this.mesh.position.set(
      -this.canvasSize.value.width / 2 + (this.bounds.x + this.bounds.width / 2) * this.canvasSize.value.width / vw,
      this.canvasSize.value.height / 2 - (this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / vh,
      0
    )


    const w = this.bounds.width * this.canvasSize.value.width / vw
    const h = this.bounds.height * this.canvasSize.value.height / vh
    this.mesh.scale.set(
      w,
      h,
      1
    )

    this.uBounds.value = [w,h]
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
        uBounds: this.uBounds,
      },
      cullFace: null,
    })

    this.mesh = new Mesh(this.gl, {
      geometry,
      program
    })
    this.mesh.setParent(this.scene)
  }

  destroy() {
    this.lenis.off()
  }
}
const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uBounds;

in vec2 vUv;
out vec4 FragColor;
void main() {
  vec4 color = vec4(0.922,1.,0.439, 1.);
  FragColor = color;
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uBounds;

float io3(float x) {
  return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
}

out vec2 vUv;

void main() {
  vUv = uv;

  vec4 pos = vec4(position, 1.);
  gl_Position = projectionMatrix * modelViewMatrix * pos;
}`;

