import type { ShallowRef } from "vue";
import type { RouteLocationNormalized } from '#vue-router';


type CrossFadeMode = "TOP" | "BOTTOM"
export const [provideFlowProvider, useFlowProvider, flowKey] = createContext((options: { route: RouteLocationNormalized }) => {
  const currentRoute = shallowRef(options.route)
  const routeTo = shallowRef(options.route)
  const routeFrom = shallowRef(options.route)

  const crossfadeMode: ShallowRef<CrossFadeMode> = shallowRef("TOP")



  const flowIsHijackedPromise: Ref<Promise<void> | undefined> = shallowRef(undefined)
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

  return {
    currentRoute,
    routeTo,
    routeFrom,
    crossfadeMode,

    flowIsHijackedPromise,
    flowIsHijacked,
    hijackFlow,
    releaseHijackFlow,

    flowInPromise,
    startFlowIn,
  }
});
