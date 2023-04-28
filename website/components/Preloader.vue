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

const router = useRouter()
const show = ref(false)
let timeout = ref(false)
const index = ref(0)

const { $canvas } = useNuxtApp()
console.log($canvas);

const manifest = useManifest()

// const canvas = useCanvas()
onMounted(() => {
  // console.log(canvas);
  manifest.callback = (i) => {
    index.value = i
    if (i == manifest.length) {
      show.value = true


      $canvas.onChange({ name: 'home' })
      $canvas.currentCanvasPage = $canvas.nextCanvasPage
      router.push('/home')


    }
  }
  manifest.loadManifest()
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
