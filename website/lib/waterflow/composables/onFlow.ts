import { EffectScope, onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"
import type { RouteLocationNormalized } from 'vue-router';

export function onFlow(callback?: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  const flow = ref(false)

  let asyncScope: EffectScope | undefined
  flowIsHijackedPromise.value && flowIsHijackedPromise.value.then(() => {
    asyncScope = effectScope(true)
    asyncScope.run(() => {
      flow.value = true
      callback && callback(routeFrom.value, routeTo.value)
    })
  })

  onScopeDispose(() => {
    asyncScope && asyncScope.stop()
  })

  onMounted(() => {
    if (!!flowIsHijackedPromise.value) return
    flow.value = true
    callback && callback(routeFrom.value, routeTo.value)
  })

  return flow
}

/** experimental */
export function onLeave(callback: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  watch(flowIsHijackedPromise, flow => {
    if (!!flow) {
      callback(routeFrom.value, routeTo.value)
    }
  })
}