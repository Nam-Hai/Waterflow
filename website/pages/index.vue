<template>
  <WaterflowTitle ref="waterFlowTitleRef" />
  <div ref="heightHolderRef" style="margin-top: 28rem">
  </div>
  <div class="container-home" ref="wrapperRef">

    <div id="home" class="wrapper-home" ref="contentRef">
      <div class="page page-with-title">
        <div class="grid-container">
          <div class="left">
            <h2 class="mask-split-line">
              <span ref="titleSpanRef" style="transform: translate(-2%, -100%);">
                <span ref="rotateRef">
                  Do you even <span class="font-museo">flow</span> ?
                </span>
              </span>
            </h2>
            <p ref="pRef">Give your project by the power of the nature. Go with the flow and create
              transitions that you always
              dreamed of. Enable your creativity with Waterflow and make your website stand out. A Vue.js library
              for page transitions crossfade.</p>
            <h3 ref="headerRef">Fast. Light. Modular. For <span class="secondary">Vue.js</span>.</h3>

            <Clipboard />

            <Links />
          </div>
          <div class="right" ref="watermarkContainerRef">
            <Watermark />
          </div>
        </div>
      </div>
      <SliceSlice1 />
      <SliceSlice2 />
      <SliceSlice3 />
      <SliceSlice4 />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onFlow, useFlowProvider, usePageFlow } from '@nam-hai/water-flow';
import { T } from '~/helpers/core/utils';
import { indexOutMap, indexInMap } from './index.transition'
import indexCanvas from '~/scene/Pages/indexCanvas';

const { $RafR, $TL, $lenis, $canvas } = useNuxtApp()
const titleSpanRef = ref()
const rotateRef = ref()

const fromPreloader = inject('from-preloader') as Ref<boolean>
const wrapperRef = ref()
const contentRef = ref()
const heightHolderRef = ref()
const waterFlowTitleRef = ref()
const pRef = ref()
const headerRef = ref()
const watermarkContainerRef = ref()

onMounted(() => {
  $lenis.dimensions.onWindowResize()
  $lenis.dimensions.onContentResize()

  $lenis.scrollTo('top')
})

useRO(() => {
  $lenis.dimensions.onWindowResize()
  $lenis.dimensions.onContentResize()
  const height = wrapperRef.value.getBoundingClientRect().height
  heightHolderRef.value.style.height = height + 'px'
  lenis.emit()
})

const { lenis } = useLenisScroll(({ current }) => {
  T(contentRef.value, 0, -current, 'px')
})

onFlow(() => {
  const curCanvas = $canvas.currentCanvasPage as unknown as indexCanvas
  const noiseWebGL = curCanvas.noiseBackground

  $lenis.dimensions.onWindowResize()
  $lenis.dimensions.onContentResize()

  if (!fromPreloader.value) {
    titleSpanRef.value.style.transform = "translate(0px , 0px)"
    rotateRef.value.style.transform = "rotateX(0deg)"
    pRef.value.style.opacity = '1'
    headerRef.value.style.opacity = '1'
    return
  }

  let tl = new $TL()
  tl.from({
    el: titleSpanRef.value,
    d: 1500,
    p: {
      y: [100, 0],
      x: [-2, 0],
    },
    e: 'o3'
  }).from({
    el: rotateRef.value,
    d: 1000,
    p: {
      rotateX: [-90, 0]
    },
    e: 'o3'
  }).from({
    el: pRef.value,
    d: 1000,
    p: {
      o: [0, 1]
    },
    delay: 500
  }).from({
    el: headerRef.value,
    d: 1000,
    p: {
      o: [0, 1]
    },
    delay: 500
  }).from({
    d: 1000,
    update: ({ progE }) => {
      if (noiseWebGL) {
        noiseWebGL.uAlpha.value = progE
      }
    }
  }).play()
})

const flowProvider = useFlowProvider()

usePageFlow({
  props: {
    wrapperRef,
    waterFlowTitleRef,
    watermarkContainerRef,
    titleSpanRef,
    pRef,
    headerRef,
    rotateRef
  },
  enableCrossfade: 'TOP',
  flowOutMap: indexOutMap,
  flowOut: async ({ wrapperRef }, resolve, { canvasWrapperRef, flowRef }) => {
    $canvas.onChange(flowProvider.getRouteTo())
    await $canvas.nextCanvasPage?.init()
    $canvas.currentCanvasPage?.destroy()
    $canvas.currentCanvasPage = $canvas.nextCanvasPage
    resolve()
  },
  flowInCrossfadeMap: indexInMap,
  flowInCrossfade: ({ }, resolve) => {
    let tl = new $TL
    waterFlowTitleRef.value.border.style.transformOrigin = 'center'

    const indexCanvas = $canvas.pages.index as unknown as indexCanvas
    const noiseWebGL = indexCanvas.noiseBackground

    tl.from({
      el: waterFlowTitleRef.value.border,
      p: {
        scale: [0, 1]
      },
      d: 1000,
      e: 'io4',
      cb: () => {
        resolve()
      }
    }).play()

    noiseWebGL.uAlpha.value = 1
    titleSpanRef.value.style.transform = "translate(0px , 0px)"
    rotateRef.value.style.transform = "rotateX(0deg)"
    pRef.value.style.opacity = '1'
    headerRef.value.style.opacity = '1'
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.container-home {
  top: $title-height;
  overflow: hidden;
  position: fixed;
  width: 100vw;

  @include breakpoint(mobile) {
    top: $title-height-mobile + 1.6rem;
  }
}

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  perspective: 1000px;
}

.page.page-with-title {
  height: calc(100vh - $title-height);

  @include breakpoint(mobile) {
    height: calc(100vh - $title-height-mobile);
  }

}

.grid-container {
  // padding: 2.4rem 10rem 4rem;
  padding: 2.4rem 0rem 4rem;
  margin: 0 auto;
  width: 151.4rem;
  display: flex;
  flex-grow: 1;

  .left {
    width: 50%;
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    width: 50%;

    p,
    h3 {
      opacity: 0;
    }
  }

  .right {
    width: 50%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
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

div.title-container {
  position: fixed;
  z-index: 9;
  top: 0;
}

.hero-wrapper {
  flex: 1;
  position: relative;
}

.slice {
  margin-top: 50vh;

  &.slice-1 {
    margin-top: 0;
  }
}
</style>
