<template>
  <Button variant="ghost" size="icon" @click="toggleTheme" class="hover:bg-accent">
    <Sun v-if="themeMode === 'dark'" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
    <span class="sr-only">切换主题</span>
  </Button>
</template>

<script setup lang="ts">
import { themeMode } from "@/composables/useLocalSettings";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-vue-next";

// 主题切换
function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
}
</script>