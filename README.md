<h1 align="center">代码格式化工具 · Code Formatter</h1>
<div align="center">
  
🎨 **基于 Vue 3 + Prettier 的在线代码格式化工具**

[![Vue](https://img.shields.io/badge/Vue-3.5.21-brightgreen?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Prettier](https://img.shields.io/badge/Prettier-3.3.3-F7B93E?logo=prettier)](https://prettier.io/)
[![shadcn/vue](https://img.shields.io/badge/shadcn%2Fvue-2.2.0-000000)](https://www.shadcn-vue.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[功能特性](#-功能特性) | [快速开始](#-快速开始) | [使用指南](#-使用指南)

</div>

---

## ✨ 功能特性

- 🚀 **多语言支持** - 支持 HTML、JavaScript、JSON、CSS 代码格式化
- 🔄 **字符串替换** - 可配置的批量字符串替换规则，在格式化前自动处理
- ⚙️ **Prettier 配置** - 完整的 Prettier 配置选项，实时调整格式化风格
- 🎨 **现代化界面** - 基于 shadcn/vue 组件库，支持明暗主题切换
- 💾 **本地存储** - 配置和规则自动保存到本地，下次使用时自动恢复
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **实时预览** - 即时查看格式化结果
- 📋 **一键复制** - 快速复制格式化后的代码

## 🛠 技术栈

- **框架**: Vue 3.5.21 + TypeScript
- **构建工具**: Vite 7.1.4
- **UI 组件**: shadcn/vue 2.2.0 + Radix Vue
- **样式**: TailwindCSS 4.0 + CSS Variables
- **格式化引擎**: Prettier 3.3.3
- **路由**: Vue Router 4.5.1
- **工具库**: VueUse + Lucide Icons

## 🚀 快速开始

### 环境要求

- Node.js >= 22.0.0
- pnpm / npm / yarn

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/ccpopy/code-formatter.git
cd code-formatter

# 安装依赖
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev

# 局域网访问
npm run host
```

访问 http://localhost:5173 查看应用

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📖 使用指南

### 基础使用

1. **选择语言**: 在顶部工具栏选择要格式化的代码语言（HTML/JS/JSON/CSS）
2. **粘贴代码**: 在左侧输入框粘贴待格式化的代码
3. **格式化**: 点击"格式化"按钮，右侧即显示格式化结果
4. **复制结果**: 点击"复制结果"按钮，将格式化后的代码复制到剪贴板

### 替换规则配置

点击"替换规则配置"按钮，可以添加字符串替换规则：

- **要替换的字符串**: 支持多个关键词，用逗号分隔
- **替换为**: 目标替换文本
- **备注**: 规则说明（可选）

示例：将 `{opentype}` 和 `-gkfs` 替换为 `主动公开`

### Prettier 配置

通过左侧边栏调整 Prettier 格式化选项：

| 配置项          | 说明                        | 默认值 |
| --------------- | --------------------------- | ------ |
| Tab 宽度        | 一个制表符的空格数          | 2      |
| 每行最大字符数  | 超过后自动换行              | 800    |
| 使用 Tab        | 使用制表符而非空格          | 关闭   |
| 分号            | 语句末尾添加分号            | 开启   |
| 单引号          | 使用单引号                  | 关闭   |
| 括号空格        | 对象字面量括号内空格        | 开启   |
| 括号同行        | 多行元素最后的 `>` 是否同行 | 关闭   |
| 尾随逗号        | 多行时的尾随逗号            | es5    |
| HTML 空格敏感度 | HTML 空格的处理方式         | css    |

## 📁 项目结构

```
code-formatter/
├── src/
│   ├── assets/                   # 静态资源和全局样式
│   │   └── main.css              # 全局样式和主题变量
│   ├── components/               # Vue 组件
│   │   ├── ui/                   # shadcn/vue UI 组件
│   │   ├── RulesModal.vue        # 替换规则配置弹窗
│   │   └── ThemeToggle.vue       # 主题切换按钮
│   ├── composables/              # 组合式函数
│   │   └── useLocalSettings.ts   # 本地存储管理
│   ├── lib/                      # 工具库
│   │   ├── prettier.ts           # Prettier 格式化封装
│   │   ├── replacer.ts           # 字符串替换逻辑
│   │   ├── theme.ts              # 主题管理
│   │   └── utils.ts              # 工具函数
│   ├── router/                   # 路由配置
│   ├── views/                    # 页面组件
│   │   └── FormatterView.vue     # 主页面
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 应用入口
├── public/                       # 公共资源
├── index.html                    # HTML 模板
├── package.json                  # 项目配置
├── vite.config.ts                # Vite 配置
├── tailwind.config.js            # Tailwind 配置
└── tsconfig.json                 # TypeScript 配置
```

## 🎨 主题定制

项目使用 CSS 变量实现主题系统，可在 `src/assets/main.css` 中自定义颜色：

```css
:root {
  --primary: oklch(0.606 0.25 292.717);
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  /* 更多颜色变量... */
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ using Vue.js and shadcn/vue

</div>
