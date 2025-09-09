<template>
  <Dialog :open="open" @update:open="onUpdateOpen">
    <DialogContent class="sm:max-w-2xl md:max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>替换规则配置</DialogTitle>
        <DialogDescription>
          配置字符串替换规则，在格式化前自动替换指定的文本
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- 添加/编辑规则表单 -->
        <Card class="p-6 bg-muted/30">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <Label for="keys">要替换的字符串</Label>
                <Input id="keys" v-model="draftRule.keysStr" placeholder="多个用逗号分隔" class="font-mono text-sm" />
                <p class="text-xs text-muted-foreground">
                  例如：{opentype},-gkfs
                </p>
              </div>

              <div class="space-y-2">
                <Label for="value">替换为</Label>
                <Input id="value" v-model="draftRule.value" placeholder="目标文本" class="font-mono text-sm" />
                <p class="text-xs text-muted-foreground">
                  例如：主动公开
                </p>
              </div>

              <div class="space-y-2">
                <Label for="remark">备注说明</Label>
                <Input id="remark" v-model="draftRule.remark" placeholder="可选" />
                <p class="text-xs text-muted-foreground">
                  方便识别规则用途
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <Button @click="addOrUpdateRule" :disabled="!draftRule.keysStr || draftRule.value == null">
                <Plus class="h-4 w-4 mr-2" v-if="editingIndex === -1" />
                <Save class="h-4 w-4 mr-2" v-else />
                {{ editingIndex === -1 ? '添加规则' : '保存修改' }}
              </Button>

              <Button variant="outline" @click="resetDraft" v-if="editingIndex !== -1">
                <X class="h-4 w-4 mr-2" />
                取消编辑
              </Button>
            </div>
          </div>
        </Card>

        <!-- 规则列表 -->
        <div class="w-full space-y-2">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium">已配置的规则</h3>
            <span class="text-xs text-muted-foreground">
              共 {{ localRules.length }} 条规则
            </span>
          </div>

          <div v-if="localRules.length" class="space-y-2 pt-2 pb-2 max-h-[300px] overflow-y-auto">
            <Card v-for="(rule, idx) in localRules" :key="idx"
              class="p-4 transition-all hover:shadow-md hover:bg-accent/5"
              :class="{ 'ring-primary/50 bg-primary/5': editingIndex === idx }">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 space-y-2">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-xs text-muted-foreground">替换：</span>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <Badge v-for="(k, i) in rule.keys" :key="i" class="font-mono text-xs">{{ k
                        }}</Badge>
                      </div>
                    </div>
                    <div>
                      <span class="text-xs text-muted-foreground">为：</span>
                      <div class="font-mono mt-1 break-all">{{ rule.value }}</div>
                    </div>
                    <div v-if="rule.remark">
                      <span class="text-xs text-muted-foreground">备注：</span>
                      <div class="mt-1">{{ rule.remark }}</div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-1">
                  <Button size="icon" variant="ghost" @click="editRule(idx)" class="h-8 w-8">
                    <Edit2 class="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" @click="removeRule(idx)"
                    class="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Alert v-else>
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>暂无规则</AlertTitle>
            <AlertDescription>
              添加替换规则后，格式化时将自动替换相应的文本
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="onUpdateOpen(false)">
          取消
        </Button>
        <Button @click="saveAll">
          <Check class="h-4 w-4 mr-2" />
          保存配置
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ReplaceRule } from "@/lib/replacer";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Plus,
  Save,
  X,
  Edit2,
  Trash2,
  Check,
  AlertCircle
} from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  modelValue: ReplaceRule[];
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "save", rules: ReplaceRule[]): void;
}>();

const onUpdateOpen = (v: boolean) => emit("update:open", v);

// 局部副本
const localRules = ref<ReplaceRule[]>([]);
type DraftRule = { keysStr: string; value: string; remark?: string }
const draftRule = ref<DraftRule>({ keysStr: "", value: "", remark: "" });
const editingIndex = ref(-1);

// 监听弹窗打开，初始化数据
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      localRules.value = JSON.parse(JSON.stringify(props.modelValue));
      resetDraft();
    }
  }
);

function resetDraft() {
  draftRule.value = { keysStr: "", value: "", remark: "" };
  editingIndex.value = -1;
}

// 保存：字符串 -> 数组
function addOrUpdateRule() {
  const keysArr = (draftRule.value.keysStr || "")
    .split(/[，,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const rule: ReplaceRule = {
    keys: keysArr,
    value: draftRule.value.value ?? "",
    remark: draftRule.value.remark ?? ""
  };
  if (!rule.keys.length || rule.value == null) return;

  if (editingIndex.value === -1) {
    localRules.value.push(rule);
  } else {
    localRules.value[editingIndex.value] = rule;
  }
  resetDraft();
}

// 编辑：数组 -> 字符串
function editRule(idx: number) {
  const rule = localRules.value[idx];
  draftRule.value = {
    keysStr: Array.isArray(rule.keys) ? rule.keys.join(",") : (rule as any).keys || "",
    value: (rule as any).value ?? "",
    remark: rule.remark ?? ""
  };
  editingIndex.value = idx;
}

function removeRule(idx: number) {
  localRules.value.splice(idx, 1);
  if (editingIndex.value === idx) {
    resetDraft();
  } else if (editingIndex.value > idx) {
    editingIndex.value--;
  }
}

function saveAll() {
  emit("save", [...localRules.value]);
  onUpdateOpen(false);
}
</script>