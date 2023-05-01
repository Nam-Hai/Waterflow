<template>
    <NuxtLink to="/example2">
        <div class="link__wrapper" ref="wrapperRef">
            <div class="blade" ref="bladeRef">
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
const wrapperRef = ref()

</script>

<style lang="scss" scoped>
@use '@/styles/sass/easing.scss' as *;
.link__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;

    &:hover .blade {
        translate: 0;
        scale: 1;
        transition: translate 400ms 0ms $easeOutQuad, scale 200ms 400ms $easeInOutQuad;
    }
}

.blade {
    width: 100%;
    height: 100%;
    // transform: translateY(-100%) scale(0.9);
    translate: 0 100%;
    scale: 0.9;
    transition: translate 400ms 400ms $easeOutQuad, scale 200ms 0ms $easeInOutQuad;
    background-color: #141D4D;
}
</style>