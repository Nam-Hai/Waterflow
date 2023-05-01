<template>
    <NuxtLink to="/">
        <div class="br-wrapper">
            <div class="content-wrapper">
                <div>Return</div>
                <div class="bg-hover">
                    Return
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.br-wrapper {
    background-color: #00000017;
    border: 1px solid #ffffff15;
    border-radius: 0.2rem;
    align-items: center;


    font-size: 1.6rem;
    color: white;
    text-transform: uppercase;
    overflow: hidden;
    position: relative;
    width: 33rem;
    height: 4rem;

    >div>div {
        width: 33rem;
        height: 4rem;
        position: relative;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .bg-hover {
        // position: absolute;
        background-color: #87F062;
    }

    >div {
        transition: transform 200ms ease-in-out;
        transform: translateY(0%);
    }

    &:hover {
        > div {
            transform: translateY(-50%);
        }
    }
}
</style>