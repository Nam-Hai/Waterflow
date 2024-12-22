<script lang="ts" setup>
import { RenderTarget } from 'ogl';
import { useEventListener } from '~/composables/useEventListener';
import { useStoreCursor } from '~/composables/useStore';
import { useCamera, useOGL } from '~/lib/webGL/ogl.renderer/useOGL';

const wrapperRef = ref() as Ref<HTMLElement>
onMounted(() => {
})

const { camera } = useCamera()
const { gl, renderer } = useOGL()
const needUpdate = {
    click: false,
    hover: false,
}
const pickedIndex = shallowRef(-1)
const renderTargetRatio = 4

const target = new RenderTarget(gl, {
    color: 2,
    width: innerWidth * devicePixelRatio / renderTargetRatio,
    height: innerHeight * devicePixelRatio / renderTargetRatio
})

const scene = shallowRef()

useEventListener(document, "click", () => {
    needUpdate.click = true
})

// const { mouse, vh, vw, dpr } = useStoreView()
const mouse = ref({ x: 0, y: 0 })
const vh = ref(2)
const vw = ref(2)
const dpr = ref(1)
const { cursorState } = useStoreCursor()

useFrame((e) => {
    gl.renderer.render({
        scene: scene.value,
        camera: camera.value,
        target: target
    });


    if (!gl.renderer.isWebgl2) {
        console.warn("Picking not allowed")
    }

    // Framebuffer is binded from render()
    // now read the right gl.COLOR_ATTACHMENT
    // in this pipeline, uIDs are drawn in FragColor[1]
    (gl as WebGL2RenderingContext).readBuffer((gl as WebGL2RenderingContext).COLOR_ATTACHMENT1);

    const data = new Uint8Array(4);
    const data2 = new Uint8Array(4);
    gl.readPixels(
        mouse.value.x * dpr.value / renderTargetRatio,
        (vh.value - mouse.value.y) * dpr.value / renderTargetRatio,
        1,
        1,
        gl.RGBA,           // format
        gl.UNSIGNED_BYTE,  // type
        data);             // typed array to hold result

    gl.readPixels(
        ((mouse.value.x + vw.value / 2) % vw.value) * dpr.value / renderTargetRatio,
        (vh.value - mouse.value.y) * dpr.value / renderTargetRatio,
        1,
        1,
        gl.RGBA,           // format
        gl.UNSIGNED_BYTE,  // type
        data2);             // typed array to hold result

    const dataToIndex = (data: Uint8Array) => data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    // const index = data[0] + data[1] * 256 + data[2] * 256 * 256 + data[3] * 256 * 256 * 256
    const index = dataToIndex(data)
    const index2 = dataToIndex(data2)

    pickedIndex.value = index
    // console.log(pickedIndex.value, index2);
    cursorState.value = !!index2 ? 2 : !!index ? 1 : 0

    // for (let index = 0; index < renderList.length; index++) {
    //     const program = renderList[index].program
    //     program.uniforms.uPicking.value = false
    // }

    // this.eventHandling(index)
})

</script>

<template>
    <OGLTransform ref="scene">
        <slot />
    </OGLTransform>
</template>