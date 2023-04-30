// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    css: [
        // '@/styles/shared.scss',
        '@/styles/core.scss',
        '@/styles/app/index.scss'
    ],
    app: {
        head: {
            link: [
                {
                    rel: "preload",
                    href: "fonts/Amarante-Regular.ttf",
                    as: 'font',
                    type: "font/ttf",
                    crossorigin: 'anonymous'
                }
            ]
        }
    }
})
