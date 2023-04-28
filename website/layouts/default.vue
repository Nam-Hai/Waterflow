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

import Manifest from '~/composables/Manifest';
import { provideManifest } from '~/composables/useManifest';

const { $lenis, $canvas, $canvasTitle} = useNuxtApp()

const flowProvider = useFlowProvider()

onBeforeMount(() => {
  const manifest = new Manifest($canvas.gl, $canvasTitle.gl)
  provideManifest(manifest)
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
