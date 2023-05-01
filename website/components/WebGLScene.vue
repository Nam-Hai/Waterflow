<template>
  <div ref="wrapperSceneRef" class="wrapper-scene">
  </div>
</template>

<script lang='ts' setup>
import { useFlowProvider } from '@nam-hai/water-flow'



const sceneRef = ref()
const wrapperSceneRef = ref()

const { $canvas } = useNuxtApp()
onMounted(() => {
  $canvas.init()
  sceneRef.value = $canvas
  wrapperSceneRef.value.appendChild($canvas.gl.canvas)
})

const flowProvider = useFlowProvider()
flowProvider.addProps('canvasWrapperRef', wrapperSceneRef)
const flowRef = ref(flowProvider)
flowProvider.addProps('flowRef', flowRef)

onUnmounted(() => {

})

</script>

<style lang="scss">
.wrapper-scene {
  position: relative;
  z-index: 2;
  pointer-events: none;

}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}
</style>
