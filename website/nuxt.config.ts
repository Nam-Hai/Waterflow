// https://nuxt.com/docs/api/configuration/nuxt-config
import mocks from "./server/api/mocks.json"


export default defineNuxtConfig({
    compatibilityDate: "2024-11-23",
    ssr: true,
    pages: true,
    devtools: { enabled: true },
    devServer: {
        host: "0.0.0.0",
    },
    css: ["@/styles/core.scss"],
    app: {
        layoutTransition: false,
        head: {
            link: [
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
            ],
            meta: [
                {
                    name: "description",
                    content: "Waterflow"
                },
                {
                    charset: 'utf-8'
                }
            ],
            title: 'Waterflow'
        }
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/styles/_shared.scss" as *;',
                    api: "modern-compiler",
                    quietDeps: true,
                    silenceDeprecations: ["mixed-decls"],
                },
            },
        },
    },
    vue: {
        runtimeCompiler: true,
    },

    routeRules: {
        "/": { prerender: true },
        "/foo": { prerender: true },
        "/baz": { prerender: true },
        // "/work/**": { prerender: true },
        '/work/**': { isr: true },
        "/api/**": { isr: true },
    },
})
