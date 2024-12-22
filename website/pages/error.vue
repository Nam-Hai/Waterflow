<template>
    <div class="error-page">
        <div class="content__wrapper">
            <h1>
                Oops! Page not found.
            </h1>
            <p>
                Error : {{ error?.statusCode || 500 }}<br>
                {{ error?.statusMessage || 'An unexpected error occurred' }}
            </p>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <!-- <NuxtLink to="/">Go back to Home</NuxtLink> -->
            <NuxtLink @click="handleError">Go back to Home</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const { query, params } = useQuery()
const error = query

const handleError = () => clearError({ redirect: '/' })

</script>

<style scoped>
.error-page {
    padding-top: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content__wrapper {
    width: 40rem;
    padding: 2rem;
    background-color: #ff6b6b;
}

h1 {
    font-size: 3rem;
    color: white;
}


a,
p {
    font-size: 2rem;
}
</style>
