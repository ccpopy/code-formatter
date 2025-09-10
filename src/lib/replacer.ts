export interface ReplaceRule {
  /** 用逗号/中文逗号分隔的多个待替换字符串，例如："{opentype},-gkfs" */
  keys: string[]
  /** 替换后的目标文本，例如："主动公开" */
  value: string;
  /** 备注，方便识别用途 */
  remark?: string;
  /** 是否在右键菜单中显示 */
  showInMenu?: boolean;
}

/** 对用户粘贴的原始代码进行“批量字符串替换”预处理 */
export function applyReplacements(source: string, rules: ReplaceRule[]): string {
  let result = source ?? "";
  if (!Array.isArray(rules)) return result;
  for (const rule of rules) {
    if (!Array.isArray(rule?.keys)) continue;
    const variants = rule.keys
      .map((s) => (s ?? "").toString().trim())
      .filter((s) => s.length > 0);
    for (const key of variants) {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, "g");
      result = result.replace(re, rule.value ?? "");
    }
  }
  return result;
}