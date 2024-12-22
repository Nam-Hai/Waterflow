import type { Breakpoints } from "~/plugins/core/resize"

export const [provideScreen, useScreen] = createContext(() => {
    const vh = ref(0)
    const vw = ref(0)
    const dpr = ref(1)
    const scale = ref(1)
    const breakpoint: Ref<Breakpoints | ""> = ref("")

    onMounted(() => {
        useResize((e) => {
            vh.value = e.vh
            vw.value = e.vw
            dpr.value = window.devicePixelRatio
            scale.value = e.scale
            breakpoint.value = e.breakpoint
        })
    })

    return {
        vh: shallowReadonly(vh),
        vw: shallowReadonly(vw),
        dpr: shallowReadonly(dpr),
        breakpoint: shallowReadonly(breakpoint),
        scale: shallowReadonly(scale)
    }
})