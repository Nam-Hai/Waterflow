<template>
  <div :class="{'buffer-page__TOP': bufferTopZ}"  class="buffer-page__wrapper">
    <component :is="bufferRouteState" />
  </div>

  <div id="buffer-page__app">
    <slot />
  </div>
</template>

<script setup lang='ts'>
import { shallowRef } from 'vue';
import { useFlowProvider } from '../FlowProvider';

const bufferRouteState = shallowRef()
const bufferTopZ = shallowRef(false)
const provider = useFlowProvider()
provider.connectBuffer(bufferRouteState, bufferTopZ)

</script>

<style scoped>
.buffer-page__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9;
}

.buffer-page__TOP {
  z-index: 16;
}

#buffer-page__app {
  position: relative;
  z-index: 10;
}
</style>
