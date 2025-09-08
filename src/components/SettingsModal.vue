<template>
  <Dialog :open="open" @update:open="onUpdateOpen">
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>格式化配置</DialogTitle>
        <DialogDescription>
          上半部分为 <b>替换规则</b>；下半部分为 <b>Prettier 配置</b>。保存后将持久化在 localStorage。
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        <!-- 替换规则 -->
        <section class="space-y-3">
          <h3 class="font-medium text-base">替换规则</h3>
          <div class="grid grid-cols-12 gap-2 items-end">
            <div class="col-span-12 lg:col-span-5">
              <Label for="keys">要替换的字符串（可多个，用逗号分隔）</Label>
              <Input id="keys" v-model="draftRule.keys" placeholder="{opentype},-gkfs" />
            </div>
            <div class="col-span-12 lg:col-span-4">
              <Label for="value">替换为</Label>
              <Input id="value" v-model="draftRule.value" placeholder="主动公开" />
            </div>
            <div class="col-span-12 lg:col-span-3">
              <Label for="remark">备注</Label>
              <Input id="remark" v-model="draftRule.remark" placeholder="公开方式" />
            </div>
            <div class="col-span-12 flex gap-2">
              <Button class="w-28" @click="addOrUpdateRule">
                {{ editingIndex === -1 ? '添加规则' : '保存修改' }}
              </Button>
              <Button variant="secondary" class="w-28" @click="resetDraft">重置</Button>
            </div>
          </div>

          <div v-if="localRules.length" class="border rounded-md divide-y">
            <div
              v-for="(r, idx) in localRules"
              :key="idx"
              class="p-3 grid grid-cols-12 gap-2 items-center"
            >
              <div class="col-span-12 sm:col-span-5 truncate">
                <div class="text-xs text-slate-500 mb-1">键</div>
                <div class="font-mono text-sm">{{ r.keys }}</div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <div class="text-xs text-slate-500 mb-1">替换为</div>
                <div class="font-mono text-sm">{{ r.value }}</div>
              </div>
              <div class="col-span-12 sm:col-span-2">
                <div class="text-xs text-slate-500 mb-1">备注</div>
                <div class="text-sm">{{ r.remark }}</div>
              </div>
              <div class="col-span-12 sm:col-span-1 flex gap-2 justify-end">
                <Button size="sm" variant="outline" @click="editRule(idx)">编辑</Button>
                <Button size="sm" variant="destructive" @click="removeRule(idx)">删除</Button>
              </div>
            </div>
          </div>
          <Alert v-else class="">
            <AlertTitle>暂无规则</AlertTitle>
            <AlertDescription>你可以在上方添加自定义字符串替换规则。</AlertDescription>
          </Alert>
        </section>

        <!-- Prettier 配置 -->
        <section class="space-y-3">
          <h3 class="font-medium text-base">Prettier 配置</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="tabWidth">tabWidth</Label>
              <Input id="tabWidth" type="number" min="1" v-model.number="localOptions.tabWidth" />
            </div>
            <div class="space-y-2">
              <Label for="printWidth">printWidth</Label>
              <Input id="printWidth" type="number" min="40" v-model.number="localOptions.printWidth" />
            </div>
            <div class="space-y-2">
              <Label>useTabs</Label>
              <Switch v-model:checked="localOptions.useTabs" />
            </div>
            <div class="space-y-2">
              <Label>semi</Label>
              <Switch v-model:checked="localOptions.semi" />
            </div>
            <div class="space-y-2">
              <Label>singleQuote</Label>
              <Switch v-model:checked="localOptions.singleQuote" />
            </div>
            <div class="space-y-2">
              <Label>bracketSpacing</Label>
              <Switch v-model:checked="localOptions.bracketSpacing" />
            </div>
            <div class="space-y-2">
              <Label>bracketSameLine</Label>
              <Switch v-model:checked="localOptions.bracketSameLine" />
            </div>
            <div class="space-y-2">
              <Label>trailingComma</Label>
              <Select v-model="localOptions.trailingComma">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">none</SelectItem>
                  <SelectItem value="es5">es5</SelectItem>
                  <SelectItem value="all">all</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2 sm:col-span-2">
              <Label>htmlWhitespaceSensitivity</Label>
              <Select v-model="localOptions.htmlWhitespaceSensitivity">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="css">css</SelectItem>
                  <SelectItem value="strict">strict</SelectItem>
                  <SelectItem value="ignore">ignore</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </div>

      <DialogFooter class="gap-2">
        <Button @click="saveAll">保存</Button>
        <Button variant="secondary" @click="onUpdateOpen(false)">取消</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, toRaw } from "vue";
import type { ReplaceRule } from "@/lib/replacer";
import type { PrettierOptions } from "@/composables/useLocalSettings";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const props = defineProps<{
  open: boolean;
  modelValueRules: ReplaceRule[];
  modelValuePrettier: PrettierOptions;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "save", payload: { rules: ReplaceRule[]; prettier: PrettierOptions }): void;
}>();

const onUpdateOpen = (v: boolean) => emit("update:open", v);

// 局部副本（避免“取消”时污染外部）
const localRules = ref<ReplaceRule[]>(JSON.parse(JSON.stringify(props.modelValueRules)));
const localOptions = ref<PrettierOptions>({ ...props.modelValuePrettier });

watch(
  () => props.open,
  (v) => {
    if (v) {
      localRules.value = JSON.parse(JSON.stringify(props.modelValueRules));
      localOptions.value = { ...props.modelValuePrettier };
    }
  }
);

// ---- 规则增删改 ----
const draftRule = ref<ReplaceRule>({ keys: "", value: "", remark: "" });
const editingIndex = ref(-1);

function resetDraft() {
  draftRule.value = { keys: "", value: "", remark: "" };
  editingIndex.value = -1;
}

function addOrUpdateRule() {
  const r = { ...draftRule.value };
  if (!r.keys || r.value == null) return;
  if (editingIndex.value === -1) {
    localRules.value.push(r);
  } else {
    localRules.value.splice(editingIndex.value, 1, r);
  }
  resetDraft();
}

function editRule(idx: number) {
  const r = localRules.value[idx];
  draftRule.value = { ...r };
  editingIndex.value = idx;
}

function removeRule(idx: number) {
  localRules.value.splice(idx, 1);
  if (editingIndex.value === idx) resetDraft();
}

// 保存
function saveAll() {
  emit("save", { rules: toRaw(localRules.value), prettier: toRaw(localOptions.value) });
  onUpdateOpen(false);
}
</script>
