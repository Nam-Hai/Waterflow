import { BM, Clamp } from "~/helpers/core/utils"
import { Timer, RafR } from "./raf"
// @ts-ignore
import SassVars from '@/styles/sass/variables.module.scss'


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

type ResizeEvent = {
    vh: number,
    vw: number,
    scale: number,
    breakpoint: string
}

const Ro = new class {
    tick: boolean
    raf: RafR
    timer: Timer
    arr: {
        id: number,
        cb: (e: ResizeEvent) => void
    }[]

    breakpoints: Record<string, BreakpointType>
    deviceTypes: Record<string, DeviceTypes> = {}
    scale!: number
    vh!: number
    vw!: number
    private breakpoint!: string
    mode: 'fit' | 'width' | 'height'

    constructor() {
        this.tick = false
        this.arr = []

        BM(this, ['fn', 'gRaf', 'run'])
        this.timer = new Timer(this.gRaf, 100)
        this.raf = new RafR(this.run)
        window.addEventListener('resize', this.fn)

        this.breakpoints = {}
        this.deviceTypes = {}   // Get breakpoints and device types from Sass
        this.mode = SassVars.scale_mode
        console.log(this.mode)
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

        this.update()
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
        this.arr.push(t)
    }
    remove(id: number) {
        for (let t = this.l(); 0 <= t; t--) {
            if (this.arr[t].id === id) return void this.arr.splice(t, 1)
        }
    }

    fn() {
        this.timer.tick()
    }
    gRaf() {
        this.update()
        this.tick || (this.tick = true, this.raf.run())
    }
    run() {
        const arg = {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
        for (let t = this.l(); 0 <= t; t--) this.arr[t].cb(arg);
        this.raf.stop()
        this.tick = false
    }
    l() {
        return this.arr.length - 1
    }

    get callbackArg() {
        return {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
    }
    private update() {
        this.updateSize()
        this.updateBreakpoint()
        this.updateScale()
    }
    private updateBreakpoint() {
        const bps = this.breakpoints

        let device = 'mobile'

        for (const k of ['mobile', 'desktop']) {
            if (this.vw >= bps[k].width) {
                device = k
            }
        }
        this.breakpoint = device
    }
    private updateSize() {
        this.vw = innerWidth
        this.vh = innerHeight
    }

    private updateScale() {

        const d = this.deviceTypes[this.breakpoint]
        const scaleX = this.vw / d.designSize.width
        const scaleY = this.vh / d.designSize.height

        // if (this.remlock) {
        // this.scale = 1
        // return
        // }

        // NOTE ACTUAL REMSCALE IS CALCULATED IN CSS
        // src/styles/config/variables.sass
        // src/styles/helpers/breakpoints.sass // =remscale()

        if (this.mode === 'fit') {
        this.scale = Clamp(Math.min(scaleX, scaleY), d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'width') {
        this.scale = Clamp(scaleX, d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'height') {
        this.scale = Clamp(scaleY, d.remScale.min, d.remScale.max)
        }
    }
}


let RoId = 0;
class ROR {
    cb: (e: ResizeEvent) => void
    id: number
    constructor(cb: (e: {
        vh: number,
        vw: number,
        scale: number,
        breakpoint: string
    }) => void) {
        this.cb = cb
        this.id = RoId
        RoId++
    }
    on() {
        Ro.add({
            id: this.id,
            cb: this.cb
        })
    }
    off() {
        Ro.remove(this.id)
    }

    trigger() {
        this.cb(Ro.callbackArg)
    }
}

export { ROR }
