export const useLenisScroll = (callback: (e: { current: number, target: number, velocity: number }) => void, component: boolean = true) => {
  const { $lenis } = useNuxtApp()

  const onScrollSubscription = ref()

  if (component) {
    onMounted(() => {
      onScrollSubscription.value = $lenis.on('scroll', callbackProxy)
      $lenis.emit()
    })
    onBeforeUnmount(() => {
      onScrollSubscription.value()
    })
  }

  const callbackProxy = (e: any) => {
    const arg = {
      current: e.animatedScroll,
      target: e.targetScroll,
      velocity: e.velocity
    }

    callback(arg)
  }

  const on = () => {
    onScrollSubscription.value && onScrollSubscription.value()
    onScrollSubscription.value = $lenis.on('scroll', callbackProxy)
  }
  const off = () => {
    if(!onScrollSubscription.value) return
    onScrollSubscription.value()
  }

  return {
    lenis: {
      run: on,
      stop: off,
      on,
      off,
      emit: () => $lenis.emit(),
      onScrollSubscription
    }
  }
}
