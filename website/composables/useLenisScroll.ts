export const useLenisScroll = (callback: (e:{current: number, target: number, velocity: number}) => void) => {
  const { $lenis } = useNuxtApp()

  const onScrollSubscription = ref()
  onMounted(() => {
    onScrollSubscription.value = $lenis.on('scroll', callbackProxy)
    $lenis.emit()
  })
  onBeforeUnmount(() => {
    onScrollSubscription.value()
    // $lenis.off('scroll', callback)
  })

  const callbackProxy = (e:any)=>{
    const arg = {
      current: e.animatedScroll,
      target: e.targetScroll,
      velocity: e.velocity
    }
    
    callback(arg)
  }

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
