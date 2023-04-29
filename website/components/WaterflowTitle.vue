<template>
  <div class="title-container">
    <h1 ref="titleRef">WATERFLOW</h1>
    <div v-if="display" ref="borderRef" class="border"></div>
  </div>
</template>

<script setup lang="ts">
import { onFlow } from '~/../src/composables/onFlow';

const { $TL } = useNuxtApp()

const props = withDefaults(defineProps<{
  display?: boolean
}>(), { display: true })

const borderRef = ref()
const titleRef = ref()

const { $canvas } = useNuxtApp()
onFlow(() => {

  if ($canvas.currentCanvasPage && $canvas.currentCanvasPage.addMedia) {
    $canvas.currentCanvasPage.addTitle(titleRef.value)
  }

  if (!props.display) return
  let tl = new $TL
  tl.from({
    el: borderRef.value,
    p: {
      scaleX: [0, 1],
      o: [0, 1],
    },
    d: 1500,
    e: 'o3'
  }).play()
})
</script>

<style lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.title-container {
  height: $title-height;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include breakpoint(mobile) {
    height: $title-height-mobile;
    margin-top: 1.6rem;
  }

  .border {
    width: 151.4rem;

    @include breakpoint(mobile) {
      width: 32rem; 
    }

    // width: calc(100% - 21rem);
    height: 2px;
    background-color: $primary;
    position: absolute;
    bottom: 0;
  }
}

h1 {
  text-align: center;
  font-family: Amarante;
  font-size: 30rem;
  font-weight: 400;

  opacity: 0;

  @include breakpoint(mobile) {
    font-size: $title-height-mobile
  }
}
</style>
