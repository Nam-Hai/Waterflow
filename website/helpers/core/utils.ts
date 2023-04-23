const Lerp = (xi: number, xf: number, t: number) => {
    return (1 - t) * xi + t * xf
}

const iLerp = (x: number, xi: number, xf: number) => {
    return (x - xi) / (xf - xi)
}

const Clamp = (x: number, min: number, max: number) => {
    return Math.max(Math.min(x, max), min)
}

const map = (x: number, start1: number, end1: number, start2: number, end2: number) => {
    return Lerp(start2, end2, iLerp(x, start1, end1))
}

const get = (selector: string, context?: ParentNode) => {
    const c = context || document;
    return c.querySelector(selector) as HTMLElement
}
const getAll = (selector: string, context?: ParentNode) => {
    const c = context || document
    return c.querySelectorAll(selector)
}

const Is = {
    str: (t: any): t is string => 'string' == typeof t,
    obj: (t: any): t is Object => t === Object(t),
    arr: (t: any): t is Array<any> => t.constructor === Array,
    def: <T>(t: T | undefined): t is T => void 0 !== t,
    und: (t: any): t is undefined => t === undefined
}

const Select = (t: string | NodeList | HTMLElement[] | HTMLElement) => {
    return Is.str(t) ? getAll(t) : (t instanceof window.NodeList || Array.isArray(t)) ? t : [t];
}

const Cr = (tagName: string) => {
    return document.createElement(tagName)
}

const Round = (x: number, decimal?: number) => {
    decimal = Is.und(decimal) ? 100 : 10 ** decimal;
    return Math.round(x * decimal) / decimal
}
const random = Math.random
const Rand = {
    /** Rand.range avec par default step = 1% de la range */
    range: (min: number, max: number, step = (max - min) / 1000) => {
        return Round(Math.random() * (max - min) + min, step)
    },
    arr: <T>(array: Array<T>)=>{
        return array[Math.floor(Math.random() * array.length)]
    }
}
const Arr = {
    /** Create an Array of n element */
    uniq: (ArrayLength: number) => {
        return [...Array(ArrayLength).keys()]
    },
    /** shuffle an Array */
    shuffle: <T>(array: Array<T>) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = ~~(random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
    }
}

const Has = <T extends Object, K extends PropertyKey>(obj: T, property: K): obj is Extract<T, { [P in K]?: any }> => obj.hasOwnProperty(property)

const O = (el: HTMLElement, value: string | number) => {
    el.style.opacity = "" + value
}

const pe = (el: HTMLElement, state: string) => {
    el.style.pointerEvents = state
}
const PE = {
    all: (el: HTMLElement) => {
        pe(el, 'all')
    },
    none: (el: HTMLElement) => {
        pe(el, 'none')
    }
}

const Snif = {
    isMobile: () => {
        return window.matchMedia('(pointer: coarse)').matches;
    },
    isTouchable: () => {
        return window.matchMedia('(any-pointer: coarse)').matches;
    }
}

const T = (el: HTMLElement, x: number, y: number, unite = '%') => {
    el.style.transform = "translate3d(" + x + unite + "," + y + unite + ",0)"
}
const BM = (context: any, methodArray: string[]) => {
    for (const methodString of methodArray) {
        context[methodString] = context[methodString].bind(context)
    }
}

const Ga = (context: Element, attribute: string) => context.getAttribute(attribute)
const PD = (event: Event) => {
    event.cancelable && event.preventDefault()
}
const ZL = (t: number) => 9 < t ? '' + t : '0' + t

const Svg = {
    getLength: (e: Element) => {
        if ("circle" === e.tagName) return 2 * Math.PI * (+Ga(e, "r")!)
        if ('line' === e.tagName) {
            let a, b, c, d;
            a = +Ga(e, 'x1')!
            b = +Ga(e, "x2")!
            c = +Ga(e, 'y1')!
            d = +Ga(e, 'y2')!

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
export { Is, Lerp, iLerp, map, Clamp, get, getAll, Select, Cr, Round, random, Rand, Arr, Has, O, PE, Snif, T, BM, Ga, PD, ZL, Svg }