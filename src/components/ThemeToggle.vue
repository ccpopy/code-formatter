<template>
  <div class="flex items-center gap-2">
    <Select v-model="mode">
      <SelectTrigger class="w-[140px]">
        <SelectValue placeholder="主题" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">系统（默认）</SelectItem>
        <SelectItem value="light">浅色</SelectItem>
        <SelectItem value="dark">深色</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { themeMode } from "@/composables/useLocalSettings";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mode = computed({
  get: () => themeMode.value,
  set: (v) => (themeMode.value = v),
});
</script>
