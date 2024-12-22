export type EaseFunctionName = 'linear' | 'i1' | 'o1' | 'i2' | 'o2' | 'i3' | 'o3' | 'i4' | 'o4' | 'i5' | 'o5' | 'i6' | 'o6' | 'io1' | 'io2' | 'io3' | 'io4' | 'io5' | 'io6'
export enum EaseEnum {
    linear = 'linear',
    i1 = "i1",
    i2 = "i2",
    i3 = "i3",
    i4 = "i4",
    i5 = "i5",
    i6 = "i6",
    o1 = "o1",
    o2 = "o2",
    o3 = "o3",
    o4 = "o4",
    o5 = "o5",
    o6 = "o6",
    io1 = "io1",
    io2 = "io2",
    io3 = "io3",
    io4 = "io4",
    io5 = "io5",
    io6 = "io6",
}
type EaseFunctionMap = {
    [K in EaseFunctionName]: (t: number) => number;
}
const Ease: EaseFunctionMap = {
    linear: t => t,
    i1: t => 1 - Math.cos(t * (.5 * Math.PI)),
    o1: t => Math.sin(t * (.5 * Math.PI)),
    io1: t => -.5 * (Math.cos(Math.PI * t) - 1),
    i2: t => t * t,
    o2: t => t * (2 - t),
    io2: t => t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1,
    i3: t => t * t * t,
    o3: t => --t * t * t + 1,
    io3: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    i4: t => t * t * t * t,
    o4: t => 1 - --t * t * t * t,
    io4: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    i5: t => t * t * t * t * t,
    o5: t => 1 + --t * t * t * t * t,
    io5: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    i6: t => 0 === t ? 0 : 2 ** (10 * (t - 1)),
    o6: t => 1 === t ? 1 : 1 - 2 ** (-10 * t),
    io6: t => 0 === t ? 0 : 1 === t ? 1 : (t /= .5) < 1 ? .5 * 2 ** (10 * (t - 1)) : .5 * (2 - 2 ** (-10 * --t)),
}
const r0 = (t: number, r: number) => 1 - 3 * r + 3 * t
const r1 = (t: number, r: number) => 3 * r - 6 * t
const r2 = (t: number, r: number, s: number) => ((r0(r, s) * t + r1(r, s)) * t + 3 * r) * t
const r3 = (t: number, r: number, s: number) => 3 * r0(r, s) * t * t + 2 * r1(r, s) * t + 3 * r
const r4 = (t: number, r: number, s: number, e: number, i: number) => {
    let a, n, o = 0;
    for (; n = r + .5 * (s - r), 0 < (a = r2(n, e, i) - t) ? s = n : r = n, 1e-7 < Math.abs(a) && ++o < 10;);
    return n
}
const r5 = (r: number, s: number, e: number, i: number) => {
    for (let t = 0; t < 4; ++t) {
        var a = r3(s, e, i);
        if (0 === a) return s;
        s -= (r2(s, e, i) - r) / a
    }
    return s
}

export type Ease4Arg = [number, number, number, number]
const Ease4 = (t: [number, number, number, number]) => {
    const a = t[0],
        r = t[1],
        n = t[2],
        s = t[3];
    let o = new Float32Array(11);
    if (a !== r || n !== s)
        for (let t = 0; t < 11; ++t) o[t] = r2(.1 * t, a, n);
    return (t: number) => a === r && n === s ? t : 0 === t ? 0 : 1 === t ? 1 : r2(function (t) {
        let r = 0;
        for (var s = 1; 10 !== s && o[s] <= t; ++s) r += .1;
        --s;
        var e = (t - o[s]) / (o[s + 1] - o[s]),
            e = r + .1 * e,
            i = r3(e, a, n);
        return .001 <= i ? r5(t, e, a, n) : 0 === i ? e : r4(t, i, i + .1, a, n)
    }(t), r, s)
}


export { Ease, Ease4 }