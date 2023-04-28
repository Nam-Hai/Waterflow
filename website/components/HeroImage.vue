<template>
  <div class="hero-wrapper">
    <div ref="heroRef" class="hero" data-src="images/dummy.jpg"></div>
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
  // const canvas = useCanvas()
  console.log('objecyoooooooot');

  console.log($canvas.currentCanvasPage?.addMedia);
  if ($canvas.currentCanvasPage && $canvas.currentCanvasPage.addMedia) {
    $canvas.currentCanvasPage.addMedia(heroRef.value)
  }


  // let tl = new $TL()
  // tl.from({
  //   el: heroRef.value,
  //   p: {
  //     s: [0, 1]
  //   },
  //   d: 1000,
  //   e: 'o3'
  // })

  // tl.play()
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
