<template>
    <NuxtLink to="https://github.com/Nam-Hai/Waterflow" target="_blank">
        <div class="wrapper-github" ref="wrapperRef" @mouseenter="mouseEnter" @mouseleave="mouseLeave">

            <div class="arrows__wrapper">
                <div v-for="i in 8" class="arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                        :style="`transform: rotate(${Lerp(0, 180, i / 9)}deg)`">
                        <path fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                            stroke-width="48" d="M268 112l144 144-144 144M392 256H100" />
                    </svg>
                </div>
                &nbsp;
            </div>

            <div class="github-text">
                github <span class="value"><span ref="valueRef">00</span>%
                </span>
            </div>

            <div class="arrows__wrapper">
                <div v-for="i in 8" class="arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                        :style="`transform: rotate(${Lerp(0, -180, i / 9)}deg)`">
                        <path fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                            stroke-width="48" d="M268 112l144 144-144 144M392 256H100" />
                    </svg>
                </div>
            </div>

            <div ref="bgRef" class="background"></div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import { onFlow } from '~/waterflow';
import { Lerp, iLerp } from '~/helpers/core/utils';
import { N } from '~/helpers/namhai-utils';
import { Motion } from '~/plugins/core/motion'

const { $Motion } = useNuxtApp()
const bgRef = ref()
const valueRef = ref()
const wrapperRef = ref()

let prog = 0
let motion: Motion
onFlow(() => {
    motion = new $Motion({

    })
})

function mouseEnter() {
    motion.pause()
    const initProg = prog
    motion = new $Motion({
        d: 1000,
        update: ({ progE }) => {
            // const p = iLerp(initProg + progE, initProg, initProg + 1)
            const p = Lerp(initProg, 1, progE)
            prog = p
            bgRef.value.style.transform = `scaleX(${p})`
            valueRef.value.innerText = N.ZL(N.Round(p * 100, 0))
        },
        e: 'io6'
    })

    motion.play()
    wrapperRef.value.classList.add('active')
}
function mouseLeave() {
    motion.pause()
    const initProg = prog
    motion = new $Motion({
        d: 1000,
        update: ({ progE }) => {
            const p = Lerp(initProg, 0, progE)
            prog = p
            bgRef.value.style.transform = `scaleX(${p})`
            valueRef.value.innerText = N.ZL(N.Round(p * 100, 0))
        },
        e: 'o2'
    })
    motion.play()
    wrapperRef.value.classList.remove('active')
}

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.wrapper-github {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10rem;
    overflow: hidden;

    @include breakpoint(mobile) {
        font-size: 4rem;
    }

    .arrows__wrapper {
        position: relative;
        opacity: 0;
        transition: opacity 500ms;
        display: flex;
        z-index: 1;
    }

    &.active .arrows__wrapper {
        opacity: 1;
    }

    .arrow {
        height: 10rem;
        width: 10rem;
        right: 0;

        @include breakpoint(mobile) {
            width: 8rem;
            height: 8rem;
        }
    }

    .github-text {
        position: relative;

        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 5rem;
        z-index: 1;

        top: -1rem;

        @include breakpoint(mobile) {
            padding: 0 2rem;
            top: -0.5rem;
        }
    }

    .background {
        position: absolute;
        height: 100%;
        width: 100%;
        // background-color: rgba(113, 228, 243, 0.664);
        background-color: $secondary;
        z-index: 0;
        transform: scaleY(0);
        transform-origin: left;
    }
}
</style>