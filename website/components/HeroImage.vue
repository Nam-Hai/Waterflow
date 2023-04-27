<template>
  <div class="hero-wrapper">
    <img v-opacity-flow="500" ref="heroRef" class="hero" src="images/dummy.jpg">
  </div>
</template>

<script lang="ts" setup>
import { vOpacityFlow } from '@/directives/OpacityFlow'
import { onFlow } from "../../index"

const heroRef = ref()

const { $TL } = useNuxtApp()
onFlow(() => {
  // let tl = new $TL()
  // tl.from({
  //   el: heroRef.value,
  //   p: {
  //     s: [0, 1]
  //   },
  //   d: 1000,
  //   e: 'o3'
  // })
  //
  // tl.play()
})

</script>

<style lang="scss">
.hero-wrapper {
  img {
    opacity: 0;
    border-radius: 4rem;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
