<template>
    <PostProcessor :pixel-ratio="0.5" :target-only="true" :auto-render="false" ref="bloomPost">
    </PostProcessor>

    <PostProcessor :pixel-ratio="0.5" :target-only="true" :auto-render="false" ref="maskPost">
    </PostProcessor>
</template>

<script lang="ts" setup>
import PostProcessor from './PostProcessor.vue';

const { screen = false, enabled = true, iteration = 5, bloomStrength = 1, threshold = 0.8, direction = { x: 10, y: 6 } } = defineProps<{ screen?: boolean, enabled?: boolean, iteration?: number, bloomStrength?: number, threshold?: number, direction?: { x: number, y: number } }>()
const { gl, renderer } = useOGL()
const { vh, vw, dpr } = useScreen()
const bloomPost = shallowRef() as ShallowRef<InstanceType<typeof PostProcessor>>
const maskPost = shallowRef() as ShallowRef<InstanceType<typeof PostProcessor>>
const bloomResolution = { value: new Vec2(1, 1) }

const uThreshold = { value: threshold }
const uBloomStrength = { value: bloomStrength }

const directionY = { value: new Vec2(0, direction.y) }
const directionX = { value: new Vec2(direction.x, 0) }
const uResolution = { value: new Vec2(vw.value, vh.value) }

useResize(e => {
    uResolution.value.set(e.vw, e.vw)

    // bloomResolution.value.set(bloomPost.value.fbo.read.width, bloomPost.value.fbo.read.height);
    bloomResolution.value.set(
        e.vw * dpr.value,
        e.vh * dpr.value
    )
})

const uniform: { value: Texture | null } = { value: null }


onMounted(() => {

    const uTime = { value: 0 }

    useFrame(e => {
        uTime.value = e.elapsed / 2000
    })

    maskPost.value.addPass({
        fragment: noiseFrag,
        vertex: defaultVertex,
        uniforms: {
            uTime,
            uSeed: { value: N.random() * 4325 },
            uId: { value: getUId().uId }
        }
    })

    const horizontalPass = bloomPost.value.addPass({
        fragment: blurFragment,
        vertex: defaultVertex,
        uniforms: {
            tMask: maskPost.value.uniform,
            uResolution: bloomResolution,
            uDirection: directionX,
        },
    });
    const verticalPass = bloomPost.value.addPass({
        fragment: blurFragment,
        vertex: defaultVertex,
        uniforms: {
            tMask: maskPost.value.uniform,
            uResolution: bloomResolution,
            uDirection: directionY,
        },
    });
    for (let i = 0; i < iteration; i++) {
        bloomPost.value.passes.push(horizontalPass, verticalPass);
    }
})


const addPassRef = (addPass: AddPassType) => {
    const pass = addPass({
        fragment: screen ? compositeScreenFragment : compositeFragment,
        // vertex: defaultVertex,
        uniforms: {
            uResolution,
            tBloom: { value: null },
            uBloomStrength,
            uTime: { value: 0 },
        },
        enabled: enabled,
        textureUniform: 'tMap',
        beforePass: (e, { scene, camera, texture }) => {
            pass.program.uniforms.uTime.value = e.elapsed
            maskPost.value.render(e, { scene, camera, texture })
            bloomPost.value.render(e, {
                // scene,
                // camera,
                texture,
            })
            uniform.value = bloomPost.value.uniform.value
            pass.program.uniforms.tBloom.value = bloomPost.value.uniform.value
            console.log('render');
        }
    })
    return pass
}


defineExpose({
    addPassRef,
    uniform
})

</script>
<script lang="ts">
import { noiseFrag } from './noiseFrag';
import { Texture, Vec2 } from 'ogl';
import type { ShallowRef } from 'vue';
import { useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import type { AddPassType } from './PostProcessor.vue';
import { defaultVertex } from './IndexWebGL.vue';
import { getUId } from '~/lib/webGL/ogl.renderer/scene/utils/WebGL.utils';
import { screenShader } from '~/lib/webGL/ogl.renderer/scene/shaders/screen';
import noise from '~/lib/webGL/ogl.renderer/scene/shaders/noise';

const brightPassFragment = /* glsl */ `#version 300 es
    precision highp float;
    uniform sampler2D tMap;
    uniform float uThreshold;

    in vec2 vUv;
    out vec4 color;

    void main() {
        vec4 tex = texture(tMap, vUv);
        vec4 bright = tex * step(uThreshold, length(tex.rgb) / 1.73205);
        color = bright;
    }
`;

const blurFragment = /* glsl */ `#version 300 es
    precision highp float;

    // https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl
    vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
        vec4 color = vec4(0.0);
        vec2 off1 = vec2(1.3333333333333333) * direction;
        color += texture(image, uv) * 0.29411764705882354;
        color += texture(image, uv + (off1 / resolution)) * 0.35294117647058826;
        color += texture(image, uv - (off1 / resolution)) * 0.35294117647058826;
        return color;
    }

    // https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/9.glsl
    vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
        vec4 color = vec4(0.0);
        vec2 off1 = vec2(1.3846153846) * direction;
        vec2 off2 = vec2(3.2307692308) * direction;
        color += texture(image, uv) * 0.2270270270;
        color += texture(image, uv + (off1 / resolution)) * 0.3162162162;
        color += texture(image, uv - (off1 / resolution)) * 0.3162162162;
        color += texture(image, uv + (off2 / resolution)) * 0.0702702703;
        color += texture(image, uv - (off2 / resolution)) * 0.0702702703;
        return color;
    }

    uniform sampler2D tMap;
    uniform sampler2D tMask;
    uniform vec2 uDirection;
    uniform vec2 uResolution;

    in vec2 vUv;

    out vec4 color;
    void main() {
        vec4 mask = texture(tMask, vUv);
        // Swap with blur9 for higher quality
        vec4 b9 = blur9(tMap, vUv, uResolution, uDirection * mask.r);
        color = b9;

        // vec4 b5 = blur5(tMap, vUv, uResolution, uDirection);
        // color = b5;

        // color = mix(b9, b5, step(vUv.x, 0.5));
    }
`;

const compositeFragment = /* glsl */ `#version 300 es
  precision highp float;

  uniform sampler2D tMap;
  uniform sampler2D tBloom;
  uniform vec2 uResolution;
  uniform float uBloomStrength;

  in vec2 vUv;
  out vec4 color;


  uniform float uTime;

  void main() {
    vec4 tex = texture(tMap, vUv); 
    vec4 bloom = texture(tBloom, vUv) * uBloomStrength;
    // color = tex + bloom;
    color = bloom;
    // color = tex;
    // color = vec4(1., 0., 1., 1.);

    // gooey effect
    // color.a = min(1., color.a * 18. - 8.);
    // color.a = 1.;

    // import noise
    // color.a = 1.;
    // color *= mix(0.75, 1.,noise(gl_FragCoord.xy, uTime * 100.));
  }
`;

const compositeScreenFragment = /* glsl */ `#version 300 es
  precision highp float;

  uniform sampler2D tMap;
  uniform sampler2D tBloom;
  uniform vec2 uResolution;
  uniform float uBloomStrength;
  uniform float uTime;

  in vec2 vUv;
  out vec4 color;

  ${screenShader}
  ${noise}

  void main() {
    vec4 tex = texture(tMap, vUv); 
    vec4 bloom = texture(tBloom, vUv) * uBloomStrength;
    color = screen(tex, bloom, .8);
    color *= mix(0.85, 1.,noise(gl_FragCoord.xy, uTime * 100.));
  }
`;
</script>