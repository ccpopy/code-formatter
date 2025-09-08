<template>
  <div class="space-y-4">
    <!-- 工具栏 -->
    <Card>
      <div class="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <Label>语言</Label>
            <Select v-model="lang">
              <SelectTrigger class="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center gap-2">
            <Button :disabled="formatting" @click="handleFormat">
              <span v-if="!formatting">格式化</span>
              <span v-else>格式化中…</span>
            </Button>
            <Button variant="outline" @click="openSettings = true">配置</Button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="secondary" @click="copyOutput" :disabled="!output">
            复制结果
          </Button>
        </div>
      </div>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 左：输入 -->
      <Card class="h-full">
        <div class="p-4">
          <Label for="input">原始代码</Label>
          <Textarea
            id="input"
            v-model="input"
            placeholder="在此粘贴待格式化的 HTML / JS / JSON / CSS 代码…"
            class="mt-2 font-mono text-sm leading-5 h-72 lg:h-[70vh] resize-none"
          />
        </div>
      </Card>

      <!-- 右：输出 -->
      <Card class="h-full">
        <div class="p-4 space-y-2">
          <div class="flex items-center justify-between gap-2">
            <Label>格式化结果</Label>
            <Button size="sm" variant="outline" @click="copyOutput" :disabled="!output">复制</Button>
          </div>
          <div class="mt-2 border rounded-md bg-slate-50 dark:bg-slate-900">
            <pre class="p-3 overflow-auto text-sm leading-5 font-mono whitespace-pre-wrap min-h-[14rem] lg:min-h-[70vh]">
<code>{{ output }}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>

    <!-- 复制成功提示 -->
    <Alert v-if="copied" class="border-green-500">
      <AlertTitle>已复制</AlertTitle>
      <AlertDescription>格式化后的代码已复制到剪贴板。</AlertDescription>
    </Alert>

    <!-- 异常提示 -->
    <Alert v-if="errorMsg" variant="destructive">
      <AlertTitle>格式化失败</AlertTitle>
      <AlertDescription class="whitespace-pre-wrap">{{ errorMsg }}</AlertDescription>
    </Alert>

    <!-- 配置弹窗 -->
    <SettingsModal
      :open="openSettings"
      @update:open="(v:boolean)=> openSettings = v"
      :model-value-rules="rules"
      :model-value-prettier="prettierOptions"
      @save="onSaveSettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SettingsModal from "@/components/SettingsModal.vue";
import { rules, prettierOptions } from "@/composables/useLocalSettings";
import { applyReplacements } from "@/lib/replacer";
import { formatWithPrettier, type Lang } from "@/lib/prettier";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const input = ref("");
const output = ref("");
const lang = ref<Lang>("html");
const formatting = ref(false);
const copied = ref(false);
const errorMsg = ref("");
const openSettings = ref(false);

async function handleFormat() {
  errorMsg.value = "";
  formatting.value = true;
  try {
    // 1) 字符串替换
    const preprocessed = applyReplacements(input.value, rules.value);
    // 2) Prettier 格式化
    output.value = await formatWithPrettier(preprocessed, lang.value, prettierOptions.value);
  } catch (err: any) {
    errorMsg.value = err?.message ?? String(err);
  } finally {
    formatting.value = false;
  }
}

async function copyOutput() {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch (err) {
    errorMsg.value = "复制失败：" + (err as any)?.message;
  }
}

function onSaveSettings(payload: any) {
  // 外部状态由 useLocalSettings 响应式持久化，这里仅更新引用
  rules.value = payload.rules;
  prettierOptions.value = payload.prettier;
  // 保存后可立即尝试重新格式化
  if (input.value) handleFormat();
}

// 示例占位，方便体验
watch(lang, (l) => {
  if (!input.value) {
    if (l === "html") input.value = "<div class='x'><span>hello</span></div>";
    if (l === "js") input.value = "const x={a:1,b:2}; function f(){return x;}";
    if (l === "json") input.value = '{"name":"demo","list":[1,2,3]}';
    if (l === "css") input.value = "body{color:red}.btn{padding:4px 8px}";
  }
});
</script>
