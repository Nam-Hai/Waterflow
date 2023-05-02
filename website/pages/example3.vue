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
})

usePageFlow({
    props: { wrapperRef, contentRef, titleWrapperRef },
    enableCrossfade: true,
    flowInCrossfade: ({ }, resolve) => {
        let tl = new $TL
        const { $canvas } = useNuxtApp()
        tl.from({
            el: wrapperRef.value,
            d: 800,
            p: {
                x: [100, 0],
            },
            e: 'io4',
            cb: () => {
                resolve()
            }
        })
        tl.play()
    },
    flowOut: async ({ }, resolve) => {
        let tl = new $TL
        const { $canvas } = useNuxtApp()
        $canvas.onChange(flowProvider.getRouteTo())
        await $canvas.nextCanvasPage?.init()
        $canvas.currentCanvasPage?.destroy()
        $canvas.currentCanvasPage = $canvas.nextCanvasPage

        tl.from({
            el: wrapperRef.value,
            d: 800,
            p: {
                x: [0, -100],
            },
            e: 'io4',
            cb: async () => {
                resolve()
            }
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
    background-color: #FFF27A;
    color: #FFFB8F;
    display: flex;
    flex-direction: column;
}

.title__wrapper {
}

.content {
    padding: 2.4rem 0rem 4rem;
    margin: 0 auto;
    width: 151.4rem;
    display: flex;
    height: 100%;
}

.return {
    margin-top: auto;
}
</style>