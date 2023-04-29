import { Geometry, Mesh, Text, Texture, Transform, Program, Plane, Camera } from 'ogl';
import { basicVer } from '../shaders/BasicVer';
import FluidPass from '../Passes/FluidPass';
import PostProcessor from '../PostProcessor';

export default class TitleMSDF {
  constructor(gl) {
    this.gl = gl


    this.breakpoint = ref()

    this.scene = new Transform()
    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))

    this.canvasSize = useCanvasSize(() => {
      this.ro.trigger()
    })

    this.uAlpha = { value: 1 }

    const fluidPass = new FluidPass(this.gl, {
      densityDissipation: 0.98,
      pressureDissipation: 0.7,
      curlStrength: 10,
      radius: 0.4,
      // enabled: false
    })
    this.fluidPass = fluidPass
    this.fluidPass.setTextPosition(40, 160)
    this.post = new PostProcessor(this.gl, {
      targetOnly: true,
      camera: new Camera(this.gl),
      geometry: new Plane(this.gl),
    })
    this.post
      .addPassEffect(fluidPass)
  }
  async init() {
    await this.loadText()

    console.log(this.breakpoint)
    watch(this.breakpoint, breakpoint => {
      console.log('break', breakpoint)
      console.log(breakpoint, 'allo')
      if (breakpoint == 'mobile') {
        this.meshMobile.setParent(this.scene)
        this.mesh.setParent(null)
        this.fluidPass.setTextPosition(50, 32)
        this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 - 8 * this.canvasSize.value.height / innerHeight
      } else {
        this.mesh.setParent(this.scene)
        this.meshMobile.setParent(null)
        this.fluidPass.setTextPosition(40, 160)
        this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / innerHeight
      }

    })
    this.ro.trigger()
  }

  resize({ vh, vw, scale, breakpoint }) {
    // this.uAlpha.value = breakpoint === 'mobile' ? 0 : 1
    this.breakpoint.value = breakpoint
    const w = scale
    const h = scale
    this.mesh && this.mesh.scale.set(w,h,1)
    this.meshMobile && this.meshMobile.scale.set(w, h, 1)

  }

  async createGeometryMobile() {

    const { $manifest } = useNuxtApp()

  }

  async loadText() {
    const gl = this.gl

    const { $manifest } = useNuxtApp()
    console.log('manifes', $manifest, this.gl, 'yoooo');
    const texture = $manifest.textures.font['msdf/Amarante-Regular.png']

    const program = new Program(gl, {
      vertex: basicVer,
      fragment: fragment,
      uniforms: {
        tMap: { value: texture },
        uAlpha: this.uAlpha
      },
    });
    this.program = program

    const font = $manifest.jsons['msdf/Amarante-Regular.json'] || await (await fetch('msdf/Amarante-Regular.json')).json();

    const text = new Text({
      font,
      text: "WATERFLOW",
      align: 'center',
      lineHeight: 1,
      size: 300 * this.canvasSize.value.height / innerHeight,
      lineHeight: 1,
    });


    // Pass the generated buffers into a geometry
    const geometry = new Geometry(gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    });

    const mesh = new Mesh(gl, { geometry, program });

    this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / innerHeight
    this.mesh = mesh

    // this.mesh.setParent(this.scene)

    const textMobile = new Text({
      font,
      text: "WATERFLOW",
      align: 'center',
      lineHeight: 1,
      size: 64 * this.canvasSize.value.height / innerHeight,
      lineHeight: 1,
    });


    // Pass the generated buffers into a geometry
    const geometryMobile = new Geometry(this.gl, {
      position: { size: 3, data: textMobile.buffers.position },
      uv: { size: 2, data: textMobile.buffers.uv },
      id: { size: 1, data: textMobile.buffers.id },
      index: { data: textMobile.buffers.index },
    });
    this.meshMobile = new Mesh(this.gl, { geometry: geometryMobile, program })

    this.mesh.setParent(this.scene)
    this.meshMobile.setParent(this.scene)
  }

  destroy() {
    this.ro.off()
    this.fluidPass.ro.off()
    this.post.destroy()
  }
}
const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tMap;

uniform float uAlpha;
in vec2 vUv;
out vec4 color;

void main() {
    vec3 tex = texture(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = -fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    // if (alpha > 0.99) discard;
    if (alpha < 0.01) discard;

    color.rgb = vec3(0.933,0.98,0.918) * uAlpha;
    // color.rgb = vec3(1.,0.,0.2);
    color.a = alpha * uAlpha;
}
`;

