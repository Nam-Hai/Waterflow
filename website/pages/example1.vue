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
                <div class="images__wrapper">
                    <img src="images/caracal1.jpg" />
                    <img src="images/caracal2.jpg" />
                    <img src="images/caracal3.jpg" />
                    <div>
                        The caracal (Caracal caracal) (/ˈkærəkæl/) is a medium-sized wild cat native to Africa, the Middle
                        East,
                        Central Asia, and arid areas of Pakistan and northwestern India. It is characterised by a robust
                        build,
                        long legs, a short face, long tufted ears, and long canine teeth. Its coat is uniformly reddish tan
                        or
                        sandy, while the ventral parts are lighter with small reddish markings. It reaches 40–50 cm (16–20
                        in)
                        at the shoulder and weighs 8–19 kg (18–42 lb). It was first scientifically described by German
                        naturalist Johann Christian Daniel von Schreber in 1776. Three subspecies are recognised.
                    </div>
                </div>

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
const { $TL, $lenis, $Delay } = useNuxtApp()

const transitionRef = ref()
const overflowRef = ref()

const fromPreloader = inject('from-preloader') as Ref<boolean>
onMounted(() => {
    $lenis.dimensions.onWindowResize()
    $lenis.dimensions.onContentResize()
    $lenis.scrollTo('top')
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
                (new $Delay(resolve, 200)).run()
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
                (new $Delay(resolve, 200)).run()
            }
        })
        tl.play()
    }
})
</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;
@use "@/styles/app/variables.scss" as *;

.transition__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    display: flex;
    pointer-events: none;

    .blade {
        height: 100%;
        width: 100%;
        background-color: #f9f9f9;
        transform: scale(0);
    }

}

.overflow__wrapper {
    // position: absolute;
    position: relative;
    top: 0;
    left: 0;
    width: 0;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
    transition: width linear 750ms;
}

.example-1__wrapper {
    // position: absolute;
    position: relative;
    z-index: 0;
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

.title__wrapper {
    position: relative;
}

.title-container {
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
}

.content {
    position: relative;
    padding: 2.4rem 0rem 4rem;
    margin: $title-height auto 0;
    width: 151.4rem;
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 28rem);

    @include breakpoint(mobile) {
        min-height: calc(100% - 4rem);
        margin: $title-height-mobile auto 0;
        width: 32rem;
    }
}

.return {
    margin-top: auto;
}

.images__wrapper {

    max-height: 70%;
    display: flex;
    flex-wrap: wrap;

    img {
        height: 50rem;
        max-height: 30vh;
        width: 50%;
        object-fit: cover;
        object-position: center center;


        // margin: -0.5rem;
        @include breakpoint(mobile) {
            height: unset;
            width: 50%;
            aspect-ratio: 1 / 1;
            object-position: left;
        }

        &:nth-child(3) {
            object-position: center;
        }
    }

    div {
        display: block;
        width: 50%;
        font-size: 3rem;
        padding: 1rem;

        @include breakpoint(mobile) {
            font-size: 1rem;
        }
    }
}
</style>