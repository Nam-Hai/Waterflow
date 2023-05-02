import { onFlow } from "@nam-hai/water-flow"
import { N } from "~/helpers/namhai-utils"

type useScrollEventOptions = {
  el: Ref<HTMLElement>,
  vStart?: number,
  eStart?: number,
  end?: number,
  onEnter?: () => void,
  onProgress?: (t: number) => void,
  pin?: boolean
}

export const useScrollEvent = ({
  el,
  vStart = 0,
  eStart = 0,
  end = 0,
  onEnter = undefined,
  onProgress = undefined
}: useScrollEventOptions) => {
  const hasEnter = ref(false)
  const bounds = ref() as Ref<DOMRect>

  const resize = () => {
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY

    // intersectionObserver.value.disconnect()
    // lenis.run()
    // lenis.emit()
    // intersectionInit()
  }

  const { vh } = useResize(resize)

  onMounted(() => {
    intersectionInit()
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY
  })

  const { lenis } = useLenisScroll(() => {
    if (!bounds.value) return
    const dist = window.scrollY - bounds.value.y + vh.value * vStart / 100 - bounds.value.height * eStart / 100
    const offset = N.Clamp(dist, 0, vh.value * (vStart - end) / 100)

    const t = N.iLerp(offset / vh.value, 0, (vStart - end) / 100)
    if (t > 0 && !hasEnter.value) {
      hasEnter.value = true
      onEnter && onEnter()

      if (!onProgress) {
        intersectionObserver.value.disconnect()
        lenis.stop()
      }
    }
    if (t > 0) onProgress && onProgress(t)
  })

  const intersectionObserver = ref() as Ref<IntersectionObserver>
  const intersectionInit = () => {
    intersectionObserver.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.isIntersecting ? lenis.run() : lenis.stop()
      })
    })
    intersectionObserver.value.observe(el.value)
  }

  onBeforeUnmount(() => {
    intersectionObserver.value.disconnect()
  })
}

