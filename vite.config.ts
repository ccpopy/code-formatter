import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
// 导入@tailwindcss/vite
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'prettier': ['prettier'],
          // Vue 生态系统
          'vue-vendor': ['vue', 'vue-router', '@vueuse/core'],
          // UI 组件库
          'ui-vendor': [
            'radix-vue',
            'reka-ui',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'vue-sonner'
          ],
          // 图标库
          'icons': ['lucide-vue-next']
        },
      },
    },
  }
});
