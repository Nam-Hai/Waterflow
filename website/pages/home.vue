<template>
  <div>

    <WaterflowTitle />
    <div id="home" class="wrapper">
      <div class="page page-with-title">
        <div class="grid-container">
          <div class="left">
            <h2 class="mask-split-line">
              <span ref="titleSpanRef">
                <span ref="rotateRef">
                  Do you even <span class="font-museo">flow</span> ?
                </span>
              </span>
            </h2>
            <p v-opacity-flow="500">Give your project by the power of the nature. Go with the flow and create
              transitions that you always
              dreamed of. Enable your creativity with Waterflow and make your website stand out. A Vue.js library
              for page transitions crossfade.</p>
            <h3 v-opacity-flow="500">Fast. Light. Modular. For <span class="secondary">Vue.js</span>.</h3>

            <Clipboard />
            <HeroImage />
          </div>
        </div>
      </div>
      <SliceSlice1 />
      <Watermark />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { vOpacityFlow } from '@/directives/OpacityFlow'
import { onFlow } from '~/../src/composables/onFlow';
// import { useCanvas } from '~/scene/useCanvas.client';

const { $TL, $lenis, $canvas } = useNuxtApp()
const titleSpanRef = ref()
const rotateRef = ref()

onMounted(() => {
  // $lenis.dimensions.onWindowResize()
  // $lenis.dimensions.onContentResize()

})

onFlow(() => {
  const noiseWebGL = $canvas.currentCanvasPage!.noiseBackground

  $canvas.currentCanvasPage?.init()
  let tl = new $TL()
  tl.from({
    el: titleSpanRef.value,
    d: 1500,
    p: {
      y: [100, 0],
      x: [-2, 0],
      // rotateX: [70,0]
    },
    e: 'o3'
  }).from({
    el: rotateRef.value,
    d: 1000,
    p: {
      // y: [100, 0],
      // x: [-2,0],
      rotateX: [-90, 0]
    },
    e: 'o3'
  }).from({
    d: 2500,
    delay: 0,

    update: ({ progE }) => {
      noiseWebGL && noiseWebGL.uAlpha && (noiseWebGL.uAlpha.value = progE)
    }
  }).play()


})

// usePageFlow({
//   props: {},
//   enableCrossfade: true
// })

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;

#home.wrapper {}

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  top: $title-height;
  perspective: 1000px;
}

.page.page-with-title {
  height: calc(100vh - $title-height);
}

.grid-container {
  // padding: 2.4rem 10rem 4rem;
  padding: 2.4rem 0rem 4rem;
  margin: 0 auto;
  width: 151.4rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .left {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    width: 50%;
  }
}

span {
  display: inline-block;
}

.mask-split-line {
  display: flex;
  height: 9rem;

  >span {
    perspective: 1000px;
  }
}

h2 {
  font-size: 8rem;
  font-weight: 700;
  line-height: 100%;
  margin-left: -0.4rem;
  margin-bottom: -1rem;
}

p {
  font-size: 2rem;
  font-weight: 400;
  line-height: 100%;
}

h3 {
  font-size: 4rem;
  font-weight: 700;
  line-height: 100%;
}

.title-container {
  position: fixed;
  z-index: 9;
}

.hero-wrapper {
  flex: 1;
  position: relative;
}
</style>
