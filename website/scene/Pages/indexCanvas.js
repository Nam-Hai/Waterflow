import { BM } from "~/helpers/core/utils"
import NoiseBackground from "../Components/NoiseBackground"
import Media from "../Components/Media"
import { RenderTarget, Program, Mesh, Plane } from 'ogl'
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

    this.postProcessor.render(e, {
      scene: this.noiseBackground.scene,
      camera: this.camera
    })

  }



  destroy() {
    this.raf.stop()
    // this.ro.off()

    this.noiseBackground && this.noiseBackground.destroy()
    this.noiseBackground && (this.noiseBackground = null)
    this.transiMesh.setParent(null)
    this.transiMesh = null
    this.destroyed = true
  }

  createTransiMesh() {
    let geometry = new Plane(this.gl, {
      heightSegments: 50
    })
    let program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uProg: {value:1}
      },
    })
    let mesh = new Mesh(this.gl, { geometry, program })
    mesh.scale.set(
      this.canvasSize.value.width * 0.8,
      this.canvasSize.value.height * 0.8,
      1
    )
    mesh.position.set(
      0,
      this.canvasSize.value.height,
      0
    )

    mesh.setParent(this.scene)
    this.transiMesh = mesh
    return this.transiMesh
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

  FragColor = color + noise * (1. - color.a) * (1. - title.a) + title * (1. -color.a);
}`;


const fragment = /* glsl */ `#version 300 es
precision highp float;

out vec4 FragColor;

void main() {
    vec4 color = vec4(0.878,0.212,0.212, 1.);
    FragColor = color;
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uProg;

out vec2 vUv;

void main() {
  vUv = uv;
  vec4 newPos = modelViewMatrix * vec4(position, 1.);
  float y= newPos.y;
  newPos.z -= step(newPos.y, -.5) * (y+ 0.5) * (y + .5) * 0.3 * uProg;
  gl_Position = projectionMatrix * newPos;
}`;
