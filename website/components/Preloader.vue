<template>
  <div class="display-preloader" v-if="!show && !timeout">
    {{ index }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { routerKey } from 'vue-router';
import { useManifest } from '~/composables/useManifest';

const router = useRouter()
const show = ref(false)
let timeout = ref(false)
let index = ref(0)

onBeforeMount(() => {
  const manifest = useManifest()
  index = manifest.index
  setTimeout(() => {
    timeout.value = true
  }, 1000)

  watch(() => index.value == manifest.length && timeout.value, (i) => {
    show.value = true
    router.push('/home')
  })

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
