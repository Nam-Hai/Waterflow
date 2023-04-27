<template>
  <div class="hero-wrapper">
    <img class="hero" src="images/dummy.jpg">
  </div>
</template>

<script lang="ts" setup>
import { onFlow } from "../../index"

onFlow(()=>{
})

</script>

<style lang="scss">

.hero-wrapper {
    flex: 1;
    position: relative;

    img {
        border-radius: 4rem;
        object-fit: cover;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }
}

</style>
