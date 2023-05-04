import { Texture, Plane, Program, Mesh } from 'ogl'
import { Lerp } from '~/helpers/core/utils'
// import { basicFrag } from '../shaders/BasicFrag'
import { TL } from '~/plugins/core/motion'
export default class Slice3Canvas {
  constructor(gl, { el, scene }) {
    this.windowSize = {
      vh: innerHeight,
      vw: innerWidth
    }

    this.progress = 0
    this.current = 0
    this.gl = gl
    this.scene = scene
    this.el = el

    this.uBounds = { value: [1, 1] }

    this.meshes = []
    this.meshesPosition = [
      [-0.5, 0],
      [0.5, 0]
    ]

    this.meshDatas = [
      {
        position: [-0.5, 0.75],
        scale: [0.5, 0.25],
        endScale: [0.25, 0.05],
        endPos: [-1.25, 1.25]
      },
      {
        position: [-0.75, 0.25],
        scale: [0.25, 0.25],
        endScale: [0.15, 0.1],
        endPos: [-1.95, 0.25]
      },
      {
        position: [-0.25, 0.25],
        scale: [0.25, 0.25],
        endScale: [0.15, 0.1],
        endPos: [-1.25, 0.25]
      },
      {
        position: [0.25, 0.25],
        scale: [0.25, 0.25],
        endScale: [0.10, 0.10],
        endPos: [.25, 1.25]
      },
      {
        position: [0.75, 0.25],
        scale: [0.25, 0.25],
        endScale: [0.15, 0.15],
        endPos: [1.75, 0.25]
      },
      {
        position: [0.25, 0.75],
        scale: [0.25, 0.25],
        endScale: [0.15, 0.15],
        endPos: [.25, 1.75]
      },
      {
        position: [0.75, 0.75],
        scale: [0.25, 0.25],
        endScale: [0.15, 0.15],
        endPos: [1.75, 1.75]
      },
      {
        position: [-0.5, -0.5],
        scale: [0.5, 0.5],
        endScale: [0.25, 0.25],
        endPos: [-1.5, -1.5]
      },
      {
        position: [0.5, -0.5],
        scale: [0.5, 0.5],
        endScale: [0.25, 0.25],
        endPos: [1.5, -1.5]
      },
    ]
    for (const m of this.meshDatas) {
      this.createMesh()
    }


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
    this.current = current
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i]
      // mesh.position.y = this.canvasSize.value.height / 2 - (-current + this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / this.windowSize.vh
    }
  }

  resize({ vh, vw, scale }) {
    this.windowSize.vh = vh
    this.windowSize.vw = vw
    // this.bounds = this.el.getBoundingClientRect()
    this.bounds = document.body.getBoundingClientRect()
    // this.bounds.y = this.bounds.top - window.scrollY

    const w = this.bounds.width * this.canvasSize.value.width / vw
    const h = this.bounds.height * this.canvasSize.value.height / vh

    this.uBounds.value = [w, h]

    this.setPosition(this.progress)
    this.lenis.emit()
  }

  setPosition(t) {
    this.progress = t
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i]
      const data = this.meshDatas[i]
      mesh.position.set(
        this.canvasSize.value.width * Lerp(data.position[0], data.endPos[0], t) / 2,
        this.canvasSize.value.height * Lerp(data.position[1], data.endPos[1], t) / 2,
        0
      )

      mesh.scale.set(
        this.canvasSize.value.width * Lerp(data.scale[0], data.endScale[0], t),
        this.canvasSize.value.height * Lerp(data.scale[1], data.endScale[1],t),
        1
      )
    }
  }

  createMesh() {


    const geometry = new Plane(this.gl, {
      widthSegments: 1,
      heightSegments: 1
    })

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uBounds: this.uBounds,
      },
      cullFace: null,
    })

    const mesh = new Mesh(this.gl, {
      geometry,
      program
    })
    mesh.setParent(this.scene)

    this.meshes.push(mesh)
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

