import { RafR, rafCbType } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafCbType) => void, lastStack = false, firstStack = false) => {
  const { $RafR } = useNuxtApp()

  const raf = ref() as Ref<RafR>

  onBeforeMount(() => {
    raf.value = new $RafR(cb, lastStack, firstStack)
    raf.value.run()
  })

  onBeforeUnmount(() => {
    raf.value.stop()
  })

  return raf

}
