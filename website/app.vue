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
import home from '@/pages/home.vue';

const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

flowProvider.registerPage('index', index)
flowProvider.registerPage('home', home)

onMounted(() => {
})
</script>

