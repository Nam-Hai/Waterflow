import { useLayout } from "../layouts/default.vue"
import { usePageFlow } from "../lib/waterflow/composables/usePageFlow"

const borderRadius = 3
export const useDefaultFlowIn = (axis: "x" | "y" = "y", dir: 1 | -1 = 1) => {
    const { vh, vw, scale } = useScreen()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm()
        const bounds = props.main.value.getBoundingClientRect()
        const scaleXFrom = (bounds.width - 30 * scale.value) / bounds.width
        props.main.value.style.transformOrigin = `center ${vh.value / 2}px`
        props.main.value.style.borderRadius = `${borderRadius}px`

        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, scaleXFrom],
                [axis]: [dir * (axis === "x" ? vw.value : vh.value), 0, "px"]
            },
            d: 750,
            e: "io2",
        })
        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, 1],
            },
            update(e) {
                if (!props.main.value) return
                props.main.value.style.borderRadius = `${N.Lerp(borderRadius, 0, e.easeProgress)}px`
            },
            d: 750,
            delay: 750,
            e: "io2",
        })
        tl.play().then(() => {
            resolve()
        })
    }
}

export const useDefaultFlowOut = (axis: "x" | "y" = "y", dir: 1 | -1 = 1) => {
    const { overlay } = useLayout()
    const { vh, vw, scale } = useScreen()
    const lenis = useLenis()
    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm()

        const scroll = lenis.animatedScroll
        const bounds = props.main.value.getBoundingClientRect()
        const padding = 100
        const scaleXTo = (bounds.width - padding * scale.value) / bounds.width
        props.main.value.style.transformOrigin = `center ${vh.value / 2}px`

        tl.from({
            el: overlay.value as HTMLElement,
            p: {
                o: [0, 0.8],
            },
            d: 1500,
        })
        tl.from({
            el: props.main.value,
            p: {
                scaleX: [1, scaleXTo],
                scaleY: [1, scaleXTo],
            },
            update(e) {
                if (!props.main.value) return
                props.main.value.style.borderRadius = `${N.Lerp(0, borderRadius, e.easeProgress)}px`
            },
            d: 500,
            e: "o2"
        })

        tl.play().then(() => {
            overlay.value && (overlay.value.style.opacity = "0")
            resolve()
        })
    }
}

export const useDefaultFlow = (main: Ref<HTMLElement | null>) => {
    usePageFlow({
        props: {
            main
        },
        flowOutMap: new Map([
            ["default", useDefaultFlowOut()],
            ["any => baz", useDefaultFlowOut("y", -1)],
            ["any => work-slug", useDefaultFlowOut("x")],
            ["work-slug => work-slug", useDefaultFlowOut("x")]
        ]),
        flowInMap: new Map([
            ["default", useDefaultFlowIn()],
            ["any => baz", useDefaultFlowIn("y", -1)],
            ["any => work-slug", useDefaultFlowIn("x")],
            ["work-slug => work-slug", useDefaultFlowIn("x", -1)]
        ])
    })
}