<template>
  <Button variant="ghost" size="icon" @click="toggleTheme" class="hover:bg-accent">
    <Sun v-if="currentTheme === 'dark'" class="h-5 w-5" />
    <Moon v-else-if="currentTheme === 'light'" class="h-5 w-5" />
    <Monitor v-else class="h-5 w-5" />
    <span class="sr-only">切换主题</span>
  </Button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { themeMode } from "@/composables/useLocalSettings";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-vue-next";

// 计算当前实际显示的主题
const currentTheme = computed(() => {
  if (themeMode.value === 'system') {
    // 检测系统主题
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  }
  return themeMode.value;
});

// 循环切换：light -> dark -> system -> light
function toggleTheme() {
  const themes = ['light', 'dark', 'system'] as const;
  const currentIndex = themes.indexOf(themeMode.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  themeMode.value = themes[nextIndex];
}
</script>