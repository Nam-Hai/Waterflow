import { RafR, rafCbType } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafCbType) => void, component: boolean = true) => {
  const { $RafR } = useNuxtApp()

  const raf = new $RafR(cb)

  if (component) {
    onMounted(() => {
      raf.run()
    })

    onBeforeUnmount(() => {
      raf.stop()
    })
  } 

  return raf
}
