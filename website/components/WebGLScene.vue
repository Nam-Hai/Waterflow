<template>
  <div class="wrapper-scene">
    <canvas ref="canvasRef"></canvas> 
  </div>
</template>

<script lang='ts' setup>
import  Canvas  from '@/scene/canvas.js';
import { useFlowProvider } from '../../index';


const canvasRef = ref()
const sceneRef = ref()

onMounted(()=>{
  sceneRef.value = new Canvas({canvas: canvasRef.value})
  const flowProvider = useFlowProvider()
  flowProvider.addProps('canvas', sceneRef)
})

onUnmounted(()=>{
  sceneRef.value.destroy()
})

</script>

<style lang="scss" scoped>
.wrapper-scene {
  position: relative;
  z-index: 4;
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
