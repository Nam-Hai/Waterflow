import { FrameFactory, FrameManager, TabManager } from './core/frame'
import { ResizeFactory, ResizeManager } from './core/resize'

export default defineNuxtPlugin({
  name: "frame",
  setup: nuxtApp => {
    const tab = new TabManager()
    const FM = new FrameManager(tab)
    const frameFactory = new FrameFactory(FM)

    const RM = new ResizeManager(frameFactory.Timer)
    const resizeFactory = new ResizeFactory(RM)

    return {
      provide: {
        frameFactory,
        resizeFactory
      }
    }

  }
})
