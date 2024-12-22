<template>
  <div class="layout__wrapper">
    <Overlay />
    <Menu />
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export const [provideLayout, useLayout] = createContext(() => {
  const overlay: ShallowRef<HTMLElement | undefined> = shallowRef()
  const provideOverlay = (el: HTMLElement) => {
    overlay.value = el
  }
  return {
    overlay: shallowReadonly(overlay),
    provideOverlay
  }
})
</script>

<script setup lang="ts">
import type { ShallowRef } from 'vue';

provideLayout({})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.layout__wrapper {}

.page__wrapper {}

h1 {
  font-family: "Amarante";
}
</style>
