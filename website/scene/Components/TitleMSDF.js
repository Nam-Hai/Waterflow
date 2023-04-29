import { Geometry, Mesh, Text, Texture, Transform, Program, Plane, Camera} from 'ogl';
import { basicVer } from '../shaders/BasicVer';
import FluidPass from '../Passes/FluidPass';
import PostProcessor from '../PostProcessor';

export default class TitleMSDF {
  constructor(gl) {
    this.gl = gl


    this.scene = new Transform()
    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))

    this.canvasSize = useCanvasSize(() => {
      this.ro.trigger()
    })

    this.uAlpha = {value:1}

    const fluidPass = new FluidPass(this.gl, {
      densityDissipation: 0.98,
      pressureDissipation: 0.7,
      curlStrength: 10,
      radius: 0.4,
      // enabled: false
    })
    this.fluidPass = fluidPass
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

    this.ro.trigger()
  }

  resize({ vh, vw, scale, breakpoint}) {
    this.uAlpha.value = breakpoint === 'mobile' ? 0 : 1
    const w = scale
    const h = scale
    this.fluidPass.pass.mesh.position.y = this.canvasSize.value.height / 2 + 20 * this.canvasSize.value.height / vh
    console.log(scale)
    if (!this.mesh) return
    this.mesh.scale.x = w 
    this.mesh.scale.y = h 
  }

  async loadText() {
    const gl = this.gl

    const  { $manifest } = useNuxtApp()
    console.log('manifes', $manifest, this.gl, 'yoooo');
    const texture = $manifest.textures.font['msdf/Amarante-Regular.png']

    const program = new Program(gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: basicVer,
      fragment: fragment,
      uniforms: {
        tMap: { value: texture },
        uAlpha: this.uAlpha
      },
    });

    const font = $manifest.jsons['msdf/Amarante-Regular.json'] || await (await fetch('msdf/Amarante-Regular.json')).json();

    const text = new Text({
      font,
      text: "WATERFLOW",
      align: 'center',
      lineHeight: 1,
      size: 300 *  this.canvasSize.value.height / innerHeight,
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

