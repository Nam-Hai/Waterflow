<script lang="ts" setup>
</script>

<template>
</template>

<style lang="scss" scoped>
.curose__wrapper {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background-color: #000;

    z-index: 29999;

    position: fixed;
    top: -0.5rem;
    left: -0.5rem;

    transition: background-color 450ms ease, border-radius 900ms, height 900ms, width 900ms;

    &.cursor-1 {
        background-color: red;
    }

    &.cursor-2 {
        border-radius: 0;
        height: 1.8rem;
        width: 1.8rem;
    }
}
</style>
