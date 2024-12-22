export const useCursor = createState(() => {
    type State = "default" | "active"
    const state: Ref<State> = ref("default")

    return {
        state
    }
})