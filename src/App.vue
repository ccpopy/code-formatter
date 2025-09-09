<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部栏 -->
    <header class="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
      <div class="container mx-auto px-6 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md" />
            <div>
              <h1 class="text-lg font-semibold tracking-tight">
                代码格式化工具
              </h1>
              <p class="text-xs text-muted-foreground">
                Powered by Prettier & Vue
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Toast 通知容器 -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from "@/components/ThemeToggle.vue";
import { Toaster } from "@/components/ui/toast";
</script>