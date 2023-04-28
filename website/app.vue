<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from '../index'

import { createPinia } from 'pinia'
import index from '@/pages/index.vue';
import Canvas from './scene/canvas';

// navigateTo('/')

// const router = useRouter()
// router.push('/')

// definePageMeta({
//   middleware: ["redirect"]
//   // or middleware: 'auth'
// })
const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

flowProvider.registerPage('index', index)

onMounted(() => {
})
</script>

