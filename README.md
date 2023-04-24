<p align="center">
  <img src="./public/waterflow.png" alt="Waterflow" />
</p>


[![npm version](https://img.shields.io/npm/v/@nam-hai/water-flow/latest?color=green&label=%40nam-hai%2Fwater-flow&logo=npm)](https://www.npmjs.com/package/@nam-hai/water-flow)

# Introduction

Waterflow is a Nuxt3 library that enables flawless page transitions (Vue3's router too).

# QUICK START
``` bash
$ npm i @nam-hai/water-flow
```

# Setup

`layout.vue` in Nuxt3 or pass `<router-view></router-view>` to the BufferPage component.
``` jsx
<template>
  <BufferPage>
    <slot />
  </BufferPage>
</template>

<script lang='ts'>
import { BufferPage } from '@nam-hai/water-flow';
</script>
```

`App.vue`
``` ts
import index from '@/pages/index.vue';
import about from '@/pages/about.vue';
import home from '@/pages/home.vue';
import { FlowProvider, provideFlowProvider } from '@nam-hai/water-flow'

// provide useFlowProvider through out your whole project
const flowProvider = new FlowProvider()
provideFlowProvider(flowProvider)

// register each page where you will use 
flowProvider.registerPage('/', index)
flowProvider.registerPage('/home', about)
flowProvider.registerPage('/about', about)
```

# Example
Now use `usePageFlow` for the page transitions :
``` ts
usePageFlow({
  props: {
    buttonRef,
    wrapperRef
  },
  // enable crossfade animations and set if the BufferPage is on top or under the current page
  enableCrossfade: 'TOP',
  flowOut: ({ }, resolve) => {
    // insert animation out for the current page
  },
  flowInCrossfade: ({ buttonRef }, resolve) => {
    // insert animation of the next page

    // use the animation engine you like
    const tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
    });

    tl
    .add({
        targets: wrapperRef.value,
        translateX: 250,
    })
    .add({
        targets: buttonRef.value,
        translateX: 250,
        complete: function(anim) {

            // make sure to call the resolve callback to trigger the route change once the animation is over
            resolve()
        }
    }, '+=600') 
  },
})
```

# usePageFlow props

| Name                   | Type                           | Default | Description                                                                                                                                              |
| ---------------------- | ------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| props                  | T                              |           | Pass props (Vue Refs) the way you want                                     |
| enableCrossfade        | boolean or 'TOP' or 'BOTTOM'   | false     | Enable crossfade animations and set if the BufferPage is on top or under the current page. True and 'BOTTOM' are the same |
| flowOutMap             | Map<string, [FlowFunction](#type-flowfunction)\<T>>   | undefined | Specify a Map of animations for the current page ([see more](#flowoutmap-and-flowincrossfademap))                      |
| flowOut                | [FlowFunction](#type-flowfunction)\<T>                | undefined | Specify a default animation for the current page                                 |
| flowInCrossfadeMap     | Map<string, [FlowFunction](#type-flowfunction)\<T>>   | undefined | Specify a Map of animations for the next page ([see more](#flowoutmap-and-flowincrossfademap))                         |
| flowOut                | [FlowFunction](#type-flowfunction)\<T>                | undefined | Specify a default animation for the next page                                    |
| disablePointerEvent    | boolean                        | true      | Disable pointer events for the duration of the animation. Still experimental, clicking on a link during the animation can break app |

# Type `FlowFunction`

``` ts
type FlowFunction<T> = (props: T, resolve: () => void, flowProps?: FlowProps) => void
```

Function of type `FlowFunction` have the responsibility to trigger the `resolve` callback and can be used to animate your pages. Those functions are called in `usePageFlow` when the route change, ie: `onBeforeRouteLeave(to, from, next)` and `resolve` leads to trigger the `next` callback. 
`props` are the Refs you want the access during the animations. They are the ones passed to `usePageFlow`.

`flowProps` are props not tied to one specific page. Can be useful for animations on layout elements or canvas.
```type FlowProps = Record<string, any>```

You can add flowProps anywhere in the app :
``` ts
const canvasRef = ref()
onMounted(()=>{
  canvasRef.value = new WebGLScene()
  const flowProvider = useFlowProvider()
  flowProvider.addProps('canvas', canvasRef)
})
```

# flowOutMap and flowInCrossfadeMap

You can setup multiple animations to leave one page to another. To do so, you need to pass "FlowMaps". They map from a key to a `FlowFunction` with the key following the naming convention : 
``` routeNameFrom => routeNameTo ```

`index.flow.ts`
``` ts
const transitionIndexOutAbout = ({wrapperRef, buttonRef}, resolve, {canvas}) => {
  // insert your animations
}
const transitionIndexOutHome = ({wrapperRef, buttonRef}, resolve, {canvas}) => {
  // insert your animations
}
const transitionIndexOutDefault = ({wrapperRef, buttonRef}, resolve, {canvas}) => {
  // insert your animations
}

const IndexFlowOutMap = new Map([
  ['index => about', transitionIndexOutAbout],
  ['index => home', transitionIndexOutHome]
  ['default', transitionIndexOutDefault]
])
```

# onFlow

You might want to sometimes to init things only for the real page, not the `<BufferPage />`, like animations after the crossfade animations, or heavy computation. Then use `onFlow` instead of `onMounted`. And `onBufferFlow` for things only the `<BufferPage />`.

# Connect your smooth scroll

Waterflow reset the scroll after each page transitions. But if you use a smooth scroll, like Lenis or Locomotive Scroll, this might create conflict. To prevent this, you can connect your smooth scroll to `FlowProvider`.

### Example for Lenis
``` ts
const flowProvider = useFlowProvider()

useRaf((e) => {
  !flowProvider.flowIsHijacked && lenis.raf(e.elapsed)
})

flowProvider.registerScrollInterface({
  resume: () => { lenis.start() },
  stop: () => { lenis.stop() },
  scrollToTop: () => { lenis.scrollTo('top', { immediate: true }) }
})
```

`flowIsHijacked` is true while the crossfade animations.