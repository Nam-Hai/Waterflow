<template>
  <div class="slice wrapper slice-1" ref='wrapperRef'>

    <div class="container" ref="containerRef">
      <h2 ref="h2Ref">Create smooth page transition</h2>
      <div class="p__container">

        <p ref="pRef">
          Sometimes, Vue.js API limits your creativity and imagination to ship outstanding page transition. Enable
          user to flow between pages to create the most smooth experience possible.
        </p>
        <p class="p__float">
          Sometimes, Vue.js API limits your creativity and imagination to ship outstanding page transition. Enable
          user to flow between pages to create the most smooth experience possible.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lerp, getAll } from '~/helpers/core/utils'
import { N } from '~/helpers/namhai-utils'
import { split } from '~/helpers/text'
import indexCanvas from '~/scene/Pages/indexCanvas'

useLenisScroll(() => {
})

const containerRef = ref()
const endRef = ref(0)
const pRef = ref()
const h2Ref = ref()
const splitedPRef = ref()

onMounted(() => {
  split(pRef.value)
  split(h2Ref.value)
  splitedPRef.value = getAll('span', pRef.value)

})

const wrapperRef = ref()
useScrollEvent({
  el: wrapperRef,
  end: -100,
  onProgress: (t) => {
  },
})

useResize(({ vh, vw }) => {
  endRef.value = vh * 4
})

const { $canvas } = useNuxtApp()

useScrollEvent({
  el: wrapperRef,
  vStart: 100,
  end: 0,
  onProgress: (t) => {
    if (!$canvas.currentCanvasPage) return
    const currentCanvasPage = $canvas.currentCanvasPage as any as indexCanvas
    if (!currentCanvasPage.noiseBackground) return
    const bgColors = currentCanvasPage.noiseBackground.bgColors
    const flavorColors = currentCanvasPage.noiseBackground.flavorColors
    const r = Lerp(bgColors[0][0], bgColors[1][0], t)
    const g = Lerp(bgColors[0][1], bgColors[1][1], t)
    const b = Lerp(bgColors[0][2], bgColors[1][2], t)
    currentCanvasPage.noiseBackground.bgColor.value = [r, g, b]
    currentCanvasPage.noiseBackground.flavorColor1.value = [Lerp(flavorColors[0][0][0], flavorColors[1][0][0], t), Lerp(flavorColors[0][0][1], flavorColors[1][0][1], t), Lerp(flavorColors[0][0][2], flavorColors[1][0][2], t)]
    currentCanvasPage.noiseBackground.flavorColor2.value = [Lerp(flavorColors[0][1][0], flavorColors[1][1][0], t), Lerp(flavorColors[0][1][1], flavorColors[1][1][1], t), Lerp(flavorColors[0][1][2], flavorColors[1][1][2], t)]

  },
})

usePin({
  el: containerRef,
  // start: -100,
  start: 0,
  end: endRef,
  onProgress(t) {
    if (!splitedPRef.value.length) return
    const index = Math.floor((splitedPRef.value.length) * t) || 0
    for (let i = 0; i < splitedPRef.value.length; i++) {
      N.O(splitedPRef.value[i], i >= index ? 0 : 1)

    }
  },
})

</script>

<style lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

$bg: #E2383B;
$soft: #C12B2D;

.wrapper.slice-1 {
  position: relative;
  height: 500vh;
  width: 100vw;


  .container {
    padding-top: $title-height;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "HelveticaNeue";
    text-transform: uppercase;
    flex-direction: column;
    text-align: center;
    font-weight: 700;
    line-height: 1;
    row-gap: 2rem;

    @include breakpoint(mobile) {
      padding-top: $title-height-mobile;
    }

    h2 {
      width: 121.9rem;
      font-size: 12.8rem;
      color: $secondary;

      @include breakpoint(mobile) {
        font-size: 4rem;
        width: 38rem;
      }
    }

    p {
      font-size: 3.2rem;
      position: relative;
      color: $secondary;
      z-index: 1;

      @include breakpoint(mobile) {
        font-size: 1.6rem;
      }

      span {
        opacity: 0;
      }
    }

    p.p__float {
      z-index: 0;
      position: absolute;
      top: 0;
      color: $soft;
    }
  }

  .p__container {
    width: 82.3rem;
    position: relative;

    @include breakpoint(mobile) {
      width: 32rem
    }

    span {
      transition: opacity 400ms;
    }
  }
}
</style>
