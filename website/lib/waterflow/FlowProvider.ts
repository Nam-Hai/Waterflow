import type { ShallowRef } from "vue";
import { createContext } from "./utils/apiInject"
import type { RouteLocationNormalized } from '#vue-router';



type CrossFadeMode = "TOP" | "BOTTOM"
export const [provideFlowProvider, useFlowProvider, flowKey] = createContext(() => {
  const route = useRoute()
  const currentRoute = shallowRef(route)
  const routeTo = shallowRef(route)
  const routeFrom = shallowRef(route)

  const crossfadeMode: ShallowRef<CrossFadeMode> = shallowRef("TOP")

  const flowIsHijackedPromise: ShallowRef<Promise<void> | undefined> = shallowRef(undefined)
  const flowIsHijacked = computed(() => {
    return !!flowIsHijackedPromise.value
  })
  let flowHijackResolver: (() => void) | undefined

  function releaseHijackFlow() {
    if (!flowHijackResolver) return
    flowHijackResolver()
    flowIsHijackedPromise.value = undefined
    flowHijackResolver = undefined
  }

  function hijackFlow() {
    flowIsHijackedPromise.value = new Promise<void>((resolve) => {
      flowHijackResolver = resolve;
    });

    return flowIsHijackedPromise.value
  }

  const flowInPromise: Ref<Promise<void> | undefined> = shallowRef()
  function startFlowIn(): undefined | (() => void) {
    let resolver: ((() => void) | undefined) = undefined

    flowInPromise.value = new Promise<void>((resolve) => {
      resolver = resolve;
    });
    return resolver
  }

  watch(currentRoute, (newVal, oldVal) => {
    routeTo.value = newVal
    routeFrom.value = oldVal
  })

  return {
    currentRoute: currentRoute,
    routeTo: shallowReadonly(routeTo),
    routeFrom: shallowReadonly(routeFrom),

    crossfadeMode,

    flowIsHijackedPromise: shallowReadonly(flowIsHijackedPromise),
    flowIsHijacked: shallowReadonly(flowIsHijacked),
    hijackFlow,
    releaseHijackFlow,

    flowInPromise: shallowReadonly(flowInPromise),
    startFlowIn,
  }
});
