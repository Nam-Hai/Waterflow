<template>
    <div class="transition__wrapper" ref="transitionRef">
        <div class="blade" v-for="i in 25"></div>
    </div>
    <div class="overflow__wrapper" ref="overflowRef">
        <div class="example-1__wrapper" ref="wrapperRef">
            <div ref="titleWrapperRef" class="title__wrapper">
                <WaterflowTitle :show="true"></WaterflowTitle>
            </div>

            <div class="content" ref="contentRef">

                <div class="return">
                    <ReturnButton />
                </div>
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

const transitionRef = ref()
const overflowRef = ref()

const fromPreloader = inject('from-preloader') as Ref<boolean>
onMounted(() => {
    $lenis.dimensions.onWindowResize()
    $lenis.dimensions.onContentResize()
})

onFlow(() => {
    overflowRef.value.style.transition = 'none'
    overflowRef.value.style.width = 100 + 'vw'
})

usePageFlow({
    props: { wrapperRef, contentRef, titleWrapperRef },
    enableCrossfade: true,
    flowInCrossfade: ({ }, resolve) => {
        const blades = N.getAll('.blade', transitionRef.value)
        const tl = new $TL
        const length = blades.length

        for (let i = 0; i < blades.length; i++) {
            tl.from({
                el: blades[i] as HTMLElement,
                p: {
                    scaleX: [0, 1.03]
                },
                d: 200,
                delay: 30 * i,
            }).from({
                el: blades[i] as HTMLElement,
                p: {
                    scaleX: [1.03, .0]
                },
                d: 200,
                delay: 200 + 30 * i,
            })
        }
        tl.from({
            update: ({ progE }) => {
                overflowRef.value.style.width = 100 + 'vw'
            },
            delay: 180,
            d: 30 * length,
            cb: () => {
                resolve()
            }
        })
        tl.play()
    },
    flowOut: async ({ }, resolve) => {
        const tl = new $TL
        const { $canvas } = useNuxtApp()
        $canvas.onChange(flowProvider.getRouteTo())
        await $canvas.nextCanvasPage?.init()
        $canvas.currentCanvasPage?.destroy()
        $canvas.currentCanvasPage = $canvas.nextCanvasPage
        overflowRef.value.style.transition = 'width linear 750ms'

        const blades = N.getAll('.blade', transitionRef.value)
        const length = blades.length

        for (let i = 0; i < blades.length; i++) {
            tl.from({
                el: blades[i] as HTMLElement,
                p: {
                    scaleX: [0, 1.03]
                },
                d: 200,
                delay: 30 * (length - i),
            }).from({
                el: blades[i] as HTMLElement,
                p: {
                    scaleX: [1.03, .0]
                },
                d: 200,
                delay: 200 + 30 * (length - i),
            })
        }
        tl.from({
            update: ({ progE }) => {
                overflowRef.value.style.width = 0 + 'vw'
            },
            delay: 180,
            d: 30 * length,
            cb: () => {
                resolve()
            }
        })
        tl.play()
    }
})
</script>

<style scoped lang="scss">
.transition__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    display: flex;
    pointer-events: none;

    .blade {
        height: 100%;
        width: 100%;
        background-color: #E03636;
        transform: scale(0);
    }

}

.overflow__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
    transition: width linear 750ms;
}

.example-1__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #E03636;
    // background-color: blue;
    color: #87F062;
    display: flex;
    flex-direction: column;
}

.title__wrapper {}

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