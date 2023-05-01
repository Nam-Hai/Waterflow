<template>
  <div class="wrapper__index">
    <div class="title-placeholder" ref="titlePlaceholderRef">
      <h1><span ref="titleSpanRef" style="opacity: 0;">WATER</span><span
          style="display: inline-flex; overflow: hidden;"><span ref="flowSpanRef"
            style="transform: translateX(-100%); opacity: 0;">FLOW</span></span></h1>
    </div>
    <div class="title">
      <div ref="titleRef" style="transform-origin: center;">
        WATER
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePageFlow } from '@nam-hai/water-flow'

const titleRef = ref()
const titleSpanRef = ref()
const titlePlaceholderRef = ref()
const flowSpanRef = ref()

const { $TL } = useNuxtApp()


usePageFlow({
  disablePointerEvent: false,
  enableCrossfade: true,
  props: {
    title: titleRef
  },
  flowOut: ({ title }, resolve) => {
    const tl = new $TL()
    const nextBounds = titleSpanRef.value.getBoundingClientRect()
    const initBounds = titleRef.value.getBoundingClientRect()
    const titlePlaceholderHeight = titlePlaceholderRef.value.clientHeight

    console.log(titlePlaceholderHeight, nextBounds.height)

    tl.from({
      el: title.value,
      d: 1000,
      e: 'io4',
      p: {
        y: [0, - innerHeight / 2 + titlePlaceholderHeight / 2, 'px'],
        x: [0, -innerWidth / 2 + nextBounds.x + nextBounds.width / 2, 'px'],
        s: [1, nextBounds.height / initBounds.height]
      },
      cb: () => {
        // console.log('test')
      }
    }).from({
      d: 1000,
      delay: 500,
      e: 'o4',
      p: {
        x: [-100, 0]
      },
      el: flowSpanRef.value,
      cb: resolve
    }).from({
      el: flowSpanRef.value,
      d: 0,
      delay: 500,
      p: {
        o: [0, 1],
      }
    })
    tl.play()
  }
})
</script>

<style scoped lang="scss">
</style>
