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
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M667.503277 152.76147L871.148531 356.405724c6.247946 6.248946 6.247946 16.37986 0 22.627806l-633.562568 633.562568a16.001863 16.001863 0 0 1-3.718968 2.772976l-0.309998 0.162999a15.991863 15.991863 0 0 1-6.94394 1.745985l-0.339997 0.004a15.949863 15.949863 0 0 1-11.314903-4.68596L11.313903 808.950844c-6.248946-6.248946-6.248946-16.37986 0-22.627806L644.874471 152.76147c6.248946-6.248946 16.37986-6.248946 22.627806 0z m181.002448 425.231354l0.364997 0.177999 72.652377 36.349688 72.652377-36.349688a20.442825 20.442825 0 0 1 23.596797 3.845967 20.459825 20.459825 0 0 1 4.122965 23.2398l-0.175998 0.364997-36.439688 72.677377 36.439688 72.677377a20.459825 20.459825 0 0 1-3.717969 23.833796 20.442825 20.442825 0 0 1-23.459798 3.902966l-0.365997-0.183998-72.652377-36.450688-72.652377 36.449688a20.442825 20.442825 0 0 1-23.714797-3.814968 20.459825 20.459825 0 0 1-3.908967-23.371799l0.181999-0.364997 36.336688-72.677377-36.336688-72.677377a20.459825 20.459825 0 0 1 3.822967-23.625797 20.442825 20.442825 0 0 1 23.253801-4.002966zM656.189374 231.956791l-90.509224 90.509224 135.762836 135.763836 90.509224-90.509224L656.190374 231.956791zM848.623724 2.063762l0.364997 0.181999L921.592098 38.581449l72.705377-36.336688a20.423825 20.423825 0 0 1 23.602797 3.822967 20.458825 20.458825 0 0 1 3.997966 23.253801l-0.177998 0.364996-36.413688 72.652378 36.413688 72.652377a20.458825 20.458825 0 0 1-3.714969 23.825795 20.423825 20.423825 0 0 1-23.443799 3.901967l-0.365996-0.183999-72.603378-36.439687-72.603377 36.439687a20.423825 20.423825 0 0 1-23.809796-3.717968 20.458825 20.458825 0 0 1-3.899967-23.459799l0.184999-0.365996 36.413687-72.652377-36.413687-72.652378a20.458825 20.458825 0 0 1 3.811967-23.714796 20.423825 20.423825 0 0 1 23.3478-3.908967z m-563.195171 0l0.364997 0.181999L358.396927 38.581449l72.603378-36.336688a20.423825 20.423825 0 0 1 23.580797 3.843967 20.458825 20.458825 0 0 1 4.119965 23.231801l-0.175998 0.365996-36.413688 72.652378 36.413688 72.652377a20.458825 20.458825 0 0 1-3.714969 23.825795 20.423825 20.423825 0 0 1-23.443799 3.901967l-0.365996-0.183999-72.603378-36.439687-72.603377 36.439687a20.423825 20.423825 0 0 1-23.809796-3.717968 20.458825 20.458825 0 0 1-3.899967-23.459799l0.184999-0.365996 36.413687-72.652377-36.413687-72.652378a20.458825 20.458825 0 0 1 3.811967-23.714796 20.423825 20.423825 0 0 1 23.3478-3.908967z"
                        fill="currentColor"></path>
                    </svg>
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

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  font-size: 2em;
  margin: 0 0.5rem;
  color: oklch(0.606 0.25 292.717);
}
</style>