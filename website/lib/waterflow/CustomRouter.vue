<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';

const { scrollTopApi } = defineProps<{ scrollTopApi?: () => void }>()
const router = useRouter()
const routes = router.getRoutes()
// const components = {
//     index: defineAsyncComponent(() => import("@/pages/index.vue")),
//     foo: defineAsyncComponent(() => import("@/pages/foo.vue")),
//     baz: defineAsyncComponent(() => import("@/pages/baz.vue")),
//     "work-slug": defineAsyncComponent(() => import("@/pages/work/[slug].vue"))
// } as const

const { currentRoute, routeTo, routeFrom, hijackFlow, flowIsHijacked, releaseHijackFlow, flowInPromise } = useFlowProvider()

const currentPage: Ref<RouteComponent | undefined> = shallowRef(undefined)
const bufferPage: Ref<RouteComponent | undefined> = shallowRef(undefined)

const pageObject = {
    currentPage,
    bufferPage
}
pageObject.currentPage.value = await getComponent(currentRoute.value)

// watch(currentRoute, async (to, from) => {
const routerGuard = router.beforeEach(async (to, from, next) => {
    console.log(to.path, from.path);
    if (checkEqualRoute(to, from)) {
        // console.log("test");
        return
    }
    if (flowIsHijacked.value) return next()
    // if (flowIsHijacked.value) return

    routeFrom.value = routeTo.value
    routeTo.value = to
    currentRoute.value = routeTo.value

    hijackFlow()
    console.log("hijackflow", flowInPromise.value, flowIsHijacked.value);

    pageObject.bufferPage.value = await getComponent(to)!
    await nextTick()
    await Promise.all([flowInPromise.value])


    scrollTopApi && scrollTopApi()

    console.log("releaseHijackFlow");
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
    <div class="custom-router__wrapper">
        <div class='page-a current-page' ref="wrapperA">
            <component :is="currentPage" />
        </div>
        <div class='page-b buffer-page' ref="wrapperB">
            <component :is="bufferPage" />
        </div>
    </div>
</template>

<style lang="scss">
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
    z-index: 50;
    position: relative;
}

.buffer-page {
    z-index: 100;
    position: fixed;
    pointer-events: none;
    height: var(--100vh);
}
</style>