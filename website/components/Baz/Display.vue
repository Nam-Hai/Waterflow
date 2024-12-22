<template>
    Baz counter {{ count }}
</template>
<script setup lang="ts">
const { count } = defineProps<{ count: number }>()
</script>

<style scoped lang="scss"></style>