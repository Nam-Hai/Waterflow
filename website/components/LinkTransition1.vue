<template>
    <!-- <NuxtLink to="/example1"> -->
        <div class="link__wrapper" ref="wrapperRef" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <div v-for="i in 10" class="blade"></div>
        </div>
    <!-- </NuxtLink> -->
</template>

<script lang="ts" setup>
import { N } from '~/helpers/namhai-utils'


const { $TL } = useNuxtApp()
const wrapperRef = ref()

const onMouseLeave = () => {
    let tl = new $TL()
    let i = 0;
    for (const blade of bladesRef.value) {
        tl.from({
            el: blade as HTMLElement,
            d: 200,
            delay: 50 * i,
            p: {
                scaleX: [1, 0]
            }
        })
        i++
    }

    tl.play()
}

const onMouseEnter = () => {
    let tl = new $TL()
    let i = 0;
    for (const blade of bladesRef.value) {
        tl.from({
            el: blade as HTMLElement,
            d: 200,
            delay: 50 * i,
            p: {
                scaleX: [0, 1]
            }
        })
        i++
    }

    tl.play()

}

const bladesRef = ref()
onMounted(() => {
    bladesRef.value = N.getAll('.blade', wrapperRef.value)
})
</script>

<style lang="scss" scoped>
.link__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;
}

.blade {
    width: 10%;
    height: 100%;
    background: #e03737;
    transform: scaleX(0);
}
</style>