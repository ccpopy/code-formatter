import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
// 导入@tailwindcss/vite
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true
  },
  // 非 hash 路由，history 模式默认即可
});
