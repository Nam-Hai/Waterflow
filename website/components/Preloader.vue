<template>
  <div ref="wrapperRef" class="wrapper__preloader" v-if="!hidePreloader">
    <div class="title-placeholder" ref="titlePlaceholderRef">
      <h1><span ref="titleSpanRef" style="opacity: 0;">WATER</span><span
          style="display: inline-flex; overflow: hidden;"><span ref="flowSpanRef"
            style="transform: translateX(-100%); opacity: 0;">FLOW</span></span></h1>
      <div ref="borderRef" class="border"></div>
    </div>
    <div class="title">
      <div ref="titleRef" style="transform-origin: center;">
        WATER
      </div>
    </div>
  </div>
  <slot v-if="showPage && preloadComplete" />
</template>

<script lang="ts" setup>
const showPage = ref(false)
const showPreloader = ref(true)
const hidePreloader = ref(false)
const preloadComplete = ref(false)
const index = ref(0)

const { $TL, $canvas, $manifest } = useNuxtApp()

const titleRef = ref()
const titleSpanRef = ref()
const titlePlaceholderRef = ref()
const borderRef = ref()
const flowSpanRef = ref()

const wrapperRef = ref()

const fromPreloader = inject('from-preloader') as Ref<boolean>

watch(() => showPreloader.value || !preloadComplete.value, bool => {
  setTimeout(() => {
    hidePreloader.value = true
    fromPreloader.value = false
    document.body.style.backgroundColor = ''
    $canvas.currentCanvasPage?.init()
  }, 300)
})

const mapRouteBg = new Map([
  ['index', ['#000000', '#ffffff']],
  ['example1', ['#E03636', '#87F062']],
  ['example2', ['#141D4D', '#A48A9B']],
  ['example3', ['#FFF27A', '#46afff']]
])

onMounted(() => {

  const route = useRoute()
  const bg = mapRouteBg.get(route.name?.toString() || 'index')
  wrapperRef.value.style.backgroundColor = bg![0]
  document.body.style.backgroundColor = bg![0]
  wrapperRef.value.style.color = bg![1]


  $manifest.callback = (i) => {
    index.value = i
    if (i == $manifest.length) {
      preloadComplete.value = true
    }
  }
  $manifest.loadManifest()

  const tl = new $TL()

  const nextBounds = titleSpanRef.value.getBoundingClientRect()
  const initBounds = titleRef.value.getBoundingClientRect()
  const titlePlaceholderHeight = titlePlaceholderRef.value.clientHeight
  tl.from({
    el: titleRef.value,
    d: 1000,
    e: 'io4',
    p: {
      y: [0, - innerHeight / 2 + titlePlaceholderHeight / 2, 'px'],
      x: [0, -innerWidth / 2 + nextBounds.x + nextBounds.width / 2, 'px'],
      s: [1, nextBounds.height / initBounds.height]
    },
  }).from({
    d: 1000,
    delay: 500,
    e: 'o4',
    p: {
      x: [-100, 0]
    },
    el: flowSpanRef.value,
    cb: () => {
      showPage.value = true
      showPreloader.value = false
    }
  }).from({
    el: flowSpanRef.value,
    d: 0,
    delay: 500,
    p: {
      o: [0, 1],
    }
  }).from({
    el: borderRef.value,
    p: {
      scale: [0, 1]
    },
    delay: 500,
    d: 1000,
    e: 'o4'
  })
  tl.play()
})



</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;
@use '@/styles/app/colors.scss' as *;
@use "@/styles/app/variables.scss" as *;
@use "@/styles/shared.scss" as *;

.wrapper__preloader {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}


.wrapper__preloader {
  color: currentColor;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  font-family: "Amarante";

  @include breakpoint(mobile) {
    margin-top: 1.6rem;
  }
}

.title {
  transform: translate(-50%, -50%);
  position: absolute;

  left: 50%;
  top: 50%;

  font-size: 55rem;
  text-align: center;
}



.title-placeholder {
  height: $title-height;
  width: 120vw;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include breakpoint(mobile) {
    height: $title-height-mobile;
  }

  .border {
    width: 151.4rem;

    @include breakpoint(mobile) {
      width: 32rem;
    }

    // width: calc(100% - 21rem);
    height: 2px;
    background-color: currentColor;
    position: absolute;
    bottom: 0;
  }
}

h1 {
  text-align: center;
  font-family: Amarante;
  font-size: 30rem;
  font-weight: 400;

  // opacity: 0;

  @include breakpoint(mobile) {
    font-size: $title-height-mobile
  }
}

.border {
  width: 151.4rem;
  transform-origin: left;
  transform: scale(0);

  @include breakpoint(mobile) {
    width: 32rem;
  }

  // width: calc(100% - 21rem);
  height: 2px;
  background-color: currentColor;
  position: absolute;
  bottom: 0;
}
</style>
