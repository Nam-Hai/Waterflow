import { Texture, Plane, Program, Mesh } from 'ogl'
// import { basicFrag } from '../shaders/BasicFrag'
import { basicVer } from '../shaders/BasicVer'
export default class Media {
  constructor(gl, { el, scene }) {
    this.gl = gl
    this.scene = scene
    this.el = el

    console.log(this.el.getBoundingClientRect());
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
  }

  scroll({ current, target, velocity }) {
    this.mesh.position.y = this.canvasSize.value.height / 2 - (-current + this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / innerHeight
  }

  resize({ vh, vw, scale }) {
    this.bounds = this.el.getBoundingClientRect()
    this.mesh.position.set(
      -this.canvasSize.value.width / 2 + (this.bounds.x + this.bounds.width / 2) * this.canvasSize.value.width / vw,
      this.canvasSize.value.height / 2 - (this.bounds.y + this.bounds.height / 2) * this.canvasSize.value.height / vh,
      0
    )


    this.mesh.scale.set(
      this.bounds.width * this.canvasSize.value.width / vw,
      this.bounds.height * this.canvasSize.value.height / vh,
      1
    )
  }

  createMesh() {
    const manifest = useManifest()
    const texture = manifest.textures.images['images/2.jpg']

    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      fragment,
      vertex: basicVer,
      uniforms: {
        tMap: { value: texture }
      },
      depthTest: false
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

in vec2 vUv;
// out vec4 FragColor;
out vec4 FragColor[2];
void main() {
  vec4 color = texture(tMap, vUv);
  // color.a =1.;
  FragColor[0] = color;
  FragColor[1] = vec4(1.);
}
`
