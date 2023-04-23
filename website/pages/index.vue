<template>
    <div id="home" class="page">
        <WaterflowTitle />

        <div class="grid-container">
            <div class="left">
                <h2>Do you even <span class="font-museo">flow</span> ?</h2>
                <p>Give your project by the power of the nature. Go with the flow and create transitions that you always
                    dreamed of. Enable your creativity with Waterflow and make your website stand out. A Vue.js library
                    for page transitions crossfade.</p>
                <h3>Fast. Light. Modular. For <span class="secondary">Vue.js</span>.</h3>

                <Clipboard />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

.page {
    height: 100vh;
    background-color: black;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-container {
    padding: 2.4rem 10rem 4rem;
    display: flex;
    flex-direction: column;

    .left {
        display: flex;
        flex-direction: column;
        row-gap: 1.6rem;
        width: 50%;
    }
}

h2 {
    font-size: 8rem;
    font-weight: 700;
    line-height: 100%;
}

p {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 100%;
}

h3 {
    font-size: 4rem;
    font-weight: 700;
    line-height: 100%;
}
</style>