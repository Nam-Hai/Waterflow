<template>
  <NuxtLayout>
    <CustomRouter :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CustomRouter from './lib/waterflow/CustomRouter.vue';
import { provideFlowProvider } from './lib/waterflow/FlowProvider';

const route = useRoute()
provideFlowProvider({ route })
provideScreen({})
const lenis = useLenis()


</script>
