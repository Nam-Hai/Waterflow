<template>
    <div class="table">
        <div ref="link1Ref" class="table__cell">
            <LinkTransition1 />
        </div>
        <div ref="link2Ref" class="table__cell">
            <LinkTransition2 />
        </div>
        <div ref="link3Ref" class="table__cell">
            <LinkTransition3 />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onFlow } from '~/../src/composables/onFlow';

const link1Ref = ref()
const link2Ref = ref()
const link3Ref = ref()

const { $TL } = useNuxtApp()
const durationStep = 500
onFlow(()=>{
    let tl = new $TL
    tl.from({
        el: link1Ref.value,
        p: {
            scaleX: [0,1]
        },
        d: durationStep,
        e: 'io2'
    })
    .from({
        el: link2Ref.value,
        p: {
            scaleX: [0,1]
        },
        d: durationStep,
        delay: durationStep,
        e: 'io2'
    })
    .from({
        el: link3Ref.value,
        p: {
            scaleX: [0,1]
        },
        d: durationStep,
        delay: durationStep * 2,
        e: 'io2'
    })

    tl.play()

})
</script>

<style scoped lang="scss">
.table {
    width: 100%;
    height: 24rem;
    display: flex;
    margin-top: auto;

    .table__cell {
        overflow: hidden;
        flex-grow: 1;
        border-top: 1px solid #FFFFFF15;
        border-bottom: 1px solid #FFFFFF15;
        border-right: 1px solid #FFFFFF15;
        background-color: #ffffff20;

        transform: scaleX(0);
        transform-origin: left;
        &:first-child {
            border-left: 1px solid #FFFFFF15;
            border-top-left-radius: 1.4rem;
            border-bottom-left-radius: 1.4rem;
        }

        &:last-child {
            border-top-right-radius: 1.4rem;
            border-bottom-right-radius: 1.4rem;
        }
    }

}
</style>
