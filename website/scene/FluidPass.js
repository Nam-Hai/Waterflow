import {
  Camera,
  RenderTarget,
  Geometry,
  Program,
  Mesh,
  Color,
  Vec2,
} from "ogl";

// Resolution of simulation
const simRes = 128;
const dyeRes = 512;


// Main inputs to control look and feel of fluid
const iterations = 3;

// Common uniform
const texelSize = { value: new Vec2(1 / simRes, 1 / simRes) };

export default class FluidPass {
  constructor(gl, { densityDissipation = 0.93, velocityDissipation = 0.98, pressureDissipation = 0.9, curlStrength = 20, radius = 1, enabled = true } = {}) {
    this.enabled = enabled
    this.params = {
      densityDissipation,
      velocityDissipation,
      pressureDissipation,
      curlStrength,
      radius
    }
    this.gl = gl;

    this.scale = 0

    this.size = {
      width: innerWidth,
      height: innerHeight,
    };
    this.camera = new Camera(this.gl, {
      left: -this.size.width / 2,
      right: this.size.width / 2,
      top: this.size.height / 2,
      bottom: -this.size.height / 2,
    });

    this.lastMouse = new Vec2(undefined);

    let supportLinearFiltering =
      gl.renderer.extensions[
      `OES_texture_${gl.renderer.isWebgl2 ? `` : `half_`}float_linear`
      ];
    const halfFloat = gl.renderer.isWebgl2
      ? gl.HALF_FLOAT
      : gl.renderer.extensions["OES_texture_half_float"].HALF_FLOAT_OES;

    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    let rgba, rg, r;

    if (gl.renderer.isWebgl2) {
      rgba = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloat);
      rg = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloat);
      r = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloat);
    } else {
      rgba = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat);
      rg = rgba;
      r = rgba;
    }
    // Create fluid simulation FBOs
    this.density = createDoubleFBO(gl, {
      width: dyeRes,
      height: dyeRes,
      type: halfFloat,
      format: rgba?.format,
      internalFormat: rgba?.internalFormat,
      minFilter: filtering,
      depth: false,
    });

    this.velocity = createDoubleFBO(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: rg?.format,
      internalFormat: rg?.internalFormat,
      minFilter: filtering,
      depth: false,
    });

    this.pressure = createDoubleFBO(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    });

    this.divergence = new RenderTarget(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    });

    this.curl = new RenderTarget(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    });

    const triangle = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    // Create fluid simulation programs
    this.clearProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: clearShader,
        uniforms: {
          texelSize,
          uTexture: { value: null },
          value: { value: this.params.pressureDissipation },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.splatProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: splatShader,
        uniforms: {
          texelSize,
          uTarget: { value: null },
          aspectRatio: { value: 1 },
          color: { value: new Color() },
          point: { value: new Vec2() },
          radius: { value: this.params.radius },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.advectionProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: supportLinearFiltering
          ? advectionShader
          : advectionManualFilteringShader,
        uniforms: {
          texelSize,
          dyeTexelSize: { value: new Vec2(1 / dyeRes, 1 / dyeRes) },
          uVelocity: { value: null },
          uSource: { value: null },
          dt: { value: 0.016 },
          dissipation: { value: 1.0 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.divergenceProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: divergenceShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.curlProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: curlShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.vorticityProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: vorticityShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
          uCurl: { value: null },
          curl: { value: this.params.curlStrength },
          dt: { value: 0.016 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.pressureProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: pressureShader,
        uniforms: {
          texelSize,
          uPressure: { value: null },
          uDivergence: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.gradienSubtractProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: gradientSubtractShader,
        uniforms: {
          texelSize,
          uPressure: { value: null },
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    });

    this.splats = [];


    this.addEventListener();
  }

  render() {
    this.gl.renderer.autoClear = false;

    // Render all of the inputs since last frame
    for (let i = this.splats.length - 1; i >= 0; i--) {
      this.splat(this.splats.splice(i, 1)[0]);
    }

    this.curlProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;

    this.gl.renderer.render({
      scene: this.curlProgram,
      target: this.curl,
      sort: false,
      update: false,
    });

    this.vorticityProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityProgram.program.uniforms.uCurl.value = this.curl.texture;

    this.gl.renderer.render({
      scene: this.vorticityProgram,
      target: this.velocity.write,
      sort: false,
      update: false,
    });
    this.velocity.swap();

    this.divergenceProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;

    this.gl.renderer.render({
      scene: this.divergenceProgram,
      target: this.divergence,
      sort: false,
      update: false,
    });

    this.clearProgram.program.uniforms.uTexture.value = this.pressure.read.texture;
    this.clearProgram.program.uniforms.value.value = this.params.pressureDissipation;

    this.gl.renderer.render({
      scene: this.clearProgram,
      target: this.pressure.write,
      sort: false,
      update: false,
    });
    this.pressure.swap();

    this.pressureProgram.program.uniforms.uDivergence.value = this.divergence.texture;

    for (let i = 0; i < iterations; i++) {
      this.pressureProgram.program.uniforms.uPressure.value = this.pressure.read.texture;

      this.gl.renderer.render({
        scene: this.pressureProgram,
        target: this.pressure.write,
        sort: false,
        update: false,
      });
      this.pressure.swap();
    }

    this.gradienSubtractProgram.program.uniforms.uPressure.value =
      this.pressure.read.texture;
    this.gradienSubtractProgram.program.uniforms.uVelocity.value =
      this.velocity.read.texture;

    this.gl.renderer.render({
      scene: this.gradienSubtractProgram,
      target: this.velocity.write,
      sort: false,
      update: false,
    });
    this.velocity.swap();

    this.advectionProgram.program.uniforms.dyeTexelSize.value.set(1 / simRes);
    this.advectionProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.dissipation.value = this.params.velocityDissipation;

    this.gl.renderer.render({
      scene: this.advectionProgram,
      target: this.velocity.write,
      sort: false,
      update: false,
    });
    this.velocity.swap();

    this.advectionProgram.program.uniforms.dyeTexelSize.value.set(1 / dyeRes);
    this.advectionProgram.program.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.program.uniforms.uSource.value = this.density.read.texture;
    this.advectionProgram.program.uniforms.dissipation.value = this.params.densityDissipation;

    this.gl.renderer.render({
      scene: this.advectionProgram,
      target: this.density.write,
      sort: false,
      update: false,
    });
    this.density.swap();

    // Set clear back to default
    this.gl.renderer.autoClear = true;
  }

  addEventListener() {

    const { $ROR } = useNuxtApp()
    this.ro = new $ROR(({ scale }) => {
      this.scale = scale
    })

    this.ro.on()

    const {lenis} = useLenisScroll(this.onScroll.bind(this))
    this.unSubscriberLenis = lenis.off
    lenis.on()
  }

  // Function to draw number of interactions onto input render target
  splat({ x, y, dx, dy }) {
    this.splatProgram.program.uniforms.uTarget.value =
      this.velocity.read.texture;
    this.splatProgram.program.uniforms.aspectRatio.value =
      this.gl.renderer.width / this.gl.renderer.height;
    this.splatProgram.program.uniforms.point.value.set(x, y);
    this.splatProgram.program.uniforms.color.value.set(dx, dy, 1.0);
    this.splatProgram.program.uniforms.radius.value = this.params.radius / 100.0;

    this.gl.renderer.render({
      scene: this.splatProgram,
      target: this.velocity.write,
      sort: false,
      update: false,
    });
    this.velocity.swap();

    this.splatProgram.program.uniforms.uTarget.value =
      this.density.read.texture;

    this.gl.renderer.render({
      scene: this.splatProgram,
      target: this.density.write,
      sort: false,
      update: false,
    });
    this.density.swap();
  }

  onScroll({ current, target, velocity }) {
    const x = Math.sign(velocity) == 1 ? 40 : innerWidth - 40 * this.scale
    const y = innerHeight /2  + 160 * this.scale

    this.splats.push({
      x: x / this.size.width,
      y: 1 - y / this.size.height,
      dy: 0,
      dx: velocity * 2,
    });
  }
  updateMouse(e) {
    let x = e.x,
      y = e.y;
    if (e.x === undefined) {
      x = e.pageX;
    }
    if (e.y === undefined) {
      y = e.pageY;
    }
    if (this.lastMouse.x == undefined || this.lastMouse.y == undefined) {
      this.lastMouse.set(x, y);
    }

    const deltaX = x - this.lastMouse.x,
      deltaY = y - this.lastMouse.y;
    this.lastMouse.set(x, y);

    if (Math.abs(deltaX) || Math.abs(deltaY)) {
      this.splats.push({
        x: x / this.size.width,
        y: 1 - y / this.size.height,
        dx: deltaX * 10,
        dy: deltaY * -10,
      });
    }
  }

  resize({ vw, vh }) {
    this.size = { width: vw, height: vh};
    this.camera.left = -this.size.width / 2;
    this.camera.right = this.size.width / 2;
    this.camera.top = this.size.height / 2;
    this.camera.bottom = -this.size.height / 2;
    this.camera.updateMatrixWorld();
  }

  toggleEffect() {
    this.enabled = !this.enabled
    this.pass.enabled = this.enabled
  }

  addPassRef(addPass) {
    this.pass = addPass({
      fragment,
      uniforms: {
        tFluid: { value: null },
      },
      enabled: this.enabled,
      textureUniform: 'tMap',
      beforePass: (e, { scene, camera, texture }) => {
        this.render()
        this.pass.program.uniforms.tFluid.value = this.density.read.texture
      }
    })
    return { resizeCallback: this.resize.bind(this) }
  }


  destroy(){
    this.unSubscriberLenis()
  }
}

// Helper functions for larger device support
function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
      default:
        return null;
    }
  }

  return { internalFormat, format };
}

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  let fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE) return false;
  return true;
}

// Helper to create a ping-pong FBO pairing for simulating on GPU
function createDoubleFBO(
  gl,
  {
    width,
    height,
    wrapS,
    wrapT,
    minFilter = gl.LINEAR,
    magFilter = minFilter,
    type,
    format,
    internalFormat,
    depth,
  } = {}
) {
  const options = {
    width,
    height,
    wrapS,
    wrapT,
    minFilter,
    magFilter,
    type,
    format,
    internalFormat,
    depth,
  };
  const fbo = {
    read: new RenderTarget(gl, options),
    write: new RenderTarget(gl, options),
    swap: () => {
      let temp = fbo.read;
      fbo.read = fbo.write;
      fbo.write = temp;
    },
  };
  return fbo;
}
const fragment = /* glsl */ `#version 300 es
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tFluid;
    uniform float uTime;
    in vec2 vUv;

    out vec4 color;
    void main() {
        vec3 fluid = texture(tFluid, vUv).rgb;
        vec2 uv = vUv - fluid.rg * 0.0002;
        // color = texture(tMap, uv);

        float r = texture(tMap, vUv - fluid.rg * 0.00019).r;
        float g = texture(tMap, vUv - fluid.rg * 0.0002).g;
        float b = texture(tMap, vUv - fluid.rg * 0.00021).b;

        color = vec4(r,g,b, r + g + b);
    }
`;

const baseVertex = /* glsl */ `#version 300 es
    precision highp float;
    in vec2 position;
    in vec2 uv;
    out vec2 vUv;
    out vec2 vL;
    out vec2 vR;
    out vec2 vT;
    out vec2 vB;

    uniform vec2 texelSize;
    void main () {
        vUv = uv;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(position, 0, 1);
    }
`;

const clearShader = /* glsl */ `#version 300 es
    precision mediump float;
    precision mediump sampler2D;
    in highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    out vec4 color;
    void main () {
        color = value * texture(uTexture, vUv);
    }
`;

const splatShader = /* glsl */ `#version 300 es
    precision highp float;
    precision highp sampler2D;
    in vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    out vec4 glColor;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture(uTarget, vUv).xyz;
        glColor = vec4(base + splat, 1.0);
    }
`;

const advectionManualFilteringShader = /* glsl */ `#version 300 es
    precision highp float;
    precision highp sampler2D;
    in vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    out vec4 color;

    void main () {
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        color = dissipation * bilerp(uSource, coord, dyeTexelSize);
        color.a = 1.0;
    }
`;

const advectionShader = /* glsl */ `#version 300 es
    precision highp float;
    precision highp sampler2D;
    in vec2 vUv;

    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    out vec4 color;
    void main () {
        vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
        color = dissipation * texture(uSource, coord);
        color.a = 1.0;
    }
`;

const divergenceShader = /* glsl */ `#version 300 es
    precision mediump float;
    precision mediump sampler2D;
    in highp vec2 vUv;
    in highp vec2 vL;
    in highp vec2 vR;
    in highp vec2 vT;
    in highp vec2 vB;
    uniform sampler2D uVelocity;
    out vec4 color;
    void main () {
        float L = texture(uVelocity, vL).x;
        float R = texture(uVelocity, vR).x;
        float T = texture(uVelocity, vT).y;
        float B = texture(uVelocity, vB).y;
        vec2 C = texture(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        color = vec4(div, 0.0, 0.0, 1.0);
    }
`;

const curlShader = /* glsl */ `#version 300 es
    precision mediump float;
    precision mediump sampler2D;
    in highp vec2 vUv;
    in highp vec2 vL;
    in highp vec2 vR;
    in highp vec2 vT;
    in highp vec2 vB;
    uniform sampler2D uVelocity;
    out vec4 color;
    void main () {
        float L = texture(uVelocity, vL).y;
        float R = texture(uVelocity, vR).y;
        float T = texture(uVelocity, vT).x;
        float B = texture(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        color = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`;

const vorticityShader = /* glsl */ `#version 300 es
    precision highp float;
    precision highp sampler2D;
    in vec2 vUv;
    in vec2 vL;
    in vec2 vR;
    in vec2 vT;
    in vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    out vec4 color;
    void main () {
        float L = texture(uCurl, vL).x;
        float R = texture(uCurl, vR).x;
        float T = texture(uCurl, vT).x;
        float B = texture(uCurl, vB).x;
        float C = texture(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture(uVelocity, vUv).xy;
        color = vec4(vel + force * dt, 0.0, 1.0);
    }
`;

const pressureShader = /* glsl */ `#version 300 es
    precision mediump float;
    precision mediump sampler2D;
    in highp vec2 vUv;
    in highp vec2 vL;
    in highp vec2 vR;
    in highp vec2 vT;
    in highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    out vec4 color;
    void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        float C = texture(uPressure, vUv).x;
        float divergence = texture(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        color = vec4(pressure, 0.0, 0.0, 1.0);
    }
`;

const gradientSubtractShader = /* glsl */ `#version 300 es
    precision mediump float;
    precision mediump sampler2D;
    in highp vec2 vUv;
    in highp vec2 vL;
    in highp vec2 vR;
    in highp vec2 vT;
    in highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    out vec4 color;
    void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        vec2 velocity = texture(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        color = vec4(velocity, 0.0, 1.0);
    }
`;

