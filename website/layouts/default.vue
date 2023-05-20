<template>
  <WebGLScene />

  <Preloader>
    <BufferPage>
    </BufferPage>
  </Preloader>
</template>

<script setup lang="ts">
import { BufferPage, useFlowProvider } from '~/waterflow';

const { $lenis } = useNuxtApp()

const flowProvider = useFlowProvider()



useRaf((e) => {
  !flowProvider.flowIsHijacked && $lenis.raf(e.elapsed)
}, false, true)

onMounted(() => {
  $lenis.scrollTo('top')
})

flowProvider.registerScrollInterface({
  resume: () => { $lenis.start() },
  stop: () => { $lenis.stop() },
  scrollToTop: () => { $lenis.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped></style>
