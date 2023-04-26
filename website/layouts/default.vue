<template>
  <WebGLScene />
  <BufferPage>
    <slot />
  </BufferPage>
</template>

<script setup lang="ts">
import Canvas from '~/scene/canvas';
import { provideCanvas, useCanvas } from '~/scene/useCanvas';
import { BufferPage } from '../../index';
import { useFlowProvider } from '../../index';

const { $lenis } = useNuxtApp()

const flowProvider = useFlowProvider()

onBeforeMount(() => {
  const canvas = new Canvas()
  provideCanvas(canvas)
})


useRaf((e) => {
  !flowProvider.flowIsHijacked && $lenis.raf(e.elapsed)
})

flowProvider.registerScrollInterface({
  resume: () => { $lenis.start() },
  stop: () => { $lenis.stop() },
  scrollToTop: () => { $lenis.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped></style>
