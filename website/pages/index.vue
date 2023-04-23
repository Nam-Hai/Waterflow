<template>
    <div id="home" class="page">
        <WaterflowTitle />

        <div class="grid-container">
            <div class="left">
                <h2><span class="mask-split-line">
                    <span ref="titleSpanRef">
                        <span ref="rotateRef">
                            Do you even <span class="font-museo">flow</span> ?
                        </span>
                    </span>
                </span></h2>
                <p v-opacity-flow="500">Give your project by the power of the nature. Go with the flow and create transitions that you always
                    dreamed of. Enable your creativity with Waterflow and make your website stand out. A Vue.js library
                    for page transitions crossfade.</p>
                <h3 v-opacity-flow="500">Fast. Light. Modular. For <span class="secondary">Vue.js</span>.</h3>

                <Clipboard />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { vOpacityFlow } from '@/directives/OpacityFlow'
import { onFlow } from '~/../src/composables/onFlow';

const { $TL } = useNuxtApp()
const titleSpanRef = ref()
const rotateRef = ref()

onFlow(()=>{
    let tl = new $TL()
    tl.from({
        el: titleSpanRef.value,
        d: 1500,
        p: {
            y: [100, 0],
            x: [-2,0],
            // rotateX: [70,0]
        },
        e: 'o3'
    }).from({
        el: rotateRef.value,
        d: 1000,
        p: {
            // y: [100, 0],
            // x: [-2,0],
            rotateX: [-90,0]
        },
        e: 'o3'
    }).play()
})

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

.page {
    height: 100vh;
    background-color: black;

    display: flex;
    flex-direction: column;
    align-items: center;

    perspective: 1000px;
}

.grid-container {
    padding: 2.4rem 10rem 4rem;
    display: flex;
    flex-direction: column;

    .left {
        display: flex;
        flex-direction: column;
        row-gap: 1.6rem;
        width: 50%;
    }
}

span {
    display: inline-block;
}

.mask-split-line {
    display: inline-block;
    height: 9rem;
    > span {
        perspective: 1000px;
    }
}
h2 {
    font-size: 8rem;
    font-weight: 700;
    line-height: 100%;
}

p {
    font-size: 2rem;
    font-weight: 400;
    line-height: 100%;
}

h3 {
    font-size: 4rem;
    font-weight: 700;
    line-height: 100%;
}
</style>