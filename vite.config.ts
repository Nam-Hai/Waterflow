import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
   build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
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
