
import { EaseEnum, type Ease4Arg, type EaseFunctionName, Ease, Ease4 } from "~/plugins/core/eases";
import { Frame, FramePriority, type FrameEvent, Delay, FrameFactory } from "./frame";

const STYLE_MAP = [
    "o",
    "x",
    "y",
    "s",
    "scaleX",
    "scaleY",
    "r"
] as const;
type StyleMapKey = typeof STYLE_MAP[number];

const styleMapObject: Record<StyleMapKey, number> = STYLE_MAP.reduce((acc, key, index) => {
    acc[key] = index;
    return acc;
}, {} as Record<StyleMapKey, number>);

type MotionEvent = { progress: number, easeProgress: number }
interface StopMotionOptionPrimitive {
    e?: EaseFunctionName | Ease4Arg
    d?: number,
    delay?: number,
    cb?: () => void,
    reverse?: boolean
    update?: (e: MotionEvent) => void,
}
interface StopMotionOptionPrimitiveI extends StopMotionOptionPrimitive {
    svg?: never,
    el?: never,
    p?: never
}

type FromTo = [number, number]
type DOMPropName = StyleMapKey
interface StopMotionOptionBasicDOMAnimation extends StopMotionOptionPrimitive {
    el: HTMLElement | HTMLElement[],
    p: {
        x?: [number, number, string] | [number, number]
        y?: [number, number, string] | [number, number]
        o?: FromTo
        s?: FromTo
        scaleX?: FromTo
        scaleY?: FromTo
        r?: FromTo | [number, number, string]
    },
    override?: boolean,
    svg?: never,
}
interface StopMotionUpdatePropsOption extends StopMotionOptionPrimitive {
    p?: {
        [K in DOMPropName]?: {
            start?: number,
            end?: number
        }
    },
    override?: boolean
}

interface StopMotionOptionSvg extends StopMotionOptionPrimitive {
    el: NodeList | HTMLElement,
    svg: {
        end: string,
        start?: string,
        type?: string
    },
    p?: never,
}

export type StopMotionOption = StopMotionOptionSvg | StopMotionOptionBasicDOMAnimation | StopMotionOptionPrimitiveI

let MotionId = 0
type MotionItem = {
    ticker: Ticker
    startTime?: number
}
export class MotionManager {

    motions: MotionItem[]
    frame: Frame;
    frameFactory: FrameFactory;
    motionWeakMapAnimation: WeakMap<Element, number>
    constructor(frameFactory: FrameFactory) {

        this.frameFactory = frameFactory;

        N.Bind(this, ["raf"])
        this.motions = []

        this.frame = this.frameFactory.Frame({ callback: this.raf, priority: FramePriority.MOTION })
        this.frame.run()

        this.motionWeakMapAnimation = new WeakMap()
    }

    add(ticker: Ticker) {
        this.motions.push({ ticker })
    }

    remove(id: number, canMiss: boolean = false) {
        const { index, miss } = N.binarySearch(this.motions.map(el => { return { id: el.ticker.id } }), id)

        if (!canMiss && miss) {
            console.warn("Motion remove jammed : id not in stack")
            return
        }

        this.motions.splice(index, 1)
    }

    raf(e: FrameEvent) {
        for (let i = this.motions.length - 1; i >= 0; i--) {
            const item = this.motions[i]
            const ticker = item.ticker

            if (!item.startTime) item.startTime = item.startTime || e.elapsed
            const t = N.Clamp(e.elapsed - item.startTime, 0, ticker.d)
            if (ticker.d == 0) {
                ticker.prog = 1
                ticker.progE = 1
            } else {
                ticker.prog = N.Clamp(t / ticker.d, 0, 1)
            }
            ticker.progE = ticker.calc!(ticker.prog)
            ticker.update({ progress: ticker.prog, easeProgress: ticker.progE })

            if (ticker.prog === 1) {
                ticker.stop()
                ticker.cb && ticker.cb()
            }
        }
    }
}

export class MotionFactory {
    motionManager: MotionManager;
    constructor(motionManager: MotionManager) {
        this.motionManager = motionManager
        N.Bind(this, ["Motion", "Film"])
    }

    Motion(options: StopMotionOption) {
        return new Motion(options, this.motionManager)
    }
    Film() {
        return new Film(this.motionManager)
    }
}

export class Motion {
    ticker: Ticker;
    delay!: Delay;
    promise: Promise<void>;
    promiseRelease!: (value: void | PromiseLike<void>) => void;
    id?: number;
    motionManager: MotionManager;

    constructor(option: StopMotionOption, motionManager: MotionManager) {
        this.promise = new Promise<void>(res => {
            this.promiseRelease = res
        })
        const callback = option.cb
        const cb = () => {
            callback?.()
            this.promiseRelease()
        }
        Object.assign(option, { cb })
        this.motionManager = motionManager
        this.ticker = TickerFactory.createTicker(option, this.motionManager)

    }

    pause() {
        this.ticker.stop()
        this.delay && this.delay.stop()

        return this
    }
    play(prop?: StopMotionUpdatePropsOption) {
        this.pause()
        this.ticker.wait()
        this.ticker.updateProps(prop)

        const delay = this.ticker.delay || 0

        this.delay = this.motionManager.frameFactory.Delay({
            delay,
            callback: () => {
                this.ticker.run()
            }
        })

        this.delay.run()

        this.promise = new Promise<void>(res => {
            this.promiseRelease = res
        })

        return this.promise
    }
}

class TickerFactory {
    static createTicker(props: StopMotionOption, motionManager: MotionManager) {
        let ticker: Ticker
        if (props.svg && false) {
            props.svg
            // TODO
        } else if (props.p) {
            const elements = (props.el instanceof window.NodeList || Array.isArray(props.el)) ? props.el : [props.el];
            ticker = new TickerDOMAnimation({ ...props, el: elements }, motionManager)
        } else {
            ticker = new Ticker(props, motionManager)
        }

        return ticker
    }
}

interface TickerI {
    update: (e: MotionEvent) => void
    updateProps: (props?: StopMotionUpdatePropsOption) => void
}

enum TickerOn {
    stop = 0,
    waiting = 1,
    play = 2
}
class Ticker implements TickerI {
    reverse: boolean;
    cb: (() => void) | undefined;
    ease: EaseFunctionName | Ease4Arg;
    delay: number;
    d: number;
    calc: (t: number) => number;
    prog: number = 0
    progE: number = 0
    updateFunc?: (e: MotionEvent) => void;
    id: number
    motionManager: MotionManager;
    on: TickerOn;
    constructor(props: StopMotionOptionPrimitive, motionManager: MotionManager) {
        this.motionManager = motionManager
        this.d = props.d || 0
        this.delay = props.delay || 0
        this.cb = props.cb
        this.reverse = props.reverse || false
        this.ease = props.e || EaseEnum.linear
        this.calc = typeof this.ease === "string" ? Ease[this.ease] : Ease4(this.ease)
        this.updateFunc = props.update
        this.on = TickerOn.stop

        MotionId++
        this.id = MotionId

        if (this.reverse === true) {
            const ease = this.calc
            this.calc = (t: number) => ease(1 - t)
        }
    }
    run() {
        if (this.on !== TickerOn.play) this.motionManager.add(this)
        this.on = TickerOn.play
    }
    stop() {
        if (this.on === TickerOn.play) {
            this.motionManager.remove(this.id)
        }
        this.on = TickerOn.stop
    }
    wait() {
        this.on = TickerOn.waiting
    }

    update(e: MotionEvent) {
        if (this.updateFunc !== undefined) {
            this.updateFunc(e)
        }
    }

    updateProps(props?: StopMotionUpdatePropsOption) {
        if (!props) return
        MotionId++
        this.id = MotionId
        this.d = props.d || this.d
        this.delay = props.delay || this.delay
        this.ease = props.e || this.ease
        this.cb = props.cb || this.cb
        this.reverse = props.reverse || this.reverse
        this.updateFunc = props.update

        this.calc = typeof this.ease === "string" ? Ease[this.ease] : Ease4(this.ease)

        if (this.reverse === true) {
            const ease = this.calc
            this.calc = (t: number) => ease(1 - t)
        }
    }
}

type DOMProp = {
    curr: number,
    start: number,
    end: number,
    unit: string
}

class TickerDOMAnimation extends Ticker implements TickerI {
    override: boolean | undefined;
    el: [HTMLElement, DOMProp[]][];
    propToIndex: Record<StyleMapKey, number>
    constructor(props: StopMotionOptionBasicDOMAnimation, motionManager: MotionManager) {
        super(props, motionManager)

        const el = ((props.el instanceof window.NodeList || Array.isArray(props.el)) ? props.el : [props.el]) as HTMLElement[];

        this.override = props.override || false


        this.propToIndex = Object.entries(props.p).reduce((acc, [key, prop], index) => {
            acc[key as keyof typeof props.p] = index;
            return acc;
        }, {} as Record<keyof typeof props.p, number>);

        this.el = el.map((el) => {
            const p = Object.entries(props.p).map(([key, prop]) => {
                const [from, to, unit = "%"] = prop || []

                return {
                    curr: this.reverse ? to : from,
                    start: from,
                    end: to,
                    unit
                } as DOMProp
            })

            return [el, p]
        })
    }

    override update(e: MotionEvent) {
        super.update(e)
        for (const [key, [el, props]] of this.el.entries()) {
            for (const prop of props) {
                prop.curr = N.Lerp(prop.start, prop.end, e.easeProgress)
            }
        }


        const has = (...args: Parameters<typeof Object.hasOwn>) => Object.hasOwn(args[0], args[1])
        // styleMapObject["x"]
        const x = has(this.propToIndex, "x"), y = has(this.propToIndex, "y")
        const translate = x || y
        const opacity = has(this.propToIndex, "o")
        const scale = has(this.propToIndex, "s")
        const scaleX = has(this.propToIndex, "scaleX")
        const scaleY = has(this.propToIndex, "scaleY")
        const rotate = has(this.propToIndex, "r")

        if (!this.el) return
        const elements = this.el
        for (const [element, prop] of elements) {
            if (translate || scale || scaleX || scaleY || rotate) {
                let transformString = ""
                if (translate) {
                    const valueX = x ? prop[this.propToIndex["x"]] : undefined
                    const valueY = y ? prop[this.propToIndex["y"]] : undefined
                    transformString += `translate3d(${valueX?.curr ?? 0}${valueX?.unit || "%"}, ${valueY?.curr ?? 0}${valueY?.unit || "%"}, 0) `
                }

                if (scale) {
                    const value = prop[this.propToIndex["s"]]
                    transformString += `scale(${value.curr})`
                } else if (scaleX || scaleY) {
                    const valueX = scaleX ? prop[this.propToIndex["scaleX"]] : undefined
                    const valueY = scaleY ? prop[this.propToIndex["scaleY"]] : undefined
                    transformString += `scale(${valueX?.curr ?? 1}, ${valueY?.curr ?? 1}) `
                }
                if (rotate) {
                    const value = prop[this.propToIndex["r"]]
                    transformString += `rotate(${value.curr}${value.unit})`
                }
                element.style.transform = transformString
            }

            if (opacity) {
                const value = prop[this.propToIndex["o"]]
                element.style.opacity = `${value.curr}`
            }
        }
    }


    override updateProps(arg?: StopMotionUpdatePropsOption) {
        for (const [el, props] of this.el) {
            const id = this.motionManager.motionWeakMapAnimation.get(el)
            !!id && this.motionManager.remove(+id)
        }

        super.updateProps(arg)

        if (!arg) return
        this.override = arg.override || this.override
        const argProp = arg.p || {}

        for (const [key, p] of Object.entries(argProp)) {
            const k = key as unknown as StyleMapKey
            const index = this.propToIndex[k]

            for (const [el, props] of this.el) {

                const prop = props[index]
                prop.end = this.reverse ? props[index].start : prop.end

                // // if (!this.override) {
                // //     const value = currProps[key]
                // //     if (value) prop.curr = value
                // // }
                prop.start = prop.curr

                if (!!p.end) {
                    const end = p.end!
                    prop.end = end
                }
                if (p.start) {
                    const start = p.start!
                    prop.start = start
                }
            }
        }
    }

}
const Svg = {
    getLength: (e: Element) => {
        if ("circle" === e.tagName) return 2 * Math.PI * (+N.DOM.ga(e, "r")!)
        if ('line' === e.tagName) {
            let a, b, c, d;
            a = +N.DOM.ga(e, 'x1')!
            b = +N.DOM.ga(e, "x2")!
            c = +N.DOM.ga(e, 'y1')!
            d = +N.DOM.ga(e, 'y2')!

            return Math.sqrt((a -= b) * a + (c -= d) * c)
        }
        if ("polyline" !== e.tagName) return (e as SVGGeometryElement).getTotalLength()
        let poly = e as SVGPolylineElement, n = poly.points.numberOfItems
        let length = 0, previousItem = poly.points.getItem(0);
        for (let index = 1; index < n; index++) {
            let item = poly.points.getItem(index)
            length += Math.sqrt((item.x - previousItem.x) ** 2 + (item.y - previousItem.y) ** 2)
            previousItem = item
        }
        return length
    },
    split: (pointsString: string) => {
        const s: Array<string | number> = [],
            r = pointsString.split(" ");
        for (const partial of r) {
            let part = partial.split(',')
            for (const p of part) {
                if (isNaN(+p)) {
                    s.push(p)
                } else {
                    s.push(+p)
                }
            }
        }
        return s
    }
}

export class Film {

    stopMotions: Motion[]
    on: boolean
    motionManager: MotionManager;

    constructor(motionManager: MotionManager) {
        this.motionManager = motionManager
        this.stopMotions = []
        this.on = false
    }

    from(props: StopMotionOption) {
        const stopMotion = new Motion(props, this.motionManager)
        this.stopMotions.push(stopMotion)
        return this
    }

    getPromise() {
        return Promise.all(this.stopMotions.map(motion => motion.promise))
    }

    play(props?: StopMotionUpdatePropsOption) {
        const promises = this.stopMotions.map(motion => motion.play(props))

        return Promise.all(promises)
    }

    pause() {
        for (let i = this.stopMotions.length - 1; i >= 0; i--) {
            const stopMotion = this.stopMotions[i]
            stopMotion.pause()
        }
    }

    reset() {
        for (let i = this.stopMotions.length - 1; i >= 0; i--) {
            const motion = this.stopMotions[i]
            motion.pause()
        }

        this.stopMotions = []
    }
}