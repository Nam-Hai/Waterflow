import { onMounted } from "vue"
import { useFlowProvider } from "../FlowProvider"

// To trigger onMount only for the "real" page
export function onFlow(mountedCallback: () => void) {
  const flow = useFlowProvider()
  onMounted(() => {
    !flow.flowIsHijacked && mountedCallback()
  })
}

// To trigger onMount only for the "buffer" page
export function onBufferFlow(mountedBufferCallback: () => void){
  const flow = useFlowProvider()
  onMounted(() => {
    flow.flowIsHijacked && mountedBufferCallback()
  })
}