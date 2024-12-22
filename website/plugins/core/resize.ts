import SassVars from '@/styles/sass/_breakpoints.module.scss'
import { N } from "../../utils/namhai"
import { FrameFactory, Timer } from './frame'


type BreakpointType = {
    name: string,
    width: number
}

type DeviceTypes = {
    designSize: {
        width: number,
        height: number
    },
    remScale: {
        min: number,
        max: number
    }
}

export type Breakpoints = "desktop" | "mobile"
type ResizeEvent = {
    vh: number,
    vw: number,
    scale: number,
    breakpoint: Breakpoints
}

export class ResizeManager {
    timer: Timer
    stack: {
        id: number,
        cb: (e: ResizeEvent) => void
    }[]
    vw!: number
    vh!: number
    scale!: number
    breakpoint!: "desktop" | "mobile"
    breakpoints: Record<string, BreakpointType> = {}
    deviceTypes: Record<string, DeviceTypes> = {}
    resizeId = 0
    mode: 'fit' | 'width' | 'height'

    constructor(Timer: FrameFactory["Timer"]) {
        N.Bind(this, ["resizePayload"])
        this.stack = []

        this.timer = Timer({ callback: this.resizePayload, throttle: 200 })

        this.mode = SassVars.scale_mode as 'fit' | 'width' | 'height'
        this.init()
        this.update()
        window.addEventListener('resize', () => this.timer.tick())
    }

    init() {
        SassVars.breakpoints.split(',').forEach((b: string) => {
            const point = b.trim()

            this.breakpoints[point] = {
                name: point,
                width: parseInt(SassVars[`breakpoint_${point}_width`]),
            }

            this.deviceTypes[point] = {
                designSize: {
                    width: parseInt(SassVars[`breakpoint_${point}_design_width`]),
                    height: parseInt(SassVars[`breakpoint_${point}_design_height`]),
                },
                remScale: {
                    min: parseFloat(SassVars[`breakpoint_${point}_scale_min`]),
                    max: parseFloat(SassVars[`breakpoint_${point}_scale_max`]),
                },
            }
        })
    }

    add(t: {
        id: number,
        cb: (e: ResizeEvent) => void
    }) {
        const arg = {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
        t.cb(arg)
        this.stack.push(t)
    }
    remove(id: number) {

        const { index, miss } = N.binarySearch(this.stack, id)

        if (miss) {
            console.warn("ResizeManager remove jammed : id not in stack")
            return
        }
        this.stack.splice(index, 1)
    }
    get callbackArg() {
        return {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
    }

    private resizePayload() {
        this.update()

        const arg = {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
        for (const el of this.stack) {
            el.cb(arg)
        }
    }

    private update() {
        this.updateSize()
        this.updateBreakpoint()
        this.updateScale()
    }

    private updateBreakpoint() {
        const bps = this.breakpoints
        let device: Breakpoints = 'mobile'

        for (const k of ['mobile', 'desktop'] as const) {
            if (this.vw >= bps[k].width) {
                device = k
            }
        }
        this.breakpoint = device
    }

    private updateSize() {
        this.vw = innerWidth
        this.vh = innerHeight

        document.documentElement.style.setProperty('--vh', `${this.vh * 0.01}px`)
        document.documentElement.style.setProperty('--100vh', `${this.vh}px`)
    }

    private updateScale() {
        const d = this.deviceTypes[this.breakpoint]
        const scaleX = this.vw / d.designSize.width
        const scaleY = this.vh / d.designSize.height

        // if (this.remlock) {
        //     this.scale = 1
        //     return
        // }

        // NOTE ACTUAL REMSCALE IS CALCULATED IN CSS
        // src/styles/config/variables.sass
        // src/styles/helpers/breakpoints.sass // =remscale()

        if (this.mode === 'fit') {
            this.scale = N.Clamp(Math.min(scaleX, scaleY), d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'width') {
            this.scale = N.Clamp(scaleX, d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'height') {
            this.scale = N.Clamp(scaleY, d.remScale.min, d.remScale.max)
        }
    }
}

export class ResizeFactory {
    private resizeManager: ResizeManager
    constructor(resizeManager: ResizeManager) {
        this.resizeManager = resizeManager
    }

    Resize(cb: (e: {
        vh: number,
        vw: number,
        scale: number,
        breakpoint: Breakpoints
    }) => void) {
        return new Resize(cb, this.resizeManager)
    }
}

export class Resize {
    cb: (e: ResizeEvent) => void
    id: number
    private resizeManager: ResizeManager
    constructor(cb: (e: {
        vh: number,
        vw: number,
        scale: number,
        breakpoint: Breakpoints
    }) => void, RM: ResizeManager) {
        this.resizeManager = RM
        this.cb = cb
        this.id = this.resizeManager.resizeId
        this.resizeManager.resizeId++
    }
    on() {
        this.resizeManager.add({
            id: this.id,
            cb: this.cb
        })
    }
    off() {
        this.resizeManager.remove(this.id)
    }

    trigger() {
        this.cb(this.resizeManager.callbackArg)
    }
}

export { Resize as ROR }
export type { ResizeEvent }
