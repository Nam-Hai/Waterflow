<template>
  <div class="display-preloader" v-if="!show && !timeout">
    {{ index }}
  </div>
  <div class="display-page" v-if="show && timeout">
    <WebGLScene />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useManifest } from '~/composables/useManifest';

const show = ref(false)
let timeout = ref(false)
let index = ref(0)

onBeforeMount(() => {
  const manifest = useManifest()
  index = manifest.index
  setTimeout(() => {
    timeout.value = true
  }, 500)

  watch(index, (i) => {
    if (i == manifest.length) {
      show.value = true
    }
  })
  // timeout.value = true

  if (index.value != 0) {
    show.value = true
    return
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
  z-index: 2;
  position: absolute;
  color: red;
  font-size: 40rem;

}
</style>
