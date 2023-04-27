<template>
  <div v-if="show">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useManifest } from '~/composables/useManifest';


const show = ref(false)

onMounted(() => {
  const manifest = useManifest()

  const index = manifest.index

  watch(index, (i) => {
    if (i == manifest.length) {
      show.value = true
    }
  })
  manifest.loadManifest()



})

</script>

<style lang="scss"></style>
