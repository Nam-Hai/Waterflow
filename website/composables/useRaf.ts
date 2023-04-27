import { RafR, rafCbType } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafCbType) => void, component: boolean = true) => {
  const { $RafR } = useNuxtApp()

  const raf = ref() as Ref<RafR>

  if (component) {
    onMounted(() => {
      raf.value = new $RafR(cb)
      raf.value.run()
    })

    onBeforeUnmount(() => {
      raf.value.stop()
    })
  } else {
    raf.value = new $RafR(cb)

  }

  return {
    raf
  }
}
