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
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: 'favicon-32x32.png'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16x',
                    href: 'favicon-16x16.png'
                },
                {
                    rel: 'manifest',
                    href: 'site.webmanifest'
                }
            ]
        }
    }
})
