import CustomRouter from "./website/lib/waterflow/CustomRouter.vue"
import { usePageFlow } from "./website/lib/waterflow/composables/usePageFlow"
import { provideFlowProvider, useFlowProvider } from "./website/lib/waterflow/FlowProvider"
import type { FlowFunction } from "./website/lib/waterflow/composables/usePageFlow"
import { onFlow, onLeave } from "./website/lib/waterflow/composables/onFlow"

const WaterflowRouter = CustomRouter
export {
    WaterflowRouter,
    useFlowProvider,
    provideFlowProvider,
    usePageFlow,
    FlowFunction,
    onFlow,
    onLeave
}
