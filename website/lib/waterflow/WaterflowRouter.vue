<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';

const { scrollTopApi } = defineProps<{ scrollTopApi?: () => void }>()
const router = useRouter()
const routes = router.getRoutes()

const { currentRoute, routeTo, crossfadeMode, hijackFlow, flowIsHijacked, releaseHijackFlow, flowInPromise } = useFlowProvider()

const currentPage: Ref<RouteComponent | undefined> = shallowRef(undefined)
const bufferPage: Ref<RouteComponent | undefined> = shallowRef(undefined)

const pageObject = {
    currentPage,
    bufferPage
}
pageObject.currentPage.value = await getComponent(currentRoute.value)

const routerGuard = router.beforeEach(async (to, from, next) => {
    if (flowIsHijacked.value) {
        await Promise.all([flowInPromise.value])
    }

    currentRoute.value = to

    hijackFlow()

    pageObject.bufferPage.value = await getComponent(to)!
    await nextTick()
    await Promise.all([flowInPromise.value])


    scrollTopApi && scrollTopApi()

    releaseHijackFlow()

    swapNode()
    next()
})

function checkEqualRoute(from: RouteLocationNormalized, to: RouteLocationNormalized) {
    return from.fullPath === to.fullPath && from.hash === to.hash
}

async function getComponent(route: RouteLocationNormalized) {
    const componentGetter = routes.filter(el => {
        return el.name === route.name
    })[0].components?.default

    const component = typeof componentGetter === "function" ? (await (componentGetter as Function)()).default : componentGetter
    return component
}

const wrapperA = shallowRef()
const wrapperB = shallowRef()

const swapNode = () => {
    wrapperA.value.classList.toggle('buffer-page')
    wrapperA.value.classList.toggle('current-page')

    wrapperB.value.classList.toggle('buffer-page')
    wrapperB.value.classList.toggle('current-page')

    const temp = pageObject.currentPage
    pageObject.currentPage = pageObject.bufferPage
    pageObject.bufferPage = temp
    pageObject.bufferPage.value = undefined
}

</script>

<template>
    <div class="custom-router__wrapper"
        :class="{ 'flow-hijacked': flowIsHijacked, 'TOP': crossfadeMode === 'TOP', 'BOTTOM': crossfadeMode === 'BOTTOM' }">
        <div class='page-a current-page' ref="wrapperA">
            <component :is="currentPage" />
        </div>
        <div class='page-b buffer-page' ref="wrapperB">
            <component :is="bufferPage" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.custom-router__wrapper {
    position: relative;

}

.page-a {
    left: 0;
}

.page-b {
    right: 0;
}

.page-a,
.page-b {
    top: 0;
    width: 100%;
}

.current-page {
    z-index: 100;
    position: relative;
}

.buffer-page {
    position: fixed;
    pointer-events: none;
    height: var(--100vh);
}

.custom-router__wrapper {
    &.TOP .buffer-page {
        z-index: 150;
    }

    &.BOTTOM .buffer-page {
        z-index: 50;
    }
}
</style>