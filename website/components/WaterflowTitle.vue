<template>
    <div class="title-container">
        <h1 v-if="display">WATERFLOW</h1>
        <div v-if="display" ref="borderRef" class="border"></div>
    </div>
</template>

<script setup lang="ts">
import { onFlow } from '~/../src/composables/onFlow';

const { $TL } = useNuxtApp()

const props = withDefaults(defineProps<{
  display?: boolean
}>(), { display: true})

const borderRef = ref()

onFlow(()=>{
    if(!props.display) return
    let tl = new $TL
    console.log(borderRef.value);
    tl.from({
        el: borderRef.value,
        p: {
            scaleX: [0, 1],
            o: [0,1],
        },
        d: 1500,
        e: 'o3'
    }).play()
})
</script>

<style lang="scss">
@use '@/styles/app/colors.scss' as *;

.title-container {
    height: 28rem;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .border {
        // width: 151.4rem;
        width: calc(100% - 21rem);
        height: 2px;
        background-color: $primary;
        position: absolute;
        bottom: 0;
    }
}

h1 {
    text-align: center;
    font-family: Amarante;
    font-size: 30rem;
}
</style>