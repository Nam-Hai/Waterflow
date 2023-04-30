<template>
  <div class="wrapper__preloader">
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const router = useRouter()
const show = ref(false)
let timeout = ref(false)
const index = ref(0)

const { $TL, $canvas, $manifest } = useNuxtApp()


onMounted(() => {
  $manifest.callback = (i) => {
    index.value = i
    if (i == $manifest.length) {
      show.value = true

      const route = useRoute()
      if(route.name == 'home') return

      $canvas.onChange({ name: 'home' })

      $canvas.currentCanvasPage?.destroy()
      $canvas.currentCanvasPage = $canvas.nextCanvasPage

      router.push('/home')
    }
  }
  $manifest.loadManifest()


  const tl = new $TL()
  tl.from({
    
  })
})



</script>

<style lang="scss">

.wrapper__preloader{
  z-index: 14;
  position: absolute;
}
</style>
