<template>
  <Preloader />
  <WebGLScene />

  <BufferPage>
    <slot />
  </BufferPage>
</template>

<script setup lang="ts">
import { BufferPage } from '@nam-hai/water-flow';
import { useFlowProvider } from '../../index';

const { $lenis, $canvas, $canvasTitle} = useNuxtApp()

const flowProvider = useFlowProvider()



useRaf((e) =>{
  !flowProvider.flowIsHijacked && $lenis.raf(e.elapsed)
}, false, true)


flowProvider.registerScrollInterface({
  resume: () => { $lenis.start() },
  stop: () => { $lenis.stop() },
  scrollToTop: () => { $lenis.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped></style>
