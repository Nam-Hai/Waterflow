<template>
    <div ref="containerRef" class="container" tabindex="0" @keydown="onKeydown">
        <div :class="{ active: showSuccess }" class="success__wrapper clipboard__wrapper">
        </div>
        <div class="clipboard__wrapper" @click="copy">
            <div ref="npmRef"><span style="color: #23ED67">></span> <span ref="textRef">npm i @nam-hai/water-flow</span>
            </div>

            <div :class="{ active: showSuccessBox }" class="clipboard-svg__container">
                <svg class="clip" :class="{ active: !showSuccess }" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="18px" height="18px"
                    viewBox="0 0 256 256">
                    <path fill="currentColor"
                        d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z">
                    </path>
                </svg>
                <svg class="success" :class="{ active: showSuccess }" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M416 128L192 384l-96-96" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { time } from 'console';
import { isGeneratorFunction } from 'util/types';
import { onFlow } from '~/../src/composables/onFlow';
import { Lerp, O } from '~/helpers/core/utils';
import { Rand, random } from '~/helpers/core/utils';
import { Timeline } from '~/plugins/core/motion';
import { Timer } from '~/plugins/core/raf';

const { $Timer, $TL } = useNuxtApp()

const ASCII = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', '-', 'A', 'S', 'D', 'F', 'G',
    'h', 'j', 'k', 'l', ';', "'", '|', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '1', '2', '@', '@', '@', '@', '/', '/', '_', '-', '?', '+']
const clipText = ' npm i @nam-hai/water-flow'
const seed = ref(Math.random())

const textRef = ref()
const containerRef = ref()

const showSuccess = ref(false)
const showSuccessBox = ref(false)


const timer = ref() as Ref<Timer>
const timerBox = ref() as Ref<Timer>
const timeline = ref() as Ref<Timeline>

onFlow(() => {
    timer.value = new $Timer(() => { showSuccess.value = false }, 400)
    timerBox.value = new $Timer(() => { showSuccessBox.value = false }, 800)

    const lenght = clipText.length

    timeline.value = new $TL()
    timeline.value.from({
        d: 800,
        update: ({ prog }) => {
            let text = ''
            let start = Math.floor(Lerp(0, lenght, prog))
            text = clipText.slice(0, start)

            for (let index = start; index < Math.floor(Lerp(lenght + (seed.value - 0.7) * 2 * 15, lenght, prog)); index++) {
                const letter = Rand.arr(ASCII)
                text += letter
            }

            textRef.value.innerText = text
        }
    })

    let text = ''

    for (let index = 0; index < lenght; index++) {
        const letter = Rand.arr(ASCII)
        text += letter
    }
    textRef.value.innerText = text
    const onFlowTL = new $TL()
    O(containerRef.value, 0)
    onFlowTL.from({
        d: 1000,
        el: containerRef.value,
        p: {
            o: [0, 1]
        },
        delay: 500
    }).from({
        d: 200,
        delay: 500,
        update: ({ prog }) => {
            let text = ''
            for (let index = 0; index < Math.floor( Math.floor(Math.random()* 2 - 1)+lenght + (seed.value - 0.7) * 2 * 15); index++) {
                const letter = Rand.arr(ASCII)
                text += letter
            }

            textRef.value.innerText = text
        },
        cb: () => {
            timeline.value.play()
        },
    }).play()
})

const onKeydown = (e: KeyboardEvent) => {
    if (e.key == 'Enter') copy()
}

const copy = () => {
    const type = "text/plain";
    containerRef.value.blur()
    const blob = new Blob(['>' + clipText], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
        () => {
            /* success */
            showSuccess.value = true
            showSuccessBox.value = true
            timer.value.tick()
            timerBox.value.tick()

            seed.value = Math.random()

            // timeline.value.pause()
            // timeline.value.play()
        },
        () => {
            /* failure */
        }
    );
}
</script>

<style scoped lang="scss">
@use '@/styles/app/index.scss' as *;

.container {
    position: relative;
}

.container .success__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    color: $secondary;
    border-color: $secondary;
    pointer-events: none;
    transition-property: opacity;
    transition-timing-function: ease-out;
    transition-duration: 1000ms;

    &.active {
        transition-duration: 100ms;
        opacity: 1;
    }
}

.container:focus-visible{
    outline: none;
}
.container:focus-visible .success__wrapper {
    transition-duration: 100ms;
    opacity: 1;
}

.clipboard__wrapper {
    width: 100%;
    border-color: #FFFFFF26;
    border-width: 1px;
    border-radius: 1.4rem;
    border-style: solid;

    // height: 100%;
    height: 7rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;

    font-size: 2.4rem;
    font-family: "Menlo", monospace;

    cursor: pointer;

    transition: opacity 300ms ease;
}


.container:hover .clipboard-svg__container {
    opacity: 1;
    transition: opacity 300ms ease-out, ease-out transform 100ms, border-color 100ms ease-out;
    transform: scale(1);

    &.active {
        border-color: #87F06245;
    }
}

.clipboard-svg__container.active {
    opacity: 1;
    transform: scale(1);
    // border-color: #ffffff15;
    border-color: #87F06245;
    transition: opacity 200ms, transform 200ms, border-color 0ms ease-out;
}

.clipboard-svg__container:hover {
    border-color: #ffffff15;
}

.clipboard-svg__container {
    transform: scale(0.5);
    opacity: 0;
    // transition: ease-out opacity 300ms;
    transition: opacity 200ms, transform 200ms, border-color 1000ms ease-out;
    // transition-timing-function: ease-out;

    position: relative;
    height: 100%;
    width: 4.5rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    background-color: #ffffff15;
    border-radius: 0.5rem;
    border-color: #ffffff00;
    border-style: solid;
    border-width: 1px;
}

svg {
    transition-property: opacity;
    // height: 3rem;
    width: 3.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;

    &.active {
        opacity: 1;
    }

    &.clip {
        transition: opacity ease-out 100ms;

        &.active {
            transition-delay: 700ms;
        }
    }

    &.success {
        transition: opacity ease-out 1000ms;
        color: $secondary;

        &.active {
            transition: opacity ease-out 100ms;
            opacity: 1;
        }
    }
}
</style>