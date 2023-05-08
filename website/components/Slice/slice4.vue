<template>
    <div class="slice wrapper slice-4" ref="wrapperRef">
        <div class="container" ref="containerRef">
            <div class="left">
                <h3>contribute to this project</h3>
                <h2>OPEN SOURCE</h2>
                <div class="github">
                    <GitHub />
                </div>
            </div>
            <div class="right">
                <Watermark />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Lerp } from '~/helpers/core/utils'
import indexCanvas from '~/scene/Pages/indexCanvas'

const containerRef = ref()
const wrapperRef = ref()
const { $canvas } = useNuxtApp()


useScrollEvent({
    el: wrapperRef,
    vStart: 100,
    end: 0,
    onProgress: (t) => {
        const title = $canvas.titleMSDF

        if (!$canvas.currentCanvasPage) return
        const currentCanvasPage = $canvas.currentCanvasPage as any as indexCanvas
        if (!currentCanvasPage.noiseBackground) return
        const bgColors = currentCanvasPage.noiseBackground.bgColors

        const r = Lerp(bgColors[2][0], bgColors[3][0], t)
        const g = Lerp(bgColors[2][1], bgColors[3][1], t)
        const b = Lerp(bgColors[2][2], bgColors[3][2], t)
        currentCanvasPage.noiseBackground.bgColor.value = [r, g, b]
        const flavorColors = currentCanvasPage.noiseBackground.flavorColors
        currentCanvasPage.noiseBackground.flavorColor1.value = [Lerp(flavorColors[1][0][0], flavorColors[2][0][0], t), Lerp(flavorColors[1][0][1], flavorColors[2][0][1], t), Lerp(flavorColors[1][0][2], flavorColors[2][0][2], t)]

        currentCanvasPage.noiseBackground.flavorColor2.value = [Lerp(flavorColors[1][1][0], flavorColors[2][1][0], t), Lerp(flavorColors[1][1][1], flavorColors[2][1][1], t), Lerp(flavorColors[1][1][2], flavorColors[2][1][2], t)]
    },
})


</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.wrapper.slice {
    position: relative;
    height: 100vh;
    width: 100vw;


    .container {
        height: 100vh;

        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        font-family: "HelveticaNeue";
        text-transform: uppercase;
        font-weight: 700;

        padding: $title-height 0rem 4rem;
        margin: 0 auto;
        width: 151.4rem;

        @include breakpoint(mobile) {
            width: 32rem;
            padding: $title-height-mobile 0rem 4rem;
        }

        .left {
            width: 62.5%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            @include breakpoint(mobile) {
                width: 100%;
            }

            >.github {
                @include breakpoint(mobile) {
                    max-height: 20rem;
                }

                max-height: 40rem;
                height: 100%;
                width: 100%;
                background-color: #dddddd15;
                border: 0.1rem solid rgba(255, 255, 255, 0.0823529412);
            }
        }

        h2 {
            font-size: 12.8rem;
            color: $secondary;

            @include breakpoint(mobile) {
                font-size: 5rem;
            }
        }

        h3 {
            font-size: 4rem;
            color: white;

            @include breakpoint(mobile) {
                font-size: 3rem;
            }
        }

        .right {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            text-transform: initial;

            @include breakpoint(mobile) {
                display: none;
            }
        }
    }

}
</style>
