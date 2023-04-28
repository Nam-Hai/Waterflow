<template>
  <div class="display-preloader" v-if="!show && !timeout">
    {{ index }}
  </div>
</template>

<script lang="ts" setup>
import { stringify } from 'querystring';
import { onMounted, ref } from 'vue';
import { routerKey } from 'vue-router';
import { useManifest } from '~/composables/useManifest';
import { useCanvas } from '~/scene/useCanvas';

const router = useRouter()
const show = ref(false)
let timeout = ref(false)
const index = ref(0)

const manifest = useManifest()
const canvas = useCanvas()

onMounted(() => {
  manifest.callback = (i)=>{
    index.value = i
    console.log(i, index.value);
  }
  setTimeout(() => {
    timeout.value = true
  }, 1000)


  if (index.value != 0) {
    show.value = true
    return
  }
  manifest.loadManifest()
})
// watch(manifest.index, i => {
//   console.log(i);
// })

watch(() => index.value == manifest.length && timeout.value, (i) => {
  console.log('object', index.value);

  show.value = true
  canvas.onChange({name:'home'})
  console.log(canvas);
  console.log(canvas.currentCanvasPage, canvas.nextCanvasPage);
  canvas.currentCanvasPage = canvas.nextCanvasPage
  console.log(canvas.currentCanvasPage, canvas.nextCanvasPage);
  router.push('/home')
})

</script>

<style lang="scss">
.display-page {
  position: absolute;

  top: 0;
  z-index: 1;
}

.display-preloader {
  z-index: 14;
  position: absolute;
  color: red;
  font-size: 40rem;

}
</style>
