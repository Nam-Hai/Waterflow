<template>
  <div class="slice-3 slice wrapper" ref="wrapperRef">

    <div class="container" ref="containerRef">
      <div class="text-wrapper">
        <h2>Modular</h2>
        <div class="p__container">
          <p ref="pRef">
            Waterflow does not tie your project to use a specific tween library. Gsap, anime.js, Smooth-scroll or
            whatever. You do you.
          </p>
          <p class="p__float">
            Waterflow does not tie your project to use a specific tween library. Gsap, anime.js, Smooth-scroll or
            whatever. You do you.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { title } from 'process'
import { Ease } from '~/helpers/core/eases'
import { Lerp } from '~/helpers/core/utils'
import { N } from '~/helpers/namhai-utils'
import { split } from '~/helpers/text'
import indexCanvas from '~/scene/Pages/indexCanvas'


const containerRef = ref()
const endRef = ref(0)
useResize(({ vh, vw }) => {
  endRef.value = vh * 2
})

const wrapperRef = ref()

const props = defineProps<{
  titleOpacity: Ref<number>
}>()

defineExpose({
  wrapper: wrapperRef
})

const { $canvas } = useNuxtApp()

useScrollEvent({
  el: containerRef,
  vStart: 20,
  end: 15,
  onProgress: (t) => {
    props.titleOpacity.value = 1 - t
  }
})

useScrollEvent({
  el: containerRef,
  vStart: 100,
  end: 0,
  onProgress: (t) => {
    // props.titleOpacity = t
    if (!$canvas.currentCanvasPage) return
    if (!$canvas.currentCanvasPage.noiseBackground) return

    const bgColors = $canvas.currentCanvasPage.noiseBackground.bgColors
    const r = Lerp(bgColors[2][0], bgColors[0][0], t)
    const g = Lerp(bgColors[2][1], bgColors[0][1], t)
    const b = Lerp(bgColors[2][2], bgColors[0][2], t)
    // $canvas.currentCanvasPage.noiseBackground.uAlpha.value = 1 - t
    $canvas.currentCanvasPage.noiseBackground.bgColor.value = [r, g, b]
  },
})

const pRef = ref()
const splitedPRef = ref()

onMounted(() => {
  split(pRef.value)
  // split(h2Ref.value)
  splitedPRef.value = N.getAll('span', pRef.value)
})

useScrollEvent({
  el: containerRef,
  end: -100,
  onProgress(t) {
    // if (!$canvas.currentCanvasPage) return
    // const curr = $canvas.currentCanvasPage as indexCanvas
    // const slice3Canvas = curr.slice3
    //
    // slice3Canvas.setPosition(Ease.io3(t))

    if (!splitedPRef.value.length) return
    const index = Math.floor((splitedPRef.value.length) * t) || 0
    for (let i = 0; i < splitedPRef.value.length; i++) {
      N.O(splitedPRef.value[i], i >= index ? 0 : 1)

    }
  },
})

usePin({
  el: containerRef,
  start: 0,
  end: endRef
})

</script>

<style lang="scss">
$bg: #EBFF70;
$primary: #55C187;
$soft: #CDE057;

.wrapper.slice-3 {
  position: relative;
  height: 300vh;
  width: 100vw;
  background-color: $bg;


  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "HelveticaNeue";
    text-transform: uppercase;
    flex-direction: column;
    text-align: center;
    font-weight: 700;

    .text-wrapper {
      width: 121.9rem;
      background-color: $bg;
      padding: 5rem 0 7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      width: 121.9rem;
      font-size: 12.8rem;
      color: $primary;
    }

    p {
      font-size: 3.2rem;
      position: relative;
      color: $primary;
      z-index: 1;

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


    span {
      transition: opacity 500ms;
    }
  }
}
</style>
