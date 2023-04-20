import { onMounted } from "vue"
import { useFlowProvider } from "../FlowProvider"

export function onFlow(mountedCallback: () => void, mountedBufferCallback = () => { }) {
  const flow = useFlowProvider()
  onMounted(() => {
    flow.flowIsHijacked ? mountedBufferCallback() : mountedCallback()
  })
}
