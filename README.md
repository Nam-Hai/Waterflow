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

```jsx
<template>
  <NuxtLayout>
    <WaterflowRouter :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })" />
  </NuxtLayout>
</template>
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

| Name            | Type                                                | Default   | Description                                                                                       |
| --------------- | --------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| props           | T                                                   |           | Pass props for later use                                                                          |
| enableCrossfade | 'TOP' or 'BOTTOM'                                   | "TOP"     | buffer-page is positioned on top or under the current-page // TODO                                |
| flowOutMap      | Map<string, [FlowFunction](#type-flowfunction)\<T>> | undefined | Specify a Map of animations for the current page ([see more](#flowoutmap-and-flowincrossfademap)) |
| flowOut         | [FlowFunction](#type-flowfunction)\<T>              | undefined | Specify a default animation for the current page                                                  |
| flowInMap       | Map<string, [FlowFunction](#type-flowfunction)\<T>> | undefined | Specify a Map of animations for the next page ([see more](#flowoutmap-and-flowincrossfademap))    |
| flowIn          | [FlowFunction](#type-flowfunction)\<T>              | undefined | Specify a default animation for the next page                                                     |

# Type `FlowFunction`

```ts
type FlowFunction<T> = (props: T, resolve: () => void) => void;
```

# flowOutMap and flowInMap

Bind a flowFunction to
`routeNameFrom => routeNameTo`

`index.flow.ts`

# onFlow

Equivalent to onMounted, but is triggered after the page-transition ended

# onLeave

Equivalent to onBeforeUnmounted, but is triggered when the page-transition start
