import { Geometry, Mesh, Text, Texture, Program } from 'ogl';
import { basicVer } from '../shaders/BasicVer';
import { basicFrag } from '../shaders/BasicFrag';

export default class TitleMSDF {
  constructor(gl, {
    canvasSize,
  } = {}) {
    this.gl = gl
    this.canvasSize = canvasSize || { width: 1, height: 1 }


    const { $RafR, $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))
    this.raf = new $RafR(this.update.bind(this))

    this.raf.run()
  }

  update({ elapsed, delta }) {
    if (!this.mesh) return
    // this.mesh.scale.y = Math.sin(elapsed / 100)
    // this.mesh.scale.x = Math.sin(elapsed / 1000)
  }

  resize({ vh, vw, scale }) {
    console.log(scale, vw, 'title')
    const w = scale  
    const h = scale  
    // console.log({w, canvasSize: this.canvasSize})
    if(!this.mesh) return
    this.mesh.scale.x = w
    this.mesh.scale.y = h

    // this.mesh.scale.set( 0.2,0.2,1.)
  }

  async loadText() {
    const gl = this.gl
    const texture = new Texture(gl, {
      generateMipmaps: false,
    });
    const img = new Image();
    img.onload = () => (texture.image = img);
    // img.src = 'msdf/Amarante.png';
    img.src = 'msdf/Amarante-Regular.png';

    const program = new Program(gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: basicVer,
      fragment: fragment,
      uniforms: {
        tMap: { value: texture },
      },
      // transparent: true,
      cullFace: null,
      // depthWrite: false,
    });

    // const font = await (await fetch('msdf/Amarante.json')).json();
    const font = await (await fetch('msdf/Amarante-Regular.json')).json();

    const text = new Text({
      font,
      text: "WATERFLOW",
      // width: 4,
      // width: 1,
      align: 'center',
      // lineHeight: 1,
      // letterSpacing: -0.02,
      size: 300 * this.canvasSize.height / innerHeight,
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

    // Use the height value to position text vertically. Here it is centered.
    mesh.position.y = this.canvasSize.height/2 + 20 * this.canvasSize.height / innerHeight
    // mesh.position.y += text.height * 0.5;

    

    this.mesh = mesh
    console.log('testt')
    this.ro.on()
    this.ro.trigger()
  }

  destroy() {
    this.raf.stop()

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

