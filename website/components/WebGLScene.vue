<template>
  <div ref="wrapperSceneRef" class="wrapper-scene">
  </div>
  <div class="wrapper-title-scene"></div>
</template>

<script lang='ts' setup>
import { useFlowProvider } from '~/..'
import Canvas from '~/scene/canvas'
import { provideCanvas, useCanvas } from '~/scene/useCanvas'


const sceneRef = ref()
const wrapperSceneRef = ref()

onMounted(() => {

  const canvas = useCanvas()

  canvas.init()

  sceneRef.value = canvas

  wrapperSceneRef.value.appendChild(canvas.gl.canvas)

  const flowProvider = useFlowProvider()
  flowProvider.addProps('canvas', sceneRef)
})

onUnmounted(() => {
  // sceneRef.value.gl.canvas.remove()
  sceneRef.value.destroy()

})

</script>

<style lang="scss">
.wrapper-title-scene {
  position: fixed;
  z-index: 13;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
  opacity: 0.2;
}

.wrapper-scene {
  position: relative;
  z-index: 2;
  pointer-events: none;

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

  }
}
</style>
