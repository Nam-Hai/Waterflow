export function useEventListener<K extends keyof WindowEventMap>(target: Ref<Element> | Document, event: K, callback: (e: Event) => void) {
    let t = shallowRef();
    if (target == document) t.value = target;
    else t = target as Ref<Element>

    onMounted(() => {
        t.value.addEventListener(event, callback)
    })
    onBeforeUnmount(() => {
        t.value.removeEventListener(event, callback)
    })
}