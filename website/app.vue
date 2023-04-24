<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from '../index'

import index from '@/pages/index.vue';
import Canvas from './scene/canvas';
import { provideCanvas } from './scene/useCanvas';


const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

flowProvider.registerPage('index', index)

onMounted(() => {
})
</script>

