<template>
  <NuxtLink to="https://twitter.com/_NamHai" target="_blank">
    <div class="wt-wrapper" ref="wtRef">
      <span>A Nam Hai Library</span>
      <span class="daffodil">- Be water</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { onFlow } from '~/waterflow';
import { N } from '~/helpers/namhai-utils';

const fromPreloader = inject('from-preloader') as Ref<boolean>
const { $TL } = useNuxtApp()
const wtRef = ref()
onMounted(()=>{
  if (!fromPreloader.value) {
    N.T(wtRef.value, 0, 0)
    N.O(wtRef.value, 1)
    return
  }
})

onFlow(() => {
  if (!fromPreloader.value) return
  let tl = new $TL
  tl.from({
    el: wtRef.value,
    d: 1000,
    p: {
      x: [100,0],
      o: [0,1]
    },
    e: 'o3'
  })

  .play()
})

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

.wt-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: all;
  transform: translateX(100);
  opacity: 0;

  span:first-child {
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
    text-transform: uppercase;
  }

  span.daffodil {
    font-family: 'Daffodil';
    font-size: 6.4rem;
    color: $secondary;
    line-height: 50%;
  }
}
</style>
