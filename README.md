<p align="center">
  <img src="./public/waterflow.png" alt="Waterflow" />
</p>

[![npm version](https://img.shields.io/npm/v/@nam-hai/water-flow/latest?color=green&label=%40nam-hai%2Fwater-flow&logo=npm)](https://www.npmjs.com/package/@nam-hai/water-flow)

# Introduction

Waterflow is a Nuxt3 library that enables seamless page transitions.

# QUICK START

```bash
$ npm i @nam-hai/water-flow
```

# Setup

Pass the WaterflowRouter a callback to reset scroll after the page transitions

```vue
// app.vue
<template>
  <NuxtLayout>
    <WaterflowRouter
      :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })"
    />
  </NuxtLayout>
</template>

<script lang="ts" setup>
provideFlowProvider({});
</script>
```

# Example

add `usePageFlow` to your page to enabled page-transtion :

```ts
usePageFlow({
  props: {
    main, // shallowRef<HTMLElement | null>,
  },
  flowOutMap: new Map([
    ["default", useDefaultFlowOut()],
    ["any => baz", useDefaultFlowOut("y", -1)],
    ["any => work-slug", useDefaultFlowOut("x")],
    ["work-slug => work-slug", useDefaultFlowOut("x")],
  ]),
  flowInMap: new Map([
    ["default", useDefaultFlowIn()],
    ["any => baz", useDefaultFlowIn("y", -1)],
    ["any => work-slug", useDefaultFlowIn("x")],
    ["work-slug => work-slug", useDefaultFlowIn("x")],
  ]),
});
```

[See more](./website/pages.transition/defaultFlow.ts)

# usePageFlow props

| Name       | Type                                                                       | Default   | Description                                                                                       |
| ---------- | -------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| props      | T                                                                          |           | Pass props for later use                                                                          |
| flowOutMap | Map<[FlowKey](#type-flowfunction), [FlowFunction](#type-flowfunction)\<T>> | undefined | Specify a Map of animations for the current page ([see more](#flowoutmap-and-flowincrossfademap)) |
| flowInMap  | Map<[FlowKey](#type-flowfunction), [FlowFunction](#type-flowfunction)\<T>> | undefined | Specify a Map of animations for the next page ([see more](#flowoutmap-and-flowincrossfademap))    |

# Type `FlowFunction` and `FlowKey`

```ts
type FlowKey = `default` | `${string} => ${string}`;

/**
 * call `resolve` when you are done
 */
type FlowFunction<T> = (props: T, resolve: () => void) => void;
```

# flowOutMap and flowInMap

Match a flowFunction to a string key following the patern : `routeNameFrom => routeNameTo`. `routeName` in the key can also take the value `any`. The key `default` also serve as a fallback if no match was found.

# onFlow and onLeave

`onFlow` is equivalent to onMounted, but is triggered after the page-transition ended. EffectScope are working in its callback (as far as I tested)
`onLeave` is equivalent to onBeforeUnmounted, but is triggered when the page-transition start

# useFlowProvider

Change `crossfadeMode` to place the buffer-page on top or under the current-page.
Use `const { currentRoute } = useFlowProvider()` instead of `useRoute()`.
