<template>
    <div class="overlay__wrapper" ref="overlay">

    </div>
</template>

<script lang="ts" setup>
import { useLayout } from '~/layouts/default.vue';

const overlay = useTemplateRef("overlay")

const { provideOverlay } = useLayout()
onMounted(() => {
    if (!overlay.value) return
    provideOverlay(overlay.value)
})
</script>
<style scoped lang="scss">
.overlay__wrapper {
    position: fixed;
    z-index: 51;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    background-color: black;
    opacity: 0;

    pointer-events: none;
}
</style>