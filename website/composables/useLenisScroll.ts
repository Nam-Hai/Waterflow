export const useLenisScroll = (callback: (e: any) => void) => {
  const { $lenis } = useNuxtApp()

  const onScrollSubscription = ref()
  onMounted(() => {
    onScrollSubscription.value = $lenis.on('scroll', callback)
    $lenis.emit()
  })
  onBeforeUnmount(() => {
    onScrollSubscription.value()
    // $lenis.off('scroll', callback)
  })

  const on = () => {
    onScrollSubscription.value()
    onScrollSubscription.value = $lenis.on('scroll', callback)
  }
  const off = () => onScrollSubscription.value()

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
