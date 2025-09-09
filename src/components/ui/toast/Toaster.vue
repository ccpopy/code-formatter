<template>
  <Teleport to="body">
    <div
      class="fixed bottom-0 right-0 z-[100] flex max-h-screen flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <TransitionGroup enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200" leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0">
        <div v-for="item in toasts" :key="item.id" :class="[
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          item.variant === 'destructive'
            ? 'border-destructive bg-destructive text-white'
            : 'border-border bg-background'
        ]">
          <div class="grid gap-1">
            <div v-if="item.title" class="text-sm font-semibold">
              {{ item.title }}
            </div>
            <div v-if="item.description" class="text-sm opacity-90">
              {{ item.description }}
            </div>
          </div>
          <button @click="dismiss(item.id)"
            class="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none group-hover:opacity-100">
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import { useToast } from "./use-toast";

const { toasts, dismiss } = useToast();
</script>