<template>
    <main ref="main">
        <h1 v-if="data">
            slug : {{ data.slug }}
        </h1>
    </main>
</template>
<script lang="ts" setup>
import { useFlowProvider } from '~/lib/waterflow/FlowProvider';
import { useDefaultFlow } from '~/pages.transition/defaultFlow';
const { currentRoute } = useFlowProvider()
const routeSlug = currentRoute.value.params.slug
console.log(routeSlug, currentRoute.value);
const slug = typeof routeSlug === "string" ? routeSlug : routeSlug[0]


const main = useTemplateRef("main")
// usePageFlow need to be on top of the async Pages
useDefaultFlow(main)

const { data, error } = await useAsyncData(`slug-${slug}`, async () => {
    const slugs = await $fetch("/api/getSlugs")
    const include = slugs.map(el => el.name).includes(slug)
    if (!include) throw "wrong slug"

    return { slug: currentRoute.value.params.slug }
});

if (error.value) {
    flowCreateError({ statusCode: 404, statusMessage: "Page Not Found" })
}
</script>

<style scoped lang="scss"></style>