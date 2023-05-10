<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from '~/../index'

import index from '@/pages/index.vue';
import Example2 from './pages/example2.vue';
import Example3 from './pages/example3.vue';
import Example1 from './pages/example1.vue';

const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)
provide('from-preloader', {value: true})

flowProvider.registerPage('index', index)
flowProvider.registerPage('example2', Example2)
flowProvider.registerPage('example3', Example3)
flowProvider.registerPage('example1', Example1)

onMounted(() => {
})
</script>

