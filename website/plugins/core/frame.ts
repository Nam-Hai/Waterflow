import { N } from "~/utils/namhai"

enum FramePriority {
    FIRST = 0,

    DELAY = 50,
    MOTION = 100,
    MAIN = 500,

    LAST = 10000
}

type FrameEvent = {
    elapsed: number,
    delta: number
}

type FrameItem = {
    id: number,
    cb: (e: FrameEvent) => void,
    startTime?: number
}

class TabManager {
    array: {
        stop: () => void,
        resume: (delta: number) => void
    }[]
    pause: number
    constructor() {
        this.array = []
        this.pause = 0

        N.Bind(this, ["update"])
        document.addEventListener("visibilitychange", this.update)
    }
    add(arg: { stop: () => void, resume: (delta: number) => void }) {
        this.array.push(arg)
    }

    // calcule le temps entre le moment ou pas visible a visible, puis actionne, tOff() ou tOn(r)
    update(e: Event) {
        const t = e.timeStamp;
        let dT = 0

        if (document.hidden) {
            this.pause = t
        } else {
            dT = t - this.pause
        }
        for (let index = this.array.length - 1; 0 <= index; --index) {
            if (document.hidden) {
                this.array[index].stop()
            } else {
                this.array[index].resume(dT)
            }
        }
    }
}

class OrderedArray<T> extends Array<{ id: number, value: T }> {
    constructor() {
        super()
    }

    indexOfId(id: number) {
        return N.binarySearch(this, id)
    }

    override push(el: { id: number, value: T }) {
        const { index } = N.binarySearch(this, el.id)

        this.splice(index, 0, el)
        return index
    }
}

class FrameManager {
    now: number = 0;
    on: boolean;
    frameId = 0

    private stacks: OrderedArray<Array<FrameItem>>

    constructor(tab: TabManager) {
        N.Bind(this, ['update', 'stop', 'resume'])

        this.stacks = new OrderedArray()
        this.stacks.push({ id: FramePriority.FIRST, value: [] })
        this.stacks.push({ id: FramePriority.MAIN, value: [] })
        this.stacks.push({ id: FramePriority.LAST, value: [] })

        this.on = true
        tab.add({ stop: this.stop, resume: this.resume })
        this.raf()
    }

    resume(delta = 0) {
        this.on = true
        for (const stack of this.stacks) {
            for (const frameItem of stack.value) {
                frameItem.startTime = (frameItem.startTime || 0) + delta
            }
        }
        this.now += delta
    }
    stop() {
        this.on = false
    }

    add(frameItem: FrameItem, priority: number) {
        const { index, miss } = this.stacks.indexOfId(priority)
        let stack: FrameItem[]

        if (miss) {
            stack = []
            this.stacks.splice(index, 0, { id: priority, value: stack })
        } else {
            stack = this.stacks[index].value
        }

        stack.push(frameItem)

        if (priority === FramePriority.MAIN && stack.length > 10000) console.warn("Main raf stack congested", stack.length)
    }

    remove(id: number, priority: number) {
        const { index: priorityIndex, miss: priorityMiss } = this.stacks.indexOfId(priority)
        if (priorityMiss) {
            console.error("Raf remove jammed : priority stack doesn't exist")
            return
        }
        const stack = this.stacks[priorityIndex].value

        const { index, miss } = N.binarySearch(stack, id)

        if (miss) {
            console.warn("Raf remove jammed : id not in stack")
            return
        }
        stack.splice(index, 1)
    }

    update(t: number) {
        const delta = t - (this.now || t - 16)
        this.now = t

        if (Math.floor(1 / delta * 1000) < 20) {
            console.warn("Huge frame drop")
        }

        if (this.on) {
            for (const stack of this.stacks) {
                for (const frameItem of stack.value) {
                    if (!frameItem.startTime) {
                        frameItem.startTime = t
                    }

                    const elapsed = t - frameItem.startTime
                    frameItem.cb({ elapsed, delta })
                }
            }
        }

        this.raf()
    }

    private raf() {
        requestAnimationFrame(this.update)
    }


}

class FrameFactory {
    private FrameManager: FrameManager
    constructor(FrameManager: FrameManager) {
        this.FrameManager = FrameManager
        N.Bind(this, ["Frame", "Delay", "Timer"])
    }
    Frame(options: Omit<ConstructorParameters<typeof Frame>[0], "FrameManager">) {
        return new Frame({ ...options, FrameManager: this.FrameManager })
    }
    Delay(options: Omit<ConstructorParameters<typeof Delay>[0], "FrameManager">) {
        return new Delay({ ...options, FrameManager: this.FrameManager })
    }
    Timer(options: Omit<ConstructorParameters<typeof Timer>[0], "FrameManager">) {
        return new Timer({ ...options, FrameManager: this.FrameManager })
    }
}

class Frame {
    readonly callback: (e: FrameEvent) => void;
    readonly priority: number;
    private killed: boolean;
    on: boolean
    id?: number
    private FrameManager!: FrameManager

    constructor(options: { callback: (e: FrameEvent) => void, priority?: number, FrameManager: FrameManager }) {
        N.Bind(this, ["stop", "run", "kill"])
        this.FrameManager = options.FrameManager
        this.callback = options.callback
        this.priority = options.priority ?? FramePriority.MAIN

        this.on = false
        this.killed = false
    }

    run(startTime?: number) {
        if (this.on || this.killed) return this
        this.on = true
        this.FrameManager.frameId++
        this.id = this.FrameManager.frameId
        const frameItem: FrameItem = {
            id: this.id,
            cb: this.callback,
            startTime: startTime ? this.FrameManager.now - startTime : undefined
        }

        this.FrameManager.add(frameItem, this.priority)
        return this
    }

    stop() {
        if (!this.on) return this
        this.on = false

        this.id && this.FrameManager.remove(this.id, this.priority)
        return this
    }

    kill() {
        this.stop()
        this.killed = true
        return this
    }
}

class Delay {
    readonly callback: (lateStart?: number) => void;
    readonly delay: number;
    private frame: Frame;
    constructor(options: { delay: number, callback: (lateStart?: number) => void, FrameManager: FrameManager }) {
        const { callback, delay, FrameManager } = options

        N.Bind(this, ["update", "stop", "run"])
        this.callback = options.callback
        this.delay = options.delay

        this.frame = new Frame({ callback: this.update, priority: FramePriority.DELAY, FrameManager })

    }

    run() {
        if (this.delay === 0) this.callback()
        else this.frame.run()

        return this
    }

    stop() {
        this.frame.stop()
        return this
    }

    update(e: FrameEvent) {
        const t = N.Clamp(e.elapsed, 0, this.delay)

        if (t >= this.delay) {
            this.stop()
            const lateStart = e.elapsed - this.delay
            this.callback(lateStart)
        }

        return this
    }
}

class Timer {
    private ticker: Delay
    constructor(options: { callback: () => void, throttle: number, FrameManager: FrameManager }) {
        const { callback, throttle: delay = 200, FrameManager } = options
        this.ticker = new Delay({ delay, callback, FrameManager })
    }

    tick() {
        this.ticker.stop()
        this.ticker.run()
        return this
    }

    stop() {
        this.ticker.stop()
        return this
    }
}

export { Frame, Delay, Timer, FramePriority, TabManager, FrameManager, FrameFactory }
export type { FrameItem, FrameEvent }