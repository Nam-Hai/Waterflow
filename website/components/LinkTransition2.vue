<template>
    <div class="link__wrapper" ref="wrapperRef">
        <div class="blade" ref="bladeRef">
        </div>
    </div>
</template>

<script lang="ts" setup>
const wrapperRef = ref()

</script>

<style lang="scss" scoped>
.link__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;

    &:hover .blade {
        translate: 0;
        scale: 1;
        transition: translate 500ms 0ms ease-out, scale 500ms 500ms ease;
    }
}

.blade {
    width: 100%;
    height: 100%;
    // transform: translateY(-100%) scale(0.9);
    translate: 0 -100%;
    scale: 0.9;
    transition: translate 500ms 500ms ease-out, scale 500ms 0ms ease;
    background-color: #141D4D;
}
</style>