<template>
  <Preloader />
  <WebGLScene />

  <BufferPage>
    <slot />
  </BufferPage>
</template>

<script setup lang="ts">
import Canvas from '~/scene/canvas';
import { BufferPage } from '../../index';
import { useFlowProvider } from '../../index';
import CanvasTitle from '~/scene/CanvasTitle';
import { provideCanvasTitle } from '~/scene/useCanvasTitle';

import Manifest from '~/composables/Manifest';
import { provideManifest } from '~/composables/useManifest';

const { $lenis, $canvas } = useNuxtApp()

const flowProvider = useFlowProvider()

onBeforeMount(() => {
  // const canvas = new Canvas()
  // provideCanvas(canvas)

  // const canvasTitle = new CanvasTitle
  // provideCanvasTitle(canvasTitle)

  const manifest = new Manifest($canvas.gl)
  provideManifest(manifest)
})

onUnmounted(() => {
  // provideCanvas(undefined)
  // provideCanvasTitle(undefined)
})

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
