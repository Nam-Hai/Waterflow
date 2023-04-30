<template>
    <div class="slice-3 slice wrapper">

        <div class="container" ref="containerRef">
            <h2>Modular</h2>
            <p>
                Waterflow does not tie your project to use a specific tween library. Gsap, anime.js, Smooth-scroll or
                whatever. You do you.
            </p>
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
        const r = Lerp(bgColors[2][0], bgColors[0][0], t)
        const g = Lerp(bgColors[2][1], bgColors[0][1], t)
        const b = Lerp(bgColors[2][2], bgColors[0][2], t)
        // $canvas.currentCanvasPage.noiseBackground.uAlpha.value = 1 - t
        $canvas.currentCanvasPage.noiseBackground.bgColor.value = [r, g, b]
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

$bg: #EBFF70;
$primary: #55C187;
$soft: #CDE057;

.wrapper.slice {
    position: relative;
    height: 300vh;
    width: 100vw;

    // background-color: $bg;
    .container {
        padding-top: 28rem;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "HelveticaNeue";
        text-transform: uppercase;
        flex-direction: column;
        text-align: center;
        font-weight: 700;

        h2 {
            width: 121.9rem;
            font-size: 12.8rem;
            color: $secondary;
        }

        p {
            font-size: 3.2rem;
            width: 82.3rem;
            color: $soft;
        }
    }

}
</style>