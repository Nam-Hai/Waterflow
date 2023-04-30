<template>
    <div class="slice wrapper slice-2">

        <div class="container" ref="containerRef">
            <div class="slice__header">
                <h2>How does it work ?</h2>
                <p>
                    To create these fancier page transitions, Waterfall use a “BufferPage” component to render the next page
                    during the onBeforeRouteLeave lifecycle.
                </p>
            </div>
            <div class="displayer">
alo
            </div>
            <div class="flavor-text">
                Mount Bufferpage
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Lerp } from '~/helpers/core/utils'

useLenisScroll(() => {
})

const containerRef = ref()
const endRef = ref(0)
useResize(({ vh, vw }) => {
    endRef.value = vh * 2

})

const { $canvas } = useNuxtApp()

useScrollEvent({
    el: containerRef,
    vStart: 100,
    end: 0,
    onProgress: (t) => {
        if (!$canvas.currentCanvasPage) return
        const bgColors = $canvas.currentCanvasPage.noiseBackground.bgColors
        const r = Lerp(bgColors[1][0], bgColors[2][0], t)
        const g = Lerp(bgColors[1][1], bgColors[2][1], t)
        const b = Lerp(bgColors[1][2], bgColors[2][2], t)
        $canvas.currentCanvasPage.noiseBackground.bgColor.value = [r,g,b]
    },
})

usePin({
    el: containerRef,
    start: 0,
    end: endRef
})

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

$primary: #F0D6F4;
$bg: #151E4D;
$soft: #2A356B;

.wrapper.slice {
    position: relative;
    height: 300vh;
    width: 100vw;


    .container {
        padding-top: 28rem;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        font-family: "HelveticaNeue";
        text-transform: uppercase;
        font-weight: 700;

        h2 {
            font-size: 11rem;
            color: $secondary;
        }

        p {
            font-size: 2.6rem;
            color: $soft;
        }

        .slice__header {
            width: 65.7rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .displayer {
            width: 45.8rem
        }

        .flavor-text {
            // width: 25rem;
            font-size: 2.6rem;
        }
    }
}
</style>