<template>
    <div class="slice wrapper slice-4">
        <div class="container" ref="containerRef">
            <div class="left">
                <h3>contribute to this project</h3>
                <h2>OPEN SOURCE</h2>
                <div class="github"></div>
            </div>
            <div class="right">
                <Watermark />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Lerp } from '~/helpers/core/utils'

useLenisScroll(() => {
})


const containerRef = ref()
const { $canvas } = useNuxtApp()

useScrollEvent({
    el: containerRef,
    vStart: 100,
    end: 0,
    onProgress: (t) => {
        if (!$canvas.currentCanvasPage) return
        const bgColors = $canvas.currentCanvasPage.noiseBackground.bgColors
        const r = Lerp(bgColors[3][0], bgColors[4][0], t)
        const g = Lerp(bgColors[3][1], bgColors[4][1], t)
        const b = Lerp(bgColors[3][2], bgColors[4][2], t)
        $canvas.currentCanvasPage.noiseBackground.bgColor.value = [r,g,b]
        const flavorColors = $canvas.currentCanvasPage.noiseBackground.flavorColors
        $canvas.currentCanvasPage.noiseBackground.flavorColor1.value = [Lerp(flavorColors[1][0][0], flavorColors[2][0][0],t), Lerp(flavorColors[1][0][1], flavorColors[2][0][1], t), Lerp(flavorColors[1][0][2], flavorColors[2][0][2],t)]
        $canvas.currentCanvasPage.noiseBackground.flavorColor2.value = [Lerp(flavorColors[1][1][0], flavorColors[2][1][0],t), Lerp(flavorColors[1][1][1], flavorColors[2][1][1], t), Lerp(flavorColors[1][1][2], flavorColors[2][1][2],t)]
    },
})


</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

$bg: #E2383B;
$soft: #C12B2D;

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

        padding: 28rem 0rem 4rem;
        margin: 0 auto;
        width: 151.4rem;

        .left {
            width: 62.5%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            >.github {
                max-height: 60rem;
                height: 100%;
                width: 100%;
                background-color: #dddddd15;
            }
        }

        h2 {
            font-size: 12.8rem;
            color: $secondary;
        }

        h3 {
            font-size: 4rem;
            color: $soft;
        }

        .right {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            text-transform: initial;
        }
    }

}
</style>