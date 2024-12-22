import type { FrameFactory } from "./core/frame";
import { MotionFactory, MotionManager } from "./core/stopMotion"

export default defineNuxtPlugin({
    dependsOn: ['frame'],
    setup: nuxtApp => {
        const { $frameFactory } = nuxtApp
        const MM = new MotionManager($frameFactory as FrameFactory)
        const motionFactory = new MotionFactory(MM)

        return {

            provide: {
                motionFactory
            }
        }

    }
})