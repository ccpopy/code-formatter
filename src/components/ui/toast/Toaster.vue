<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex max-h-screen flex-col gap-2 sm:max-w-[420px]">
      <TransitionGroup enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200" leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0">
        <div v-for="item in toasts" :key="item.id" :class="[
          'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
          item.variant === 'destructive'
            ? 'border-destructive/50 bg-destructive/10 text-destructive dark:bg-destructive/20'
            : item.variant === 'success'
              ? 'border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400'
              : item.variant === 'warning'
                ? 'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'border-border bg-background'
        ]">
          <!-- 图标 -->
          <div class="flex-shrink-0 mt-0.5">
            <CheckCircle2 v-if="item.variant === 'success'" class="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertCircle v-else-if="item.variant === 'destructive'" class="h-5 w-5 text-destructive" />
            <AlertTriangle v-else-if="item.variant === 'warning'"
              class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <Info v-else class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>

          <!-- 内容 -->
          <div class="grid gap-1 flex-1">
            <div v-if="item.title" class="text-sm font-semibold">
              {{ item.title }}
            </div>
            <div v-if="item.description" class="text-sm opacity-90 whitespace-pre-line break-words">
              {{ item.description }}
            </div>
          </div>

          <!-- 关闭按钮 -->
          <button @click="dismiss(item.id)"
            class="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none">
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-vue-next";
import { useToast } from "./use-toast";

const { toasts, dismiss } = useToast();
</script>