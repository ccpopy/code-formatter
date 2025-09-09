<template>
  <div class="h-full flex flex-col bg-background">
    <!-- 顶部工具栏 -->
    <div class="border-b bg-card/50 backdrop-blur flex-shrink-0">
      <div class="px-6 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
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
    <div class="flex-1 p-4 min-h-0 bg-muted/30">
      <div class="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 左侧：输入 -->
        <Card class="flex flex-col gap-0 p-0 overflow-hidden h-full min-h-0">
          <div class="px-4 py-3 border-b bg-card shrink-0">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M608.085333 520.021333m-163.84 0a163.84 163.84 0 1 0 327.68 0 163.84 163.84 0 1 0-327.68 0Z"
                    fill="currentColor" opacity=".3"></path>
                  <path
                    d="M285.013333 299.008a30.208 30.208 0 0 0-43.008 0L50.176 490.666667a30.378667 30.378667 0 0 0 0 42.837333l191.829333 191.488A30.378667 30.378667 0 0 0 285.013333 682.666667l-170.666666-170.666667 170.666666-170.666667a30.378667 30.378667 0 0 0 0-42.325333zM973.824 490.666667L781.994667 299.008A30.378667 30.378667 0 0 0 738.986667 341.333333l170.666666 170.666667-170.666666 170.666667a30.378667 30.378667 0 0 0 43.008 42.837333l191.829333-192a30.378667 30.378667 0 0 0 0-42.837333zM609.621333 283.818667l-213.333333 374.442666-30.549333 53.589334c-17.92 31.402667 30.72 59.904 48.64 28.330666l213.333333-374.442666 30.549333-53.589334c17.066667-31.402667-30.72-59.904-48.64-28.330666z"
                    fill="currentColor"></path>
                </svg>
                <span>原始代码</span>
              </Label>
              <span class="text-xs text-muted-foreground">
                {{ input.length }} 字符
              </span>
            </div>
          </div>
          <div class="flex-1 relative min-h-0">
            <div class="absolute inset-0 overflow-auto">
              <ContextMenu>
                <ContextMenuTrigger as-child>
                  <Textarea ref="textareaRef" v-model="input" placeholder="在此粘贴待格式化的代码…"
                    class="w-full h-full min-h-0 outline-none m-0 border-0 rounded-none resize-none font-mono text-sm p-4 bg-transparent scrollbar-custom"
                    :class="{ 'text-muted-foreground': !input }" @mouseup="updateCursorPosition"
                    @keyup="updateCursorPosition" @contextmenu="updateCursorPosition" />
                </ContextMenuTrigger>
                <ContextMenuContent class="w-64" v-if="validRules.length > 0">
                  <ContextMenuLabel>插入替换文本</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuSub v-for="rule in validRules" :key="rule.remark">
                    <ContextMenuSubTrigger>
                      <FileText class="mr-2 h-4 w-4" />
                      {{ rule.remark }}
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent class="w-48">
                      <ContextMenuLabel class="text-xs text-muted-foreground mb-2">
                        将替换以下字符串:
                      </ContextMenuLabel>
                      <div class="px-2 pb-2 space-y-1">
                        <div v-for="(key, idx) in rule.keys" :key="idx"
                          class="text-xs font-mono bg-muted px-2 py-1 rounded-sm text-muted-foreground">
                          {{ key }}
                        </div>
                      </div>
                      <ContextMenuSeparator />
                      <ContextMenuItem @click="insertTextAtCursor(rule.value)">
                        <Type class="mr-2 h-4 w-4" />
                        插入: {{ rule.value }}
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
                <ContextMenuContent v-else>
                  <ContextMenuItem disabled>
                    <AlertCircle class="mr-2 h-4 w-4" />
                    暂无可用的替换规则
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </div>
        </Card>

        <!-- 右侧：输出 -->
        <Card class="flex flex-col gap-0 p-0 overflow-hidden h-full min-h-0">
          <div class="px-4 py-3 border-b bg-card shrink-0">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M808.562 336.1l85.618-85.561a28.444 28.444 0 0 0 3.242-36.295l-3.242-3.983-80.498-80.44a28.444 28.444 0 0 0-36.295-3.243l-3.926 3.242-85.39 85.448 117.76 117.76a43.236 43.236 0 0 1 2.73 3.072z m-60.018 60.017a43.236 43.236 0 0 1-3.072-2.787l-117.76-117.76L129.82 773.46a28.444 28.444 0 0 0-3.242 36.295l3.242 3.983 80.498 80.44a28.444 28.444 0 0 0 36.295 3.243l3.926-3.242 498.005-498.063zM954.482 149.96a113.778 113.778 0 0 1 0 160.882L310.84 954.48a113.778 113.778 0 0 1-160.882 0l-80.44-80.44a113.778 113.778 0 0 1 0-160.882l643.64-643.64a113.778 113.778 0 0 1 160.882 0l80.44 80.44z m-670.038 20.708l-73.557-40.22 73.557-40.221 40.22-73.558 40.221 73.558 73.558 40.22-73.558 40.22-40.22 73.558-40.22-73.557zM133.916 378.084L97.11 358.002l36.807-20.139 20.082-36.75 20.139 36.75 36.75 20.139-36.75 20.082-20.139 36.807-20.082-36.807z m602.17 478.72l-110.308-60.36 110.364-60.302 60.302-110.364 60.303 110.364 110.364 60.302-110.364 60.303-60.303 110.364-60.302-110.364z"
                    fill="currentColor"></path>
                </svg>
                <span>格式化结果</span>
              </Label>
              <span class="text-xs text-muted-foreground">
                {{ output.length }} 字符
              </span>
            </div>
          </div>
          <div class="flex-1 relative min-h-0 bg-muted/10">
            <div v-if="output" class="absolute inset-0 overflow-auto scrollbar-custom">
              <pre class="m-0 p-4 font-mono text-sm min-h-full"><code>{{ output }}</code></pre>
            </div>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-muted-foreground">
                <FileCode2 class="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p class="text-sm">格式化后的代码将显示在这里</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- 替换规则配置弹窗 -->
    <RulesModal :open="openRulesModal" @update:open="openRulesModal = $event" :model-value="rules"
      @save="onSaveRules" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import RulesModal from "@/components/RulesModal.vue";
import { rules, prettierOptions } from "@/composables/useLocalSettings";
import { applyReplacements } from "@/lib/replacer";
import { formatWithPrettier, type Lang } from "@/lib/prettier";
import type { ReplaceRule } from "@/lib/replacer";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ComponentPublicInstance } from "vue";
import { Label } from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Sparkles,
  Replace,
  Copy,
  Trash2,
  FileCode2,
  FileText,
  Type,
  AlertCircle
} from "lucide-vue-next";

const { toast } = useToast();

const input = ref("");
const output = ref("");
const lang = ref<Lang>("html");
const formatting = ref(false);
const openRulesModal = ref(false);
const textareaRef = ref<ComponentPublicInstance | null>(null);
const cursorPosition = ref(0);

// 计算有效的规则（备注不为空，目标文本不为空）
const validRules = computed(() => {
  return rules.value.filter((rule: ReplaceRule) =>
    rule.remark &&
    rule.remark.trim() !== "" &&
    rule.value &&
    rule.value.trim() !== ""
  );
});

// 更新光标位置
function updateCursorPosition() {
  if (textareaRef.value && textareaRef.value.$el) {
    const textarea = textareaRef.value.$el as HTMLTextAreaElement;
    cursorPosition.value = textarea.selectionStart || 0;
  }
}

// 在光标位置插入文本
function insertTextAtCursor(text: string) {
  if (!textareaRef.value?.$el) return;

  const textarea = textareaRef.value.$el as HTMLTextAreaElement;
  const start = cursorPosition.value;
  const before = input.value.substring(0, start);
  const after = input.value.substring(start);

  // 更新输入值
  input.value = before + text + after;

  // 设置焦点并更新光标位置
  textarea.focus();
  const newPosition = start + text.length;

  // 使用 nextTick 确保 DOM 更新后再设置光标位置
  setTimeout(() => {
    textarea.setSelectionRange(newPosition, newPosition);
    cursorPosition.value = newPosition;
  }, 0);

  toast({
    title: "已插入文本",
    description: `已在光标位置插入: ${text}`,
    variant: "success",
    duration: 2000,
  });
}

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
    const preprocessed = applyReplacements(input.value, rules.value);
    output.value = await formatWithPrettier(preprocessed, lang.value, prettierOptions.value);

    toast({
      title: "格式化成功",
      description: "代码已成功格式化",
      variant: "success",
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
    if (!navigator.clipboard) {
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
          variant: "success",
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
        variant: "success",
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
    variant: "info",
  });
}

function onSaveRules(newRules: any) {
  rules.value = newRules;
  if (input.value && output.value) {
    handleFormat();
  }
}

// 示例
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

watch(prettierOptions, () => {
  if (input.value && output.value) {
    handleFormat();
  }
}, { deep: true });
</script>
<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  font-size: 16px;
}
</style>