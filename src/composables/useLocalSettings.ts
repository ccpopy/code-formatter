import { ref, watch } from "vue";
import type { ReplaceRule } from "@/lib/replacer";
import type { ThemeMode } from "@/lib/theme";
import { applyTheme, getStoredTheme, storeTheme } from "@/lib/theme";

const LS_RULES = "formatter:rules";
const LS_PRETTIER = "formatter:prettier";

export type PrettierOptions = {
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: "none" | "es5" | "all";
  printWidth: number;
  bracketSpacing: boolean;
  bracketSameLine: boolean;
  htmlWhitespaceSensitivity: "css" | "strict" | "ignore";
};

export const defaultPrettierOptions: PrettierOptions = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: "css",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const rules = ref<ReplaceRule[]>(
  load<ReplaceRule[]>(LS_RULES, [
    { keys: "{opentype},-gkfs", value: "主动公开", remark: "公开方式（示例）" },
  ])
);

export const prettierOptions = ref<PrettierOptions>(
  load<PrettierOptions>(LS_PRETTIER, defaultPrettierOptions)
);

export const themeMode = ref<ThemeMode>(getStoredTheme());

// 持久化
watch(
  rules,
  (v) => save(LS_RULES, v),
  { deep: true }
);
watch(
  prettierOptions,
  (v) => save(LS_PRETTIER, v),
  { deep: true }
);
watch(themeMode, (mode) => {
  storeTheme(mode);
  applyTheme(mode);
});
