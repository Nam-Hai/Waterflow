<template>
    <main ref="main">
        <BazButton />
    </main>
</template>

<script lang="ts" setup>
import { useDefaultFlow } from '~/pages.transition/defaultFlow';

const main = useTemplateRef("main")
useDefaultFlow(main)
</script>

<style scoped lang="scss">
main {
    background-color: red;
}
</style>