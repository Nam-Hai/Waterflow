import { RafR, rafCbType } from "~/helpers/core/raf";
import { N } from "~/helpers/namhai-utils";

export const useRaf = (cb: (e: rafCbType) => void) => {

  const raf = ref() as Ref<RafR>

  onMounted(() => {
    raf.value = new N.RafR(cb)
    raf.value.run()
  })

  onBeforeUnmount(() => {
    raf.value.stop()
  })

  return {
    raf
  }
}
