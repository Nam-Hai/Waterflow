<template>
  <div class="title-container">
    <h1 :class="{ display: show }" ref="titleRef">WATERFLOW</h1>
    <div v-if="display" ref="borderRef" class="border"></div>
  </div>
</template>

<script setup lang="ts">
import { onFlow } from '@nam-hai/water-flow';

const { $TL, $canvas } = useNuxtApp()

const borderRef = ref()
const titleRef = ref()

const props = withDefaults(defineProps<{
  display?: boolean,
  show?: boolean,
}>(), { display: true, tl: undefined, show: false })

defineExpose({
  border: borderRef
})

onMounted(() => {
  if (!props.display) return
  borderRef.value.style.transform = 'scale(1)'
})

onFlow(() => {
})

</script>

<style lang="scss" scoped>
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.title-container {
  height: $title-height;
  width: 120vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include breakpoint(mobile) {
    height: $title-height-mobile;
    margin-top: 1.6rem;
  }

  .border {
    width: 151.4rem;
    transform-origin: left;
    transform: scale(0);

    @include breakpoint(mobile) {
      width: 32rem;
    }

    // width: calc(100% - 21rem);
    height: 2px;
    background-color: currentColor;
    position: absolute;
    bottom: 0;
  }
}

h1 {
  text-align: center;
  font-family: Amarante;
  font-size: 30rem;
  font-weight: 400;

  opacity: 0;

  &.display {
    opacity: 1;
  }

  @include breakpoint(mobile) {
    font-size: $title-height-mobile
  }
}
</style>
