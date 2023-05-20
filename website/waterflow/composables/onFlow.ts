import { onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"

// To trigger onMount only for the "real" page
export function onFlow(mountedCallback: () => void) {
  const flow = useFlowProvider()
  let once = false
  watch(flow.flowIsHijacked, isHijacked => {
    !isHijacked && !once && (mountedCallback(), once = true)
  })
  onMounted(() => {
    if(!flow.flowIsHijacked.value && !once){
      mountedCallback()
      once = true
    }
  })
}
