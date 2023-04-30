<template>
  <div ref="wrapperSceneRef" class="wrapper-scene">
  </div>
</template>

<script lang='ts' setup>


const sceneRef = ref()
const wrapperSceneRef = ref()
const wrapperSceneTitleRef = ref()

const { $canvas, $canvasTitle } = useNuxtApp()
onMounted(() => {
  // const canvas = useCanvas()
  $canvas.init()
  sceneRef.value = $canvas
  wrapperSceneRef.value.appendChild($canvas.gl.canvas)


  // $canvasTitle.init()
  // sceneTitleRef.value = $canvasTitle
  // wrapperSceneTitleRef.value.appendChild($canvasTitle.gl.canvas)


  // const flowProvider = useFlowProvider()
  // flowProvider.addProps('canvas', sceneRef)
})

onUnmounted(() => {
  // sceneRef.value.gl.canvas.remove()
  // sceneRef.value.destroy()
  // sceneTitleRef.value.destroy()

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
