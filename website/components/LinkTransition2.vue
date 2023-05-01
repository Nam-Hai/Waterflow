<template>
    <div class="link__wrapper" ref="wrapperRef" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="blade" ref="bladeRef">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { N } from '~/helpers/namhai-utils'


const { $TL } = useNuxtApp()
const wrapperRef = ref()
const bladeRef = ref()
let onLeave = false
let onEnter = false

// const onMouseLeave = () => {
//     let tl = new $TL()
//     onLeave = true

//     if (onEnter) return

//     tl.from({
//         el: bladeRef.value,
//         p: {
//             y: [0, 100],
//             s: [0.9, 0.9],
//         },
//         d: 500,
//         delay: 500,
//         e: 'o3',
//         cb: () => {
//             onLeave = false
//             onEnter && onMouseEnter()
//         }
//     }).from({
//         el: bladeRef.value,
//         p: {
//             s: [1, 0.9]
//         },
//         d: 500,
//         delay: 0,
//         e: 'o3'
//     })
//     tl.play()
// }

// const onMouseEnter = () => {
//     onEnter = true
//     if (onLeave) return
//     let tl = new $TL()
//     tl.from({
//         el: bladeRef.value,
//         p: {
//             y: [-100, 0],
//             s: [0.9, 0.9],
//         },
//         d: 500,
//         e: 'o3'
//     }).from({
//         el: bladeRef.value,
//         p: {
//             s: [0.9, 1]
//         },
//         d: 500,
//         delay: 500,
//         e: 'o3',
//         cb: () => {
//             onEnter = false
//             onLeave && onMouseLeave()
//         }
//     })
//     tl.play()
// }

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
    background-color: #141D4D60;
}
</style>