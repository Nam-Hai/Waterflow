<template>
    <div class="example-2__wrapper" ref="wrapperRef">
        <div ref="titleWrapperRef" class="title__wrapper">
            <WaterflowTitle :show="true"></WaterflowTitle>
        </div>

        <div class="content" ref="contentRef">

            <div class="return">
                <ReturnButton />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onFlow, useFlowProvider, usePageFlow } from '@nam-hai/water-flow';
import { N } from '~/helpers/namhai-utils';
import example2InMap from './example2.transition';

const wrapperRef = ref()
const contentRef = ref()
const titleWrapperRef = ref()

const flowProvider = useFlowProvider()
const { $TL, $lenis } = useNuxtApp()

onMounted(() => {
    $lenis.dimensions.onWindowResize()
    $lenis.dimensions.onContentResize()
})

onFlow(() => {
    N.O(wrapperRef.value, 1)
    N.O(contentRef.value, 1)
    N.O(titleWrapperRef.value, 1)
})

usePageFlow({
    props: { wrapperRef, contentRef, titleWrapperRef },
    flowInCrossfadeMap: example2InMap,
    enableCrossfade: true,
    flowOut: async ({ }, resolve) => {
        let tl = new $TL
        const { $canvas } = useNuxtApp()
        $canvas.onChange(flowProvider.getRouteTo())
        await $canvas.nextCanvasPage?.init()
        $canvas.currentCanvasPage?.destroy()
        $canvas.currentCanvasPage = $canvas.nextCanvasPage

        tl.from({
            el: wrapperRef.value,
            delay: 400,
            d: 800,
            p: {
                y: [0, -100],
                s: [0.8, 0.8]
            },
            e: 'io4',
            cb: async () => {
                resolve()
            }
        })
        tl.from({
            el: wrapperRef.value,
            p: {
                y: [0, 0],
                s: [1, 0.8]
            },
            d: 400,
            e: 'io4',
        })
        tl.play()

    }
})
</script>

<style scoped lang="scss">
.example-2__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #141D4D;
    color: #A48A9B;
    display: flex;
    flex-direction: column;
    opacity: 0;
}

.title__wrapper {
    opacity: 0;
}

.content {
    padding: 2.4rem 0rem 4rem;
    margin: 0 auto;
    width: 151.4rem;
    display: flex;
    height: 100%;
    opacity: 0;
}

.return {
    margin-top: auto;
}
</style>