import type { DirectiveBinding, EffectScope } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
    const cleanUpMap = new WeakMap<WeakKey, EffectScope>();

    nuxtApp.vueApp.directive("cursor", {
        mounted(el: HTMLElement, binding: DirectiveBinding<{ speed?: number }>) {
            const speed = binding.value?.speed ?? 1

            const { state } = useCursor()

            const scope = useCleanScope(
                () => {
                    el.addEventListener("mousemove", () => {
                        state.value = "active"
                    })
                    el.addEventListener("mouseleave", () => {
                        state.value = "default"
                    })
                },
                { detached: true },
            );

            cleanUpMap.set(el, scope);
        },

        beforeUnmount(el) {
            cleanUpMap.get(el)?.stop();
        },
    });
});
