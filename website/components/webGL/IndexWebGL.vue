<template>

    <PostProcessor ref="post" :target-only="true">
        <Plane :coord="{ x: 0, y: 0 }" />
    </PostProcessor>

    <Blur ref="bloom" :target-only="true" />

    <!-- <PostProcessor ref="grainy" :min-filter="gl.NEAREST" :mag-filter="gl.NEAREST"> -->
    <PostProcessor ref="grainy">
    </PostProcessor>
</template>
<script lang="ts" setup>
import Plane from '../webGL/Plane.vue';
import PostProcessor from '../webGL/PostProcessor.vue';
import type { ShallowRef } from 'vue';
import { maskFrag } from '../webGL/maskFrag';
import { getUId } from '~/lib/webGL/ogl.renderer/scene/utils/WebGL.utils';
import Blur from '../webGL/Blur.vue';
import { useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import { displacementFrag } from './displacementFrag';
import { grainyStrokeFrag } from './grainyStrokeFrag';

const { gl } = useOGL()
const post = shallowRef() as ShallowRef<InstanceType<typeof PostProcessor>>
const grainy = shallowRef() as ShallowRef<InstanceType<typeof PostProcessor>>
const bloom = shallowRef() as ShallowRef<InstanceType<typeof Blur>>

const defaultVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

onMounted(() => {
    const uTime = { value: 0 }

    useFrame(e => {
        uTime.value = e.elapsed / 1000
    })

    // mask pass
    post.value.addPass({
        fragment: maskFrag,
        vertex: defaultVertex,
        uniforms: {
            uTime,
            uSeed: { value: N.random() * 4402 },
            uId: { value: getUId().uId }
        }
    })
    post.value.addPass({
        fragment: displacementFrag,
        vertex: defaultVertex,
        uniforms: {
            uId: { value: getUId().uId },
            uTime,
            uSeed: { value: N.random() * 4402 }
        },
    })
    const bloomPass = bloom.value.addPassRef(post.value.addPass)
    const pass = grainy.value.addPass({
        fragment: grainyStrokeFrag,
        vertex: defaultVertex,
        uniforms: {
            uId: { value: getUId().uId },
            uTime,
            uSeed: { value: N.random() * 42342 },
        },
        beforePass: (e, { scene, texture, camera }) => {
            if (bloom.value && bloom.value.uniform.value)
                pass.program.uniforms.tMap.value = bloom.value.uniform.value

        }
    })
    grainy.value.addPass({
        fragment: defaultFragment,
        vertex: defaultVertex,
        uniforms: {
        }
    })
    // pass.program.uniforms.tMap = bloom.value.uniform
})
</script>

<script lang="ts">

export const defaultFragment = /* glsl */ `#version 300 es
    precision highp float;
    uniform sampler2D tMap;
    in vec2 vUv;
    out vec4 glColor;
    void main() {
        glColor = texture(tMap, vUv);
        // glColor = vec4(1., 0.,0., 1.);
    }
`;

export const defaultVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
</script>