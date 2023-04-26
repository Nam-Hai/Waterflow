<template>
  <div ref="wrapperSceneRef" class="wrapper-scene">
  </div>
</template>

<script lang='ts' setup>
import { useFlowProvider } from '~/..'
import Canvas from '~/scene/canvas'
import { provideCanvas, useCanvas } from '~/scene/useCanvas'


const sceneRef = ref()
const wrapperSceneRef = ref()

onMounted(()=>{
  const canvas = useCanvas()
  canvas.init()

  sceneRef.value = canvas

  wrapperSceneRef.value.appendChild(canvas.gl.canvas)

  const flowProvider = useFlowProvider()
  flowProvider.addProps('canvas', sceneRef)
})

onUnmounted(()=>{
  sceneRef.value.destroy()
})

</script>

<style lang="scss">
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
