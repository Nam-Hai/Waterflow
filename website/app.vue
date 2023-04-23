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


const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

flowProvider.registerPage('/', index)


</script>

