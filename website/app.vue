<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

import index from '@/pages/index.vue';
import Example2 from './pages/example2.vue';
import Example3 from './pages/example3.vue';
import Example1 from './pages/example1.vue';
import { FlowProvider, provideFlowProvider } from '@nam-hai/water-flow';
// import home from '@/pages/home.vue';

const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

provide('from-preloader', {value: true})

flowProvider.registerPage(index)
flowProvider.registerPage(Example2)
flowProvider.registerPage(Example3)
flowProvider.registerPage(Example1)
// flowProvider.registerPage('home', home)

onMounted(() => {
})
</script>

