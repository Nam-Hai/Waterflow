<script lang="ts" setup>
import { Mesh, Plane, Program, Texture, Vec3 } from 'ogl';
import { basicVer } from '~/lib/webGL/ogl.renderer/scene/shaders/BasicVer';
import { getUId } from '~/lib/webGL/ogl.renderer/scene/utils/WebGL.utils';
import { useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import { basicFrag } from '~/lib/webGL/ogl.renderer/scene/shaders/BasicFrag';

const { coord = { x: 0, y: 0 } } = defineProps<{ coord?: { x: number, y: number } }>()

const { gl } = useOGL()

const geometry = new Plane(gl, {})


const { id, uId } = getUId()
const texture = new Texture(gl)
const image = new Image
image.src = "/nam.png"
image.crossOrigin = "anonymous"
image.onload = () => {
    texture.image = image
}

const uTime = { value: 0 }
const program = new Program(gl, {
    vertex: basicVer,
    fragment: basicFrag,
    uniforms: {
        uId: { value: uId },
        tMap: { value: texture },
        uTime
    }
})


const meshRef = useTemplateRef<Mesh>("meshRef")
const scale = new Vec3(1, 1, 1)
onMounted(() => {
    console.log(meshRef.value);
});
const pos = new Vec3(0, 0, 0)
useFrame(({ elapsed }) => {
    uTime.value = elapsed / 2000
    // pos.set(Math.sin(elapsed / 1000), 0, 0)
    // console.log(pos);
    // meshRef.value?.rotation.set(elapsed / 1000, 0, 0)
})

useResize(({ vh, vw }) => {
    if (!meshRef.value) return
    scale.set(vw, vh, 1)
})

</script>

<template>
    <OGLMesh ref="meshRef" :program="program" :geometry="geometry" :scale :position="pos">

    </OGLMesh>
</template>
