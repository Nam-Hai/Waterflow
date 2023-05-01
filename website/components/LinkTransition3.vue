<template>
    <div class="link__wrapper" ref="wrapperRef">
        <div ref="bladeRef" class="blade"></div>
    </div>
</template>

<script lang="ts" setup>


const { $TL } = useNuxtApp()
const wrapperRef = ref()
const bladeRef = ref()


</script>

<style lang="scss" scoped>
@use '@/styles/sass/easing.sass' as *;
.link__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;

    &:hover {
        .blade {
            transform: scaleX(1);
        }
    }
}

.blade {
    width: 100%;
    height: 100%;
    background: #FFF27A60;
    transform: scaleX(0);
    transform-origin: left;
    transition-duration: 750ms;
    transition-property: transform;
    transition-timing-function: $easeInOutCubic;
}
</style>