<template>
  <div class="slice wrapper slice-2" ref="wrapperRef">

    <div class="container" ref="containerRef">
      <div class="slice__header">
        <h2>How does it work ?</h2>
        <p>
          To create these fancier page transitions, Waterfall use a “BufferPage” component to render the next page
          during the onBeforeRouteLeave lifecycle.
        </p>
      </div>
      <div class="displayer">
        <div ref="layer1Ref" class="layer layer-1"></div>
        <div ref="layer2Ref" class="layer layer-2"></div>
        <div ref="layer3Ref" class="layer layer-3"></div>
      </div>
      <div class="flavor-text">
        <div class="mount__wrapper flavor__wrappers" ref="mountWrapperRef">
          <span>Mount Bufferpage</span>
          <div class="border" ref="borderRef"></div>
        </div>
        <div class="flavor__wrappers crossfade__wrapper" ref="crossfadeWrapperRef">
          <span>Crossfade Animation</span>
          <div class="border" ref="borderCrossfadeRef"></div>
        </div>
        <div class="flavor__wrappers change-page__wrapper" ref="changePageWrapperRef">
          <span>Change Page</span>
          <div class="border" ref="borderChangePageRef"></div>
        </div>
        <div class="flavor__wrappers unmount__wrapper" ref="unmountWrapperRef">
          <span>Unmount bufferpage</span>
          <div class="border" ref="borderUnMountRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ease } from '~/helpers/core/eases'
import { Clamp, Lerp, T, iLerp } from '~/helpers/core/utils'

useLenisScroll(() => {
})

const containerRef = ref()
const wrapperRef = ref()
const endRef = ref(0)
useResize(({ vh, vw }) => {
  endRef.value = vh * 4

})

const { $canvas } = useNuxtApp()

const borderRef = ref()

useScrollEvent({
  el: wrapperRef,
  vStart: 100,
  end: 0,
  onProgress: (t) => {
    if (!$canvas.currentCanvasPage) return
    if (!$canvas.currentCanvasPage.noiseBackground) return
    const bgColors = $canvas.currentCanvasPage.noiseBackground.bgColors
    const r = Lerp(bgColors[1][0], bgColors[2][0], t)
    const g = Lerp(bgColors[1][1], bgColors[2][1], t)
    const b = Lerp(bgColors[1][2], bgColors[2][2], t)
    $canvas.currentCanvasPage.noiseBackground.bgColor.value = [r, g, b]
  },
})

const layer1Ref = ref()
const layer2Ref = ref()
const layer3Ref = ref()
let layer1Active = false
let layer2Active = false
let layer3Active = false
let mountBufferActive = false
let unmountBufferActive = false
let crossfadeActive = false
let changePageActive = false
const mountWrapperRef = ref()
const crossfadeWrapperRef = ref()
const borderCrossfadeRef = ref()

const changePageWrapperRef = ref()
const borderChangePageRef = ref()
const borderUnMountRef = ref()
const unmountWrapperRef = ref()

usePin({
  el: containerRef,
  start: 0,
  end: endRef,
  onProgress: (t) => {
    if ((t > 0.10 && t < 0.3) && !layer2Active) {
      layer2Ref.value.classList.add('active')
      layer2Active = true
    } else if (t <= 0.1 && layer2Active) {
      layer2Ref.value.classList.remove('active')
      layer2Active = false
    }
    if (t > 0.1 && t < 0.3 && !mountBufferActive) {
      mountWrapperRef.value.classList.add('active')
      mountBufferActive = true
    } else if ((t <= 0.1 || t >= 0.3) && mountBufferActive) {
      mountBufferActive = false
      mountWrapperRef.value.classList.remove('active')
    }

    const progMountBuffer = Clamp(iLerp(t, 0.1, 0.3), 0, 1);
    layer2Ref.value.style.transform = 'translateY(' + Ease.io2(1 - progMountBuffer) * -40 + 'rem) rotate(15deg)';
    borderRef.value.style.transform = 'scaleX(' + progMountBuffer + ')'
    layer2Ref.value.style.opacity = Ease.o6(progMountBuffer)

    if (t > 0.3 && t < 0.5 && !crossfadeActive) {
      crossfadeWrapperRef.value.classList.add('active')
      crossfadeActive = true
    } else if ((t <= 0.3 || t >= 0.5) && crossfadeActive) {
      crossfadeActive = false
      crossfadeWrapperRef.value.classList.remove('active')
    }

    if (t > 0.3) {
      const progCrossfadeAnimation = Clamp(iLerp(t, 0.3, 0.5), 0, 1);
      layer2Ref.value.style.transform = 'translateY(0rem) rotate(' + (15 + 180 * progCrossfadeAnimation) + 'deg)';
      borderCrossfadeRef.value.style.transform = 'scaleX(' + progCrossfadeAnimation + ')'
    }

    if (t <= 0.5 && !layer1Active) {
      layer1Ref.value.classList.add('active')
      layer1Active = true
    }
    if (t > 0.50 && !layer3Active) {
      layer3Ref.value.classList.add('active')
      layer3Active = true
      layer1Ref.value.classList.remove('active')
    } else if (t <= 0.5 && layer3Active) {
      layer3Ref.value.classList.remove('active')
      layer3Active = false
      layer1Ref.value.classList.remove('active')
      layer1Active = false
    }

    if (t > 0.5 && t < 0.7 && !changePageActive) {
      changePageActive = true
      changePageWrapperRef.value.classList.add('active')
    } else if ((t <= 0.5 || t >= 0.6) && changePageActive) {
      changePageActive = false
      changePageWrapperRef.value.classList.remove('active')
    }

    const progChangePage = Clamp(iLerp(t, 0.5, 0.6), 0, 1);
    borderChangePageRef.value.style.transform = 'scaleX(' + progChangePage + ')'


    if (t > 0.7 && t < 0.9 && !unmountBufferActive) {
      unmountWrapperRef.value.classList.add('active')
      unmountBufferActive = true
    } else if ((t >= 0.9 || t <= 0.7) && unmountBufferActive) {
      unmountBufferActive = false
      unmountWrapperRef.value.classList.remove('active')
    }

    const progUnMountBuffer = Clamp(iLerp(t, 0.7, 0.9), 0, 1);
    if (t > 0.7) {
      layer2Ref.value.style.opacity = 1 - progUnMountBuffer
      layer2Ref.value.style.transform = 'translateY(' + Ease.io2(progUnMountBuffer) * -40 + 'rem) rotate(15deg)';
      borderUnMountRef.value.style.transform = 'scaleX(' + progUnMountBuffer + ')'
    }
  }
})

</script>

<style scoped lang="scss">
$primary: #F0D6F4;
$bg: #151E4D;
$soft: #2A356B;

.wrapper.slice {
  position: relative;
  height: 500vh;
  width: 100vw;
  display: flex;
  justify-content: center;

  .container {
    padding-top: 28rem;
    height: 100vh;
    width: 154rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-family: "HelveticaNeue";
    text-transform: uppercase;
    font-weight: 700;
    position: relative;

    .displayer {
      position: relative;
      display: flex;
      align-items: center;

      .layer {
        position: absolute;
        width: 25rem;
        height: 25rem;
        border-radius: 1rem;
        transform: rotate(15deg);
        transition: opacity 300ms, transform 300ms;

        &.layer-1 {
          background-color: #627378;
          left: 20rem;
          top: -20rem;
          opacity: 0;
          transform: translate(-10px, -45px) rotate(10deg);

          &.active {
            transform: translate(0, 0) rotate(15deg);
            opacity: 1;
          }
        }

        &.layer-2 {
          background-color: #8D6E75;
          left: 10rem;
          top: -17rem;
          transform: translateY(-20rem);
          opacity: 0;
          transition: opacity 300ms;

          &.active {
            opacity: 1;
          }
        }

        &.layer-3 {
          background-color: #A16CA3;
          opacity: 0;
          transform: translate(-10px, -5px) rotate(5deg);

          &.active {
            transform: translate(0, 0) rotate(15deg);
            opacity: 1;
          }
        }
      }
    }

    h2 {
      font-size: 11rem;
      color: $primary;
    }

    p {
      font-size: 2.6rem;
      color: $primary;
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
      font-size: 2.4rem;
      color: $primary;
      position: relative;
      width: 30rem;
      display: flex;
      justify-content: flex-end;

      .flavor__wrappers {
        position: absolute;
        opacity: 0;
        transform: translateY(50%);

        transition-property: opacity, transform;
        transition-duration: 300ms;

        &.active {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mount__wrapper {
        top: -5rem;
      }

      .crossfade__wrapper {
        top: -2.5rem
      }

      .unmount__wrapper {
        top: 2.5rem
      }


      .border {
        height: 0.2rem;
        width: 100%;
        background-color: $primary;
        transform-origin: left;
      }
    }
  }
}
</style>
