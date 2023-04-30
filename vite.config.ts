import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
   build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "@nam-hai/water-flow",
      fileName: "@nam-hai/water-flow",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
