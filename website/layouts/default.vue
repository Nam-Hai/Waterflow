<template>
  <WebGLScene />
  <BufferPage>
    <slot />
  </BufferPage>

</template>

<script setup lang="ts">
import { BufferPage } from '../../index';
import { useFlowProvider } from '../../index';
// configure lenis in @/plugins/lenis.client.ts
const { $lenis } = useNuxtApp()

const flowProvider = useFlowProvider()


useRaf((e) => {
  !flowProvider.flowIsHijacked && $lenis.raf(e.elapsed)
})

flowProvider.registerScrollInterface({
  resume: () => { $lenis.start() },
  stop: () => { $lenis.stop() },
  scrollToTop: () => { $lenis.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped>
</style>
