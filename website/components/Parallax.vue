<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { N } from '~/helpers/namhai-utils';


const rootRef = ref()

type Props = {
  amount: number
}

const props = withDefaults(defineProps<Props>(), {
  amount: 1
})


useScrollEvent({
  el: rootRef,
  vStart: 100,
  end: 0,
  onProgress: (t) => {
    N.T(rootRef.value, 0, (1 - props.amount) * (t - 0.5) * 100, 'vh')
  }
})
</script>

<style scoped></style>
