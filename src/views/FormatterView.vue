<template>
  <div class="h-screen flex overflow-hidden bg-background">
    <!-- 侧边栏 - Prettier 配置 -->
    <div :class="[
      'border-r bg-card/50 backdrop-blur transition-all duration-300',
      sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
    ]">
      <div class="p-6 space-y-6 w-80">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Prettier 配置</h2>
          <Button size="icon" variant="ghost" @click="sidebarOpen = false">
            <X class="h-4 w-4" />
          </Button>
        </div>

        <div class="space-y-4">
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
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部工具栏 -->
      <div class="border-b bg-card/50 backdrop-blur">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Button size="icon" variant="ghost" @click="sidebarOpen = !sidebarOpen" class="hover:bg-accent">
                <Settings2 class="h-4 w-4" />
              </Button>

              <div class="flex items-center gap-2">
                <Label class="text-muted-foreground">语言:</Label>
                <Select v-model="lang">
                  <SelectTrigger class="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="js">JavaScript</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button @click="handleFormat" :disabled="formatting || !input">
                <Sparkles class="h-4 w-4 mr-2" />
                {{ formatting ? '格式化中...' : '格式化' }}
              </Button>

              <Button variant="outline" @click="openRulesModal = true">
                <Replace class="h-4 w-4 mr-2" />
                替换规则配置
              </Button>
            </div>

            <div class="flex items-center gap-2">
              <Button variant="outline" size="icon" @click="handleClear" :disabled="!input && !output">
                <Trash2 class="h-4 w-4" />
              </Button>

              <Button @click="copyOutput" :disabled="!output">
                <Copy class="h-4 w-4 mr-2" />
                复制结果
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑器区域 -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
        <!-- 左侧：输入 -->
        <div class="border-r flex flex-col h-full">
          <div class="px-6 py-3 border-b bg-muted/30">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium">原始代码</Label>
              <span class="text-xs text-muted-foreground">
                {{ input.length }} 字符
              </span>
            </div>
          </div>
          <div class="flex-1 relative">
            <Textarea v-model="input" placeholder="在此粘贴待格式化的代码..."
              class="absolute inset-0 m-0 border-0 rounded-none resize-none font-mono text-sm p-6 h-full"
              :class="{ 'text-muted-foreground': !input }" />
          </div>
        </div>

        <!-- 右侧：输出 -->
        <div class="flex flex-col h-full bg-muted/5">
          <div class="px-6 py-3 border-b bg-muted/30">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium">格式化结果</Label>
              <span class="text-xs text-muted-foreground">
                {{ output.length }} 字符
              </span>
            </div>
          </div>
          <div class="flex-1 relative overflow-auto">
            <pre v-if="output" class="absolute inset-0 m-0 p-6 font-mono text-sm"><code>{{ output }}</code></pre>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-muted-foreground">
                <FileCode2 class="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p class="text-sm">格式化后的代码将显示在这里</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 替换规则配置弹窗 -->
    <RulesModal :open="openRulesModal" @update:open="openRulesModal = $event" :model-value="rules"
      @save="onSaveRules" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import RulesModal from "@/components/RulesModal.vue";
import { rules, prettierOptions } from "@/composables/useLocalSettings";
import { applyReplacements } from "@/lib/replacer";
import { formatWithPrettier, type Lang } from "@/lib/prettier";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Settings2,
  X,
  Sparkles,
  Replace,
  Copy,
  Trash2,
  FileCode2
} from "lucide-vue-next";

const { toast } = useToast();

const input = ref("");
const output = ref("");
const lang = ref<Lang>("html");
const formatting = ref(false);
const sidebarOpen = ref(false);
const openRulesModal = ref(false);

async function handleFormat() {
  if (!input.value) {
    toast({
      title: "请输入代码",
      description: "请先在左侧输入要格式化的代码",
      variant: "destructive",
    });
    return;
  }

  formatting.value = true;
  try {
    // 1) 字符串替换
    const preprocessed = applyReplacements(input.value, rules.value);
    // 2) Prettier 格式化
    output.value = await formatWithPrettier(preprocessed, lang.value, prettierOptions.value);

    toast({
      title: "格式化成功",
      description: "代码已成功格式化",
    });
  } catch (err: any) {
    toast({
      title: "格式化失败",
      description: err?.message ?? String(err),
      variant: "destructive",
    });
  } finally {
    formatting.value = false;
  }
}

async function copyOutput() {
  if (!output.value) return;

  try {
    // 检查是否支持 clipboard API
    if (!navigator.clipboard) {
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement("textarea");
      textArea.value = output.value;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        toast({
          title: "复制成功",
          description: "格式化后的代码已复制到剪贴板",
        });
      } catch (err) {
        toast({
          title: "复制失败",
          description: "请手动选择并复制代码",
          variant: "destructive",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    } else {
      await navigator.clipboard.writeText(output.value);
      toast({
        title: "复制成功",
        description: "格式化后的代码已复制到剪贴板",
      });
    }
  } catch (err) {
    toast({
      title: "复制失败",
      description: "请手动选择并复制代码",
      variant: "destructive",
    });
  }
}

function handleClear() {
  input.value = "";
  output.value = "";
  toast({
    title: "已清空",
    description: "输入和输出已清空",
  });
}

function onSaveRules(newRules: any) {
  rules.value = newRules;
  // 保存后可立即尝试重新格式化
  if (input.value && output.value) {
    handleFormat();
  }
}

// 示例占位
watch(lang, (l) => {
  if (!input.value) {
    const examples = {
      html: `<div   class="container"  >
    <h1>Hello World</h1>
        <p>This is a   test</p>
</div>`,
      js: `const obj={name:"test",age:25,items:[1,2,3]};function calculate(x,y){return x+y;}`,
      json: `{"name":"demo","version":"1.0.0","dependencies":{"vue":"^3.0.0","vite":"^4.0.0"},"list":[1,2,3,4,5]}`,
      css: `body{margin:0;padding:0;font-family:sans-serif}.container{width:100%;max-width:1200px;margin:0 auto}`
    };
    input.value = examples[l] || "";
  }
});

// 监听 Prettier 配置变化，自动重新格式化
watch(prettierOptions, () => {
  if (input.value && output.value) {
    handleFormat();
  }
}, { deep: true });
</script>