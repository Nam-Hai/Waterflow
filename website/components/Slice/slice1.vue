<template>
    <div class="slice wrapper">

        <div class="container">
            <h2>Create smooth page transition</h2>
            <p>Sometimes, Vue.js API limits your creativity and imagination to ship outstanding page transition. Enable user
                to
                flow between pages to create the most smooth experience possible.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
useLenisScroll(() => {
})

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

$bg: #E2383B;
$soft: #C12B2D;

.wrapper.slice {
    position: relative;
    height: 100vh;
    width: 100vw;


    .container {
        padding-top: 28rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "HelveticaNeue";
        text-transform: uppercase;
        flex-direction: column;
        text-align: center;
        font-weight: 700;

        h2 {
            width: 121.9rem;
            font-size: 12.8rem;
            color: $secondary;
        }

        p {
            font-size: 3.2rem;
            width: 82.3rem;
            color: $soft;
        }
    }

}
</style>