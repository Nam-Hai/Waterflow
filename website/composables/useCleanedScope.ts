import { onWatcherCleanup, getCurrentWatcher } from "vue"

export const useCleanScope = (callback: (() => void), options?: { detached: boolean }) => {
    const currentScope = getCurrentScope(), currentWatcher = getCurrentWatcher(), currentInstance = getCurrentInstance(), isVue = !!currentInstance
    const detached = options?.detached ?? false
    if (!detached && !currentScope && !currentWatcher && !currentInstance) throw "useCleanScope is outside a scope or watcher"

    const scope = effectScope(detached);

    if (!!currentWatcher) {
        onWatcherCleanup(() => {
            scope.stop()
        })
    }

    if (!!currentInstance && !currentInstance?.isMounted && !currentWatcher) {
        onMounted(() => {
            scope.run(() => {
                callback()
            })
        })
    } else {
        scope.run(() => {
            callback();
        });
    }
    return scope
};
