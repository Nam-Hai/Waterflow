import { Texture, Plane, Program, Mesh } from 'ogl'
// import { basicFrag } from '../shaders/BasicFrag'
import { TL } from '~/plugins/core/motion'
export default class Media {
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

    // const {$lenis} 

    this.init()
  }
  async init() {
    this.ro.trigger()
    this.lenis.on()

    let tl = new TL()
    tl.from({
      d: 2000,
      e: 'io3',
      delay: 700,
      update: ({ progE }) => {
        this.mesh.program.uniforms.uProg.value = progE

      }
    }).from({
      d: 3000,
      delay: 1400,
      e: 'o2',
      update: ({ progE }) => {
        this.mesh.program.uniforms.uProgVer.value = progE
      }
    }).play()
  }

  scroll({ current, target, velocity }) {
    this.mesh.position.y = this.canvasSize.value.height / 2 - (-current + this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / this.windowSize.vh
  }

  resize({ vh, vw, scale }) {
    this.windowSize.vh = vh
    this.windowSize.vw = vw
    this.bounds = this.el.getBoundingClientRect()
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


    const { $manifest} = useNuxtApp()
    console.log('media manifest', $manifest)
    const texture = $manifest.textures.images[this.el.getAttribute('data-src')]

    const geometry = new Plane(this.gl, {
      widthSegments: 50,
      heightSegments: 50
    })

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uBounds: this.uBounds,
        uProg: { value: 0 },
        uProgVer: { value: 0 }
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

uniform sampler2D tMap;
uniform float uProg;
uniform vec2 uBounds;

in vec2 vUv;
out vec4 FragColor;
void main() {
 
 vec2 s = uBounds.x > uBounds.y ? vec2(1., uBounds.y/uBounds.x) : vec2(uBounds.x / uBounds.y ,1.);
 vec2 sUV = vec2(vUv - .5) * s + .5;

  vec4 color = texture(tMap, sUV);


  vec2 coord = vUv * 2. - 1.;
  float alpha = step(abs(coord.x),  1. * uProg) * step(abs(coord.y / 1.) - 0.8, 1. * uProg);

  color.a = 1.;
  FragColor = color * alpha;
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uBounds;
uniform float uProgVer;
uniform float uProg;

float io3(float x) {
  return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
}

out vec2 vUv;

void main() {
  vUv = uv;

  vec4 pos = vec4(position, 1.);

  float initialOffset = 0.;

  pos.z -= initialOffset;

  float diagonal = sqrt(uBounds.x * uBounds.x + uBounds.y * uBounds.y);

  float d = distance(vec2(pos.x * uBounds.x, pos.y * uBounds.y), vec2(0.)) / min(uBounds.x, uBounds.y);
  float range = diagonal * uProgVer / 2.;

  float distToRange = clamp(abs(range - d), 0., 1. / 3.) * 3.;
  pos.z += io3(1. -distToRange) * .3 * clamp( -0.4+ uProg * 2., 0., 1.);


  gl_Position = projectionMatrix * modelViewMatrix * pos;
}`;

