import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"
import Media from "../Components/Media"
import { RenderTarget, Program, Mesh, Triangle } from 'ogl'
import PostProcessor from "../PostProcessor"
import BloomPass from "../Passes/BloomPass"

export default class homeCanvas {
  constructor({ gl, scene, camera, titleMSDF }) {
    console.log('homeCanvas');
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    BM(this, ['render', 'resize'])
    const { $RafR, $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize)
    this.canvasSize = useCanvasSize(() => {
      this.ro.trigger()
    })
    this.target = new RenderTarget(this.gl, {
      width: innerWidth,
      height: innerHeight
    })
    this.ro.trigger()

    this.raf = new $RafR(this.render)

    this.titleMSDF = titleMSDF
    const noiseBackground = new NoiseBackground(this.gl)
    // noiseBackground.backgroundMesh.setParent(this.scene)
    // noiseBackground.mesh.setParent(this.scene)
    this.noiseBackground = noiseBackground


    this.bloomPass = new BloomPass(this.gl, {
      // bloomStrength: 1,
      bloomStrength: 1.0,
      // bloomStrength: 0,
      threshold: 0.02,
      iteration: 5,
      screen: true,
      // enabled: false,
      direction: {
        x: 6,
        y: 6
      }
    })


    this.postProcessor = new PostProcessor(this.gl, {
      // targetOnly: true
    })
      .addPassEffect(this.bloomPass)
    this.postProcessor.addPass({
      fragment: fragmentComposer,
      uniforms: {
        tMap: { value: this.target.textures },
        // tAlpha: { value: this.target.textures[1] },
        tMask: { value: this.titleMSDF.targetMask.texture },
        tNoise: { value: null },
        tTitle: this.titleMSDF.post.uniform
      },
      textureUniform: 'tNoise'
    })
  }
  async init() {
    this.raf.run()
  }

  resize({ vh, vw, scale, breakpoint }) {
    this.target.setSize(vw, vh)
  }


  render(e) {
    if (this.destroyed) return
    this.titleMSDF.post.render(e, {
      scene: this.titleMSDF.scene,
      camera: this.camera
    })

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
      target: this.target
    })
    this.renderer.render({
      scene: this.titleMSDF.sceneMask,
      camera: this.camera,
      target: this.titleMSDF.targetMask
    })

    this.postProcessor.render(e, {
      scene: this.noiseBackground.scene,
      camera: this.camera
    })
  }

  destroy() {
    this.raf.stop()
    // this.ro.off()
    console.log('DESTROY CANVAS HOME');
    this.noiseBackground && this.noiseBackground.destroy()
    this.noiseBackground && (this.noiseBackground = null)

    // this.titleMSDF && this.titleMSDF.destroy()
    // this.titleMSDF = null
    this.destroyed = true
  }

  addTitle(el) {
    console.log(el)
  }

  addMedia(el) {
    this.media = new Media(this.gl, { el, scene: this.scene })
  }
}
const vertexPost = /* glsl */ `#version 300 es
precision lowp float;
in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentComposer = /* glsl */ `#version 300 es
precision lowp float;
in vec2 vUv;

uniform sampler2D tMap;
// uniform sampler2D tAlpha;
uniform sampler2D tNoise;
uniform sampler2D tTitle;
uniform sampler2D tMask;

out vec4 FragColor;
void main() {

  vec4 color = texture(tMap, vUv);
  // vec4 alpha = texture(tAlpha, vUv);
  vec4 noise = texture(tNoise, vUv);
  vec4 title = texture(tTitle, vUv);
  vec4 mask = texture(tMask, vUv);
  color *= mask.a;
  FragColor = color * (1. - title.a) + noise * (1. - color.a) * (1. - title.a) + title;
}`;
