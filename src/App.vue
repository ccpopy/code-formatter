<template>
  <div class="min-h-full">
    <!-- 顶部栏 -->
    <header
      class="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-slate-950/50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="size-8 rounded bg-slate-900 dark:bg-slate-100" />
          <h1 class="text-lg font-semibold tracking-tight">
            代码格式化工具
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-4">
      <RouterView />
    </main>

    <footer class="container mx-auto px-4 py-6 text-center text-xs text-slate-500">
      © 2025 代码格式化工具
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from "@/components/ThemeToggle.vue";
</script>
