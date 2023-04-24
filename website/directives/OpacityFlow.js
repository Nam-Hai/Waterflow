
export const vOpacityFlow = {
  mounted: (el, binding) => {

    const delay = binding.value
    N.O(el, 0)

    let tl = new N.TL()
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
