<template>
  <div :class="{'buffer-page__TOP': bufferTopZ}"  class="buffer-page__wrapper">
    <component :is="bufferRouteState" />
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

<style scoped lang="scss">
.buffer-page__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.buffer-page__TOP {
  z-index: 3;
}
</style>
