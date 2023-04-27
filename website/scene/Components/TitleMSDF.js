import { Geometry, Mesh, Text, Texture, Transform, Program, Plane, Camera} from 'ogl';
import { basicVer } from '../shaders/BasicVer';
import PostProcessor from '../PostProcessor';
import FluidPass from '../FluidPass';

export default class TitleMSDF {
  constructor(gl) {
    this.gl = gl
    this.canvasSize = useCanvasSize()


    this.scene = new Transform()
    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))

    const fluidPass = new FluidPass(this.gl, {
      densityDissipation: 0.98,
      pressureDissipation: 0.7,
      curlStrength: 10,
      radius: 0.4,
      // enabled: false
    })
    this.fluidPass = fluidPass
    this.post = new PostProcessor(this.gl, { 
      // targetOnly: true, 
      camera: new Camera(this.gl), 
      geometry: new Plane(this.gl),
    })
    this.post
      .addPassEffect(fluidPass)


    this.init()
  }
  async init() {
    await this.loadText()

    this.ro.on()
    this.ro.trigger()
  }

  resize({ vh, vw, scale }) {
    const w = scale
    const h = scale
    // this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / innerHeight
    if (!this.mesh) return
    this.mesh.scale.x = w
    this.mesh.scale.y = h
  }

  async loadText() {
    const gl = this.gl

    const manifest = useManifest()
    const texture = manifest.textures.font['msdf/Amarante-Regular.png']

    const program = new Program(gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: basicVer,
      fragment: fragment,
      uniforms: {
        tMap: { value: texture },
      },
      cullFace: null,
    });

    const font = manifest.jsons['msdf/Amarante-Regular.json']

    const text = new Text({
      font,
      text: "WATERFLOW",
      // width: 4,
      // width: 1,
      align: 'center',
      lineHeight: 1,
      // letterSpacing: -0.02,
      size: 300 * this.canvasSize.value.height / innerHeight,
      lineHeight: 1,
    });


    // Pass the generated buffers into a geometry
    const geometry = new Geometry(gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      // id provides a per-character index, for effects that may require it
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    });

    const mesh = new Mesh(gl, { geometry, program });

    this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / innerHeight

    // mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / innerHeight
    // Use the height value to position text vertically. Here it is centered.
      // mesh.position.y += text.height * 0.25;



    this.mesh = mesh

    this.mesh.setParent(this.scene)

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

in vec2 vUv;
out vec4 color;

void main() {
    vec3 tex = texture(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = -fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    // if (alpha > 0.99) discard;
    if (alpha < 0.01) discard;

    color.rgb = vec3(0.933,0.98,0.918);
    color.a = alpha;
}
`;

