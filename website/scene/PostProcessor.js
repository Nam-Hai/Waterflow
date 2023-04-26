
import { Program, Mesh, RenderTarget, Triangle } from 'ogl'

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
            targetOnly = null,
        } = {}
    ) {
        this.gl = gl;

        this.options = { wrapS, wrapT, minFilter, magFilter };

        this.passes = [];
        this.resizeCallbacks = []

        this.geometry = geometry;

        this.uniform = { value: null };
        this.targetOnly = targetOnly;

        const fbo = (this.fbo = {
            read: new RenderTarget(this.gl, this.options),
            write: new RenderTarget(this.gl, this.options ),
            swap: () => {
                let temp = fbo.read;
                fbo.read = fbo.write;
                fbo.write = temp;
            },
        });

        this.resize({ width, height, dpr });
    }

    addPass({ vertex = defaultVertex, fragment = defaultFragment, uniforms = {}, textureUniform = 'tMap', enabled = true, beforePass} = {}) {
        uniforms[textureUniform] = { value: this.fbo.read.texture };

        const program = new Program(this.gl, { vertex, fragment, uniforms });
        const mesh = new Mesh(this.gl, { geometry: this.geometry, program });

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

    addPassEffect(passEffect){
        const { resizeCallback } = passEffect.addPassRef(this.addPass.bind(this))
        resizeCallback && (this.resizeCallbacks.push(resizeCallback))
        return this;
    }

    resize({ width, height, dpr } = {}) {
        if (dpr) this.dpr = dpr;
        if (width) {
            this.width = width;
            this.height = height || width;
        }

        dpr = this.dpr || this.gl.renderer.dpr;
        let scaledWidth = Math.floor((this.width || this.gl.renderer.width) * dpr);
        let scaledHeight = Math.floor((this.height || this.gl.renderer.height) * dpr);

        this.options.width = scaledWidth;
        this.options.height = scaledHeight;

        this.fbo.read.setSize(scaledWidth, scaledHeight)
        this.fbo.write.setSize(scaledWidth, scaledHeight)

        this.resizeCallbacks.forEach(cb => cb({width, height}))
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
            pass.beforePass && pass.beforePass(e, {scene, camera, texture: !i && texture ? texture : this.fbo.read.texture})
            this.gl.renderer.render({
                scene: pass.mesh,
                target: i === enabledPasses.length - 1 && (target || !this.targetOnly) ? target : this.fbo.write,
                clear: true,
            });
            this.fbo.swap();
        });

        this.uniform.value = this.fbo.read.texture;
    }
}

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

