import { onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"
import type { RouteLocationNormalized } from 'vue-router';

export function onFlow(callback?: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  const flow = ref(false)

  flowIsHijackedPromise.value && flowIsHijackedPromise.value.then(() => {
    flow.value = true
    callback && callback(routeFrom.value, routeTo.value)
  })
  onMounted(() => {
    if (!!flowIsHijackedPromise.value) return
    flow.value = true
    callback && callback(routeFrom.value, routeTo.value)
  })

  return flow
}

export function onLeave(callback: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  watch(flowIsHijackedPromise, flow => {
    if (!!flow) {
      callback(routeFrom.value, routeTo.value)
    }
  })
}