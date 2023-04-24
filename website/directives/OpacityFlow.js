import { O } from "~/helpers/core/utils"

export const vOpacityFlow = {
  mounted: (el, binding) => {
    const {$TL} = useNuxtApp()

    const delay = binding.value
    O(el, 0)

    let tl = new $TL()
    tl.from({
      el,
      p: {
        o: [0, 1]
      },
      d: 1000,
      delay
    }).play()
  }
}
