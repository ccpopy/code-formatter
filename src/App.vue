<template>
  <div class="min-h-screen bg-background flex">
    <!-- 侧边栏 - Prettier 配置 -->
    <SidebarProvider>
      <div class="flex h-screen w-full">
        <!-- 侧边栏 - Prettier 配置 -->
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Prettier 配置</SidebarGroupLabel>
              <SidebarGroupContent class="mt-2">

                <div class="space-y-4 px-4">
                  <div class="space-y-2">
                    <Label for="tabWidth">Tab 宽度</Label>
                    <Input id="tabWidth" type="number" min="1" v-model.number="prettierOptions.tabWidth" />
                  </div>

                  <div class="space-y-2">
                    <Label for="printWidth">每行最大字符数</Label>
                    <Input id="printWidth" type="number" min="40" v-model.number="prettierOptions.printWidth" />
                  </div>

                  <div class="flex items-center justify-between">
                    <Label>使用 Tab</Label>
                    <Switch v-model:checked="prettierOptions.useTabs" />
                  </div>

                  <div class="flex items-center justify-between">
                    <Label>分号</Label>
                    <Switch v-model:checked="prettierOptions.semi" />
                  </div>

                  <div class="flex items-center justify-between">
                    <Label>单引号</Label>
                    <Switch v-model:checked="prettierOptions.singleQuote" />
                  </div>

                  <div class="flex items-center justify-between">
                    <Label>括号空格</Label>
                    <Switch v-model:checked="prettierOptions.bracketSpacing" />
                  </div>

                  <div class="flex items-center justify-between">
                    <Label>括号同行</Label>
                    <Switch v-model:checked="prettierOptions.bracketSameLine" />
                  </div>

                  <div class="space-y-2">
                    <Label>尾随逗号</Label>
                    <Select v-model="prettierOptions.trailingComma">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">none</SelectItem>
                        <SelectItem value="es5">es5</SelectItem>
                        <SelectItem value="all">all</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="space-y-2">
                    <Label>HTML 空格敏感度</Label>
                    <Select v-model="prettierOptions.htmlWhitespaceSensitivity">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="css">css</SelectItem>
                        <SelectItem value="strict">strict</SelectItem>
                        <SelectItem value="ignore">ignore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div class="px-2 text-xs text-muted-foreground text-center">
              配置会自动保存
            </div>
          </SidebarFooter>
        </Sidebar>

        <!-- 主内容区 -->
        <SidebarInset>
          <div class="flex-1 flex flex-col">
            <!-- 顶部栏 -->
            <header class="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
              <div class="w-full px-6 py-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <SidebarTrigger />
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>

    <!-- Toast 通知容器 -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { Toaster } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prettierOptions } from "@/composables/useLocalSettings";

</script>