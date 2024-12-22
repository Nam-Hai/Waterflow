import Lenis from "lenis";
import type { FrameEvent, FrameFactory } from "./core/frame";

export default defineNuxtPlugin((nuxtApp) => {
    const lenis = new Lenis();
    const { $frameFactory } = nuxtApp

    const callback = (e: FrameEvent) => {
        lenis.raf(e.elapsed);
    };
    const frame = ($frameFactory as FrameFactory).Frame({ callback })
    frame.run()

    // lenis.on("scroll", ScrollTrigger.update);
    // ticker.add(raf);

    return {
        provide: {
            lenis,
        },
    };
});

