<template>
    <OGLTransform ref="scene">
        <slot />
    </OGLTransform>
</template>

<script lang="ts" setup>
import { Mesh, Program, RenderTarget, Transform, Triangle, type Camera, type Texture } from 'ogl';
import { useCamera, useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import type { FrameEvent } from '~/plugins/core/frame';

type PostProcessorOptions = {
    pixelRatio?: number,
    wrapS?: GLenum;
    wrapT?: GLenum;
    minFilter?: GLenum;
    magFilter?: GLenum;
    geometry?: Triangle,
    camera?: Camera,
    targetOnly?: boolean,
    autoRender?: boolean
};

const props = withDefaults(defineProps<PostProcessorOptions>(), {
    autoRender: true
})

const { camera } = useCamera()
const { gl, renderer } = useOGL()
const { vh, vw, dpr } = useScreen()

const wrapS = props.wrapS ?? gl.CLAMP_TO_EDGE,
    wrapT = props.wrapT ?? gl.CLAMP_TO_EDGE,
    minFilter = props.minFilter ?? gl.LINEAR,
    magFilter = props.magFilter ?? gl.LINEAR,
    geometry = props.geometry ?? new Triangle(gl),
    targetOnly = props.targetOnly


type PassOptions = {
    vertex: string,
    fragment: string,
    textureUniform: string,
    uniforms: Record<string, any>;
    enabled: boolean,
    beforePass: (e: FrameEvent, { scene, texture, camera }: { scene?: Transform, texture: Texture, camera?: Camera }) => void
}

type PassObject = {
    program: Program,
    mesh: Mesh,
    textureUniform: string,
    uniforms: Record<string, any>;
    enabled: boolean,
    beforePass?: (e: FrameEvent, { scene, texture, camera }: { scene?: Transform, texture: Texture, camera?: Camera }) => void
}

const scene = shallowRef() as Ref<Transform>
const passes: PassObject[] = []

const uniform: { value: Texture | null } = { value: null };

const options = { width: vw.value, height: vh.value, wrapS: wrapS, wrapT: wrapT, minFilter: minFilter, magFilter: magFilter };
const fbo = {
    read: new RenderTarget(gl, options),
    write: new RenderTarget(gl, options),
    swap: () => {
        let temp = fbo.read;
        fbo.read = fbo.write;
        fbo.write = temp;
    },
};

const addPass = ({ vertex = camera.value ? cameraVertex : defaultVertex, fragment = defaultFragment, uniforms = {}, textureUniform = 'tMap', enabled = true, beforePass }: Partial<PassOptions>): PassObject => {
    uniforms[textureUniform] = { value: fbo.read.texture };

    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms
    });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.scale.set(vw.value, vh.value, 1)

    const pass = {
        mesh,
        program,
        uniforms,
        enabled,
        textureUniform,
        beforePass
    };


    passes.push(pass);
    return pass;
}
export type AddPassType = typeof addPass

export interface PassEffect {
    render: () => void,
    addPassRef: (addPass: (pass: Partial<PassOptions>) => PassObject) => void,
    toggleEffect: () => void,
}
const addPassEffect = (passEffect: PassEffect) => {
    return passEffect.addPassRef(addPass)
}

type PostRenderOptions = {
    scene?: Transform,
    camera?: Camera,
    texture?: Texture,
    target?: RenderTarget,
    update?: boolean,
    sort?: boolean,
    frustumCull?: boolean,
    beforePostCallbacks?: (() => void)[]
}
const render = (e: FrameEvent, { scene, camera, texture, target, update = true, sort = true, frustumCull = true, beforePostCallbacks }: PostRenderOptions) => {
    const enabledPasses = passes.filter((pass) => pass.enabled);

    if (!texture) {
        renderer.render({
            scene,
            camera,
            target: enabledPasses.length || (!target && targetOnly) ? fbo.write : target,
            update,
            sort,
            frustumCull,
        });
        fbo.swap();

        // Callback after rendering scene, but before post effects
        if (beforePostCallbacks) beforePostCallbacks.forEach((f) => f && f());
    }

    enabledPasses.forEach((pass, i) => {
        pass.mesh.program.uniforms[pass.textureUniform].value = i === 0 && texture ? texture : fbo.read.texture;
        pass.beforePass && pass.beforePass(e, { scene, camera, texture: !i && texture ? texture : fbo.read.texture })
        renderer.render({
            scene: pass.mesh,
            camera: camera,
            target: i === enabledPasses.length - 1 && (target || !targetOnly) ? target : fbo.write,
            clear: true,
        });
        fbo.swap();
    });

    uniform.value = fbo.read.texture;
}



useFrame((e) => {
    if(props.autoRender === false) return
    render(e, {
        scene: scene.value,
        camera: camera.value,
    })
})

useResize(({ vh, vw }) => {
    for (const pass of passes) {
        pass.mesh.scale.set(vw, vh, 1)
    }

    let scaledWidth = Math.floor(vw * (props.pixelRatio || dpr.value));
    let scaledHeight = Math.floor(vh * (props.pixelRatio || dpr.value));

    fbo.read.setSize(scaledWidth, scaledHeight)
    fbo.write.setSize(scaledWidth, scaledHeight)
})


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
        // glColor = vec4(1., 0.,0., 1.);
    }
`;

defineExpose({
    addPass,
    addPassEffect,
    fbo,
    passes,
    render,
    uniform
})
</script>