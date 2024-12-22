import { useFlowProvider as flow } from "~/lib/waterflow/FlowProvider"
export const useFlowProvider = flow

export const flowCreateError = (args: {
    statusCode: number;
    statusMessage: string;
}) => {
    // navigateTo("error", {
    //     query: args,
    //     replace: false
    // })
    navigateTo({
        name: "error",
        query: args,
        replace: true
    })
    throw createError(args)
}

export const useQuery = () => {
    const route = useFlowProvider().currentRoute.value
    return {
        query: route.query,
        params: route.params
    }
}

export const flowRoute = () => {
    return useFlowProvider().currentRoute
}