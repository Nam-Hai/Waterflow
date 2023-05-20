<template>
  <div class="buffer-page__wrapper" ref="wrapper1Ref">
    <component :is="bufferPage" />
  </div>

  <div class="current-page" ref="wrapper2Ref">
    <component :is="currentPage" />
  </div>
</template>

<script setup lang='ts'>
import { shallowRef, watch, ref, Ref } from 'vue';
import { useFlowProvider } from '../FlowProvider';

const bufferPage = shallowRef()
const currentPage = shallowRef()
const bufferTopZ = shallowRef(false)
const provider = useFlowProvider()

const wrapper1Ref = ref() as Ref<HTMLElement>
const wrapper2Ref = ref() as Ref<HTMLElement>

const swapClass = () => {
  console.log('swapClass');
  wrapper1Ref.value.classList.toggle('buffer-page__wrapper')
  wrapper1Ref.value.classList.toggle('current-page')

  wrapper2Ref.value.classList.toggle('buffer-page__wrapper')
  wrapper2Ref.value.classList.toggle('current-page')
}

watch(bufferTopZ, state => {
  if (state == true) {

    wrapper1Ref.value.classList.add('buffer-page__TOP')
    wrapper2Ref.value.classList.add('buffer-page__TOP')
  } else {
    wrapper1Ref.value.classList.remove('buffer-page__TOP')
    wrapper2Ref.value.classList.remove('buffer-page__TOP')

  }

  console.log(state);
})

provider.connectBuffer(currentPage, bufferPage, bufferTopZ, swapClass)
</script>

<style scoped>
.buffer-page__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9;

}

.buffer-page__wrapper.buffer-page__TOP {
  z-index: 16;
}

.current-page {
  position: relative;
  z-index: 10;
}
</style>
