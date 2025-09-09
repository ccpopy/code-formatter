/**
 * Prettier 浏览器端格式化封装
 * 仅使用 html/js/json/css 四种语言
 */

export type Lang = "html" | "js" | "json" | "css";

// 懒加载 Prettier
let prettierPromise: Promise<any> | null = null;

async function loadPrettier() {
  if (!prettierPromise) {
    prettierPromise = Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/estree"),
      import("prettier/plugins/babel"),
      import("prettier/plugins/html"),
      import("prettier/plugins/postcss"),
    ]);
  }
  return prettierPromise;
}

const parserMap: Record<Lang, string> = {
  html: "html",
  js: "babel",
  json: "json",
  css: "css",
};

export async function formatWithPrettier(
  code: string,
  lang: Lang,
  options: Record<string, any>
): Promise<string> {
  // 懒加载 Prettier 和插件
  const [prettier, estree, babel, html, postcss] = await loadPrettier();

  const parser = parserMap[lang];
  const plugins = [babel.default, estree.default, html.default, postcss.default];

  return await prettier.default.format(code ?? "", {
    parser,
    plugins,
    ...options,
  });
}