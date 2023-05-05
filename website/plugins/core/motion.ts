import { Lerp, Round, Select, Has, BM, Is, Clamp, Svg } from "~/helpers/core/utils";
import { Ease, Ease4, Ease4Arg, EaseFunctionName } from "~/helpers/core/eases";
import { Delay, rafCbType, RafR } from "./raf";

export interface svgProp {
    type: string,
    attr: string,
    end: string,
    start: string,
    curr: string,
    originArr: {
        start: Array<string | number>, // might be Array<string | number>
        end: Array<string | number>,
    },
    arr: {
        start: Array<string | number>,
        end: Array<string | number>
    },
    arrL: number
    val: Array<string | number>
}
export interface pProp {
    name: string,
    origin: {
        start: number,
        end: number
    },
    curr: number,
    start: number,
    end: number,
    unit: string
}
export interface lineProp {
    dashed: string[],
    coeff: {
        start?: number,
        end: number
    },
    shapeL: Array<number>
    origin: {
        start: number[]
        end: number[]
    }
    curr: number[]
    start: number[]
    end: number[]
}
export interface MotionState {
    el?: NodeList | HTMLElement[],
    elL?: number,
    e: {
        curve: EaseFunctionName | Ease4Arg,
        calc?: (t: number) => number
    },
    d: {
        origin: number,
        curr: number
    },
    prop?: pProp[],
    propTable?: { [key: string]: number },
    svg?: svgProp,
    line?: lineProp
    delay?: number,
    cb?: () => void,
    r?: number,
    prog: number,
    progE: number,
    elapsed: number,
    update: (t: MotionUpdate) => void
}
export interface MotionUpdate {
    prog: number,
    progE: number
}

export interface MotionArgBasics {
    el?: string | NodeList | HTMLElement[] | HTMLElement,
    e?: EaseFunctionName | Ease4Arg
    d?: number,
    delay?: number,
    cb?: () => void,
    r?: number,
}

export interface MotionArgP extends MotionArgBasics {
    p?: {
        [key: string]: [number, number, string] | [number, number] | { newEnd?: number, newStart?: number },
        // x: [number, number, string] | [number,number],
        // y: [number, number, string] | [number,number],
        // o: [number,number],
        // s: [number, number],
        // r: [number, number]
    },
    update?: never
    svg?: never
    line?: never
}
export interface MotionArgSvg extends MotionArgBasics {
    svg: {
        end: string,
        start?: string,
        type?: string
    },
    p?: never
    update?: never
    line?: never
}
export interface MotionArgLine extends MotionArgBasics {
    line: {
        start?: number,
        end: number,
        dashed?: number
    },
    svg?: never
    p?: never
    update?: never
}
export interface MotionArgUpdate extends MotionArgBasics {
    update?: (t: MotionUpdate) => void
    p?: never
    line?: never
    svg?: never
}
type MotionArg = MotionArgLine | MotionArgSvg | MotionArgP | MotionArgUpdate
class Motion {
    v;
    raf;
    delay;
    constructor(arg: MotionArg) {
        BM(this, ["initRaf", "run", "uSvg", "uLine", "uProp"])
        this.v = this.vInit(arg)
        this.raf = new RafR(this.run)
        this.delay = new Delay(() => { }, 0)
    }

    vInit(arg: MotionArg) {
        const i: MotionState = {
            el: arg.el ? Select(arg.el) : undefined,
            e: {
                curve: arg.e || 'linear',
            },
            d: {
                origin: arg.d || 0,
                curr: 0
            },
            delay: arg.delay || 0,
            cb: arg.cb,
            r: arg.r || 2,
            prog: 0,
            progE: 0,
            elapsed: 0,
            update: e => void e
        }

        i.elL = i.el?.length
        if (Has(arg, "update")) {
            i.update = (t: MotionUpdate) => { (arg as MotionArgUpdate).update!(t) }
        } else if (Has(arg, 'svg')) {
            i.update = this.uSvg
        } else if (Has(arg, 'line')) {
            i.update = this.uLine
        } else {
            i.update = this.uProp
        }

        const p = (arg as MotionArgP).p || false, svg = (arg as MotionArgSvg).svg || false, line = (arg as MotionArgLine).line || false;

        let e = false;
        if (p) {
            i.prop = []
            i.propTable = {}
            let index = 0
            for (const [key, v] of Object.entries(p)) {
                const value = v as [number, number] | [number, number, string]
                i.prop.push({
                    name: key,
                    origin: {
                        start: value[0],
                        end: value[1]
                    },
                    curr: value[0],
                    start: value[0],
                    end: value[1],
                    unit: value[2] || '%'
                })
                const firstChar = key.charAt(0)
                i.propTable[firstChar] = index;
                index++;
            }
        } else if (svg) {
            let svgTemp: any = {
                type: svg.type || 'd',
                attr: "polygon" === svg.type ? "points" : "d",
                end: svg.end,
                val: []
            }
            svgTemp.start = svg.start || (i.el && (i.el[0] as HTMLElement).getAttribute(svgTemp!.attr))
            svgTemp.curr = svgTemp!.start
            svgTemp.originArr = {
                end: Svg.split(svgTemp!.end),
                start: Svg.split(svgTemp!.start!)
            }
            svgTemp.arr = {
                start: svgTemp?.originArr.start!,
                end: svgTemp?.originArr.end!
            }
            svgTemp.arrL = svgTemp?.arr.start!.length!
            i.svg = svgTemp
        } else if (line) {
            // TODO
            let lineTemp: any = {
                dashed: line.dashed,
                coeff: {
                    start: Is.def(line.start) ? (100 - line.start) / 100 : 1,
                    end: Is.def(line.end) ? (100 - line.end) / 100 : 0
                },
                shapeL: [],
                origin: {
                    start: [],
                    end: []
                },
                curr: [],
                start: [],
                end: []
            }

            // generate strokeDasharray
            for (let index = 0; index < i.elL!; index++) {
                lineTemp.shapeL[index] = Svg.getLength(i.el![index] as Element)
                let strokeDasharray;

                if (lineTemp.dashed) {
                    // TODO Animation on strokeDasharray ? 
                    // TODO absolute and % strokeDasharray ?
                    strokeDasharray = lineTemp.dashed
                } else strokeDasharray = lineTemp.shapeL;
                (i.el![index] as HTMLElement).style.strokeDasharray = strokeDasharray
                lineTemp.origin.start[index] = lineTemp.coeff.start * lineTemp.shapeL[index]
                lineTemp.origin.end[index] = lineTemp.coeff.end * lineTemp.shapeL[index]
                lineTemp.curr[index] = lineTemp.origin.start[index]
                lineTemp.start[index] = lineTemp.origin.start[index]
                lineTemp.end[index] = lineTemp.origin.end[index]
            }
            i.line = lineTemp
        }
        return i
    }

    /** @param t Allow to reassign prop value to play the motion multiple times */
    play(t: MotionArg = {}) {
        this.pause()
        this.vUpdate(t)
        this.delay.run()
    }
    pause() {
        this.raf.stop()
        this.delay && this.delay.stop()
    }

    vUpdate(arg: MotionArg = {}) {
        let s: 'start' | 'end' = Has(arg, 'reverse') ? 'start' : 'end'

        if (Has(this.v, 'prop') && this.v.prop) {
            for (let prop of this.v.prop) {
                prop.end = prop.origin[s]
                prop.start = prop.curr
                if (Has(arg, 'p') && Has(arg.p!, prop.name)) {
                    Has(arg.p[prop.name], 'newEnd') && (prop.end = (arg.p[prop.name] as { newEnd: number }).newEnd);
                    Has(arg.p[prop.name], 'newStart') && (prop.start = (arg.p[prop.name] as { newStart: number }).newStart);
                }
            }
        } else if (Has(this.v, 'svg')) {
            // TODO
        } else if (Has(this.v, 'line')) {
            // TODO
        }

        this.v.d && (this.v.d.curr = Has(arg, 'd') ? arg.d! : Round(this.v.d!.origin - this.v.d!.curr + this.v.elapsed))

        this.v.e.curve = arg.e || this.v.e.curve
        this.v.e.calc = Is.str(this.v.e.curve) ? Ease[this.v.e.curve] : Ease4(this.v.e.curve)
        this.v.delay = (Has(arg, 'delay') ? arg : this.v).delay ?? 0
        this.v.cb = (Has(arg, "cb") ? arg : this.v).cb

        this.v.prog = this.v.progE = (this.v.d && this.v.d.curr === 0) ? 1 : 0
        this.delay = new Delay(this.initRaf, this.v.delay)
    }

    initRaf() {
        this.raf.run()
    }

    run(e: rafCbType) {
        let t = e.elapsed
        if (this.v.prog === 1) {
            this.pause()
            this.v.update({ prog: this.v.prog, progE: this.v.progE })
            this.v.cb && this.v.cb()
        } else {
            this.v.elapsed = Clamp(t, 0, this.v.d.curr)
            this.v.prog = Clamp(this.v.elapsed / this.v.d.curr, 0, 1)
            this.v.progE = this.v.e.calc!(this.v.prog)
            this.v.update({ prog: this.v.prog, progE: this.v.progE })
        }

    }

    uProp() {
        if (!this.v.el) throw "el not specified for prop motion"
        const props = this.v.prop!;
        let t = this.v.propTable || {};
        if (props.length === 0) return
        for (const prop of props) {
            prop.curr = this.lerp(prop.start, prop.end)
        }
        const x = Has(t, "x") ? props[t.x].curr + props[t.x].unit : 0,
            y = Has(t, 'y') ? props[t.y].curr + props[t.y].unit : 0;
        const translate = !x && !y ? 0 : `translate3d(${x},${y},0)`,
            r = Has(t, 'r') ? `${props[t.r].name == 'r' ? 'rotate' : props[t.r].name}(${props[t.r].curr}deg)` : 0,
            s = Has(t, 's') ? `${props[t.s].name == 's' ? 'scale' : props[t.s].name}(${props[t.s].curr})` : 0;
        const transform = !translate && !r && !s ? 0 : [translate, r, s].filter(t => !!t).join(" "),
            o = Has(t, "o") ? props[t.o].curr : -1


        for (const element of Object.values(this.v.el as HTMLElement[])) {
            if (!element) continue
            if (!!transform) {
                element.style.transform = transform
            }
            if (o >= 0) element.style.opacity = "" + o
        }
    }
    uLine() {
        if (!this.v.el) throw "el not specified for line motion"
        const line = this.v.line!
        for (let index = 0; index < this.v.el.length; index++) {
            line.curr[index] = this.lerp(line.start[index], line.end[index]);

            (this.v.el[index] as HTMLElement).style.strokeDashoffset = '' + line.curr[index]
        }
    }
    uSvg() {
        if (!this.v.el) throw "svg not specified for svg motion"
        const svg = this.v.svg!
        let currTemp = ""

        for (let index = 0; index < svg.arrL; index++) {
            svg.val[index] = isNaN(+svg.arr.start[index]) ? svg.arr.start[index] : this.lerp(svg.arr.start[index] as number, svg.arr.end[index] as number)
            currTemp += svg.val[index] + " "
            svg.curr = currTemp.trim()
        }
        for (let index = 0; index < this.v.elL! && !Is.und(this.v.el[index]); index++) {
            (this.v.el![index] as HTMLElement).setAttribute(svg.attr, svg.curr)
        }
    }

    lerp(start: number, end: number) {
        return (Lerp(start, end, this.v.progE))
    }
}

export class Timeline {
    arr: Array<Motion>;
    delay;
    constructor() {
        this.arr = []
        this.delay = 0
    }

    from(t: MotionArg) {
        this.delay = Has(t, 'delay') ? t.delay! : 0
        t.delay = this.delay
        let m = new Motion(t)
        this.arr.push(m)
        return this
    }
    play() {
        this.run("play")
    }
    pause() {
        this.run('pause')
    }

    run(action: 'play' | 'pause') {
        for (const motion of this.arr) {
            motion[action]()
        }
    }

}
const TL = Timeline

export { Motion, TL }
