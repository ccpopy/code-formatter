# 代码格式化工具（Vue 3 + Vite + shadcn/vue + Prettier）

> 开发环境：Vue@3.5.21 · Vite@7.1.4 · vue-router@4.5.1 · shadcn/vue@2.2.0 · @vitejs/plugin-vue@6.0.1 · tailwindcss@4 · Node.js 23.6.0  
> 构建后的代码使用 **history** 路由（。

## 功能概览

- **一屏布局**（PC）与 **移动端响应式**。
- **主题色切换**：默认跟随系统；支持 `系统 / 浅色 / 深色`，选择保存至 `localStorage`，刷新后仍生效。
- **代码格式化**：左侧粘贴代码 → 点击「格式化」 → 右侧显示结果。
  - 先按自定义 **替换规则** 批量替换字符串（如 `{opentype},-gkfs` → `主动公开`）。
  - 再按 **Prettier** 规则格式化。
  - 支持语言：`html` / `js` / `json` / `css`。
- **配置弹窗**：
  - 上半部分：替换规则（增/改/删）。
  - 下半部分：Prettier 配置（`tabWidth`、`semi`、`singleQuote`、`trailingComma`、`printWidth`、`bracketSpacing`、`bracketSameLine`、`htmlWhitespaceSensitivity`）。
  - 保存配置到 `localStorage`。
- **复制到剪贴板**，成功后弹出提示（`Alert`）。
- UI 使用 **shadcn/vue** 组件：`Button` / `Alert` / `Card` / `Select` / `Dialog` / `Input` / `Textarea` / `Label` / `Switch` 等。

---

## 快速开始

> **必须先添加 shadcn/vue 组件**（CLI 会把组件文件生成到 `src/components/ui`）。

```bash
# 1) 克隆或解压本项目
#    Node.js 版本建议：v23.6.0

# 2) 安装依赖
npm i

# 3) 初始化 shadcn/vue（将根据本项目的 components.json 写入）
npx shadcn-vue@latest init -y

# 4) 一次性添加本项目用到的组件
npx shadcn-vue@latest add button alert card select dialog input textarea label switch

# 5) 运行
npm run dev
# 打开 http://localhost:5173
```
