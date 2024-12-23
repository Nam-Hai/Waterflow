<template>
  <NuxtLayout>
    <WaterflowRouter :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { provideFlowProvider } from './lib/waterflow/FlowProvider';
import WaterflowRouter from './lib/waterflow/WaterflowRouter.vue';

provideFlowProvider({})
provideScreen({})
const lenis = useLenis()


</script>
