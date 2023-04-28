import { BM, Clamp, Is } from "~/helpers/core/utils";

function now() {
    return (typeof performance === 'undefined' ? Date : performance).now();
}

// Clock from Three.js, pretty sure it is possible to get rid from things here
class Clock {
    autostart;
    startTime;
    oldTime;
    elapsedTime;
    running;
    constructor(autostart = true) {
        this.autostart = autostart
        this.startTime = 0
        this.oldTime = 0
        this.elapsedTime = 0
        this.running = false
    }

    start() {
        this.startTime = now()
        this.oldTime = this.startTime
        this.elapsedTime = 0
        this.running = true
    }
    stop() {
        this.getElapsedTime();
        this.running = false
        this.autostart = false
    }
    getElapsedTime() {
        this.getDelta()
        return this.elapsedTime
    }
    getDelta() {
        let diff = 0;
        if (this.autostart && !this.running) {
            this.start()
            return 0
        }
        if (this.running) {
            const newTime = now()
            diff = (newTime - this.oldTime)
            this.oldTime = newTime
            this.elapsedTime += diff
        }
        return diff
    }
}

export type rafItem = {
    id: number,
    cb: (arg: { elapsed: number, delta: number }) => void,
    startTime?: number
}
export type rafCbType = {
    elapsed: number,
    delta: number
}

const Raf = new class {
    clock;
    arr: Array<{
        id: number,
        cb: (arg: { elapsed: number, delta: number }) => void,
        startTime: number
    } | rafItem>;
    on;
    constructor() {
        this.clock = new Clock
        this.arr = []
        this.on = !0
        BM(this, ['update', 'stop', 'resume'])
        this.raf()
    }

    stop() {
        this.on = false
    }
    resume(delta: number) {
        for (let t = this.l(); 0 <= t; t--) {
            this.arr[t].startTime! += delta
        }
    }

    add(rafItem: rafItem) {
        this.arr.push(rafItem)
        this.arr.sort((a,b) => a.id - b.id)
    }

    remove(r: number): void {
        for (let t = this.l(); 0 <= t; t--)
            if (this.arr[t].id === r) return void this.arr.splice(t, 1)
    }

    update() {
        let s;
        let d = this.clock.getDelta()
        let elapsedTime = this.clock.elapsedTime
        if (this.on) {
            for (let t = this.l(); 0 <= t; t--) {
                const e = this.arr[t]
                Is.def(e) && (e.startTime || (e.startTime = elapsedTime), s = elapsedTime - e.startTime, e.cb({ elapsed: s, delta: d }))
            }
        }
        this.raf()
    }

    raf() {
        requestAnimationFrame(this.update)
    }

    l() {
        return this.arr.length - 1
    }
}

let RafId = 0;

class RafR {
    cb;
    on;
    id;
    constructor(callback: (arg: { elapsed: number, delta: number }) => void, lastStack = false, firstStack = false) {
        this.cb = callback
        this.on = false
        this.id = RafId
        this.id += firstStack ? +100000 : 0
        this.id += lastStack ? -20000 : 0
        RafId++
    }

    run() {
        if (this.on) return
        Raf.add({ id: this.id, cb: this.cb })
        this.on = true
    }
    stop() {
        if (!this.on) return
        Raf.remove(this.id)
        this.on = false
    }
}

class Delay {
    cb;
    delay;
    raf;
    constructor(callback: () => void, delay: number) {
        this.cb = callback
        this.delay = delay
        BM(this, ["update"])
        this.raf = new RafR(this.update)
    }

    run() {
        0 === this.delay ? this.cb() : this.raf.run()
    }

    stop() {
        this.raf.stop()
    }

    update(e: rafCbType) {
        let t = e.elapsed
        t = Clamp(t, 0, this.delay)

        1 === Clamp(t / this.delay, 0, 1) && (this.stop(), this.cb())
    }
}

class Timer {
    timer
    constructor(callback: () => void, delay: number = 200) {
        this.timer = new Delay(callback, delay)
    }

    // reset delay
    tick() {
        this.timer.stop()
        this.timer.run()
    }
}

export { Raf, RafR, Delay, Timer } 
