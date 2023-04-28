<template>
  <div class="hero-wrapper">
    <div ref="heroRef" class="hero" data-src="images/2.jpg"></div>
    <!-- <img ref="heroRef" class="hero" src="images/dummy.jpg"> -->
  </div>
</template>

<script lang="ts" setup>
import { vOpacityFlow } from '@/directives/OpacityFlow'
import { onFlow } from "../../index"
// import { useCanvas } from '~/scene/useCanvas.client'

const heroRef = ref()

const { $TL, $canvas } = useNuxtApp()
onMounted(() => {

  if ($canvas.currentCanvasPage && $canvas.currentCanvasPage.addMedia) {
    $canvas.currentCanvasPage.addMedia(heroRef.value)
  }
})

</script>

<style lang="scss">
.hero-wrapper {

  >div,
  img {
    // opacity: 0;
    border-radius: 4rem;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
