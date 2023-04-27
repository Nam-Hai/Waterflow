
import { Program, Camera, Mesh, RenderTarget, Triangle, Plane } from 'ogl'

export default class PostProcessor {
  constructor(
    gl,
    {
      width = innerWidth,
      height = innerHeight,
      dpr,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      minFilter = gl.LINEAR,
      magFilter = gl.LINEAR,
      geometry = new Triangle(gl),
      camera,
      targetOnly = null,
    } = {}
  ) {
    this.gl = gl;

    this.camera = camera
    if (this.camera) {
      this.camera.position.z = 5;
    }

    this.sizePlaneCamera = useCanvasSize((size)=> {
      for (const pass of this.passes) {
        pass.mesh.scale.set(size.width, size.height, 1)
      }
    })

    this.options = { width, height, wrapS, wrapT, minFilter, magFilter };

    this.passes = [];
    this.resizeCallbacks = []

    this.geometry = geometry;

    this.uniform = { value: null };
    this.targetOnly = targetOnly;

    const fbo = (this.fbo = {
      read: new RenderTarget(this.gl, this.options),
      write: new RenderTarget(this.gl, this.options),
      swap: () => {
        let temp = fbo.read;
        fbo.read = fbo.write;
        fbo.write = temp;
      },
    });

    this.dpr = dpr

    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(this.resize.bind(this))
    this.ro.on()
  }

  addPass({ vertex = this.camera ? cameraVertex : defaultVertex, fragment = defaultFragment, uniforms = {}, textureUniform = 'tMap', enabled = true, beforePass } = {}) {
    uniforms[textureUniform] = { value: this.fbo.read.texture };

    const program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms
    });
    const mesh = new Mesh(this.gl, { geometry: this.geometry, program });
    mesh.scale.set(this.sizePlaneCamera.value.width, this.sizePlaneCamera.value.height, 1)

    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform,
      beforePass
    };


    this.passes.push(pass);
    return pass;
  }

  addPassEffect(passEffect) {
    const { resizeCallback } = passEffect.addPassRef(this.addPass.bind(this))
    resizeCallback && (this.resizeCallbacks.push(resizeCallback))
    return this;
  }

  resize({ vw, vh, scale }) {
    this.width = vw
    this.height = vh


    const dpr = this.dpr || this.gl.renderer.dpr;
    let scaledWidth = Math.floor((this.width || this.gl.renderer.width) * dpr);
    let scaledHeight = Math.floor((this.height || this.gl.renderer.height) * dpr);

    this.fbo.read.setSize(scaledWidth, scaledHeight)
    this.fbo.write.setSize(scaledWidth, scaledHeight)


    this.resizeCallbacks.forEach(cb => cb({ vw, vh }))

    if (!this.camera) return
    this.camera.perspective({
      aspect: vw / vh
    });
  }

  // Uses same arguments as renderer.render, with addition of optional texture passed in to avoid scene render
  render(e, { scene, camera, texture, target = null, update = true, sort = true, frustumCull = true, beforePostCallbacks }) {
    const enabledPasses = this.passes.filter((pass) => pass.enabled);

    if (!texture) {
      this.gl.renderer.render({
        scene,
        camera,
        target: enabledPasses.length || (!target && this.targetOnly) ? this.fbo.write : target,
        update,
        sort,
        frustumCull,
      });
      this.fbo.swap();

      // Callback after rendering scene, but before post effects
      if (beforePostCallbacks) beforePostCallbacks.forEach((f) => f && f());
    }

    enabledPasses.forEach((pass, i) => {
      pass.mesh.program.uniforms[pass.textureUniform].value = !i && texture ? texture : this.fbo.read.texture;
      pass.beforePass && pass.beforePass(e, { scene, camera, texture: !i && texture ? texture : this.fbo.read.texture })
      this.gl.renderer.render({
        scene: pass.mesh,
        camera: this.camera,
        target: i === enabledPasses.length - 1 && (target || !this.targetOnly) ? target : this.fbo.write,
        clear: true,
      });
      this.fbo.swap();
    });

    this.uniform.value = this.fbo.read.texture;
  }

  destroy() {
    this.ro.off()
  }
}

const cameraVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec3 position;
    out vec2 vUv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`;
const defaultVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;


    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const defaultFragment = /* glsl */ `#version 300 es
    precision highp float;
    uniform sampler2D tMap;
    in vec2 vUv;
    out vec4 glColor;
    void main() {
        glColor = texture(tMap, vUv);
    }
`;

