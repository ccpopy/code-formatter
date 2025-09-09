/**
 * Prettier 浏览器端格式化封装
 * 仅使用 html/js/json/css 四种语言
 */
import prettier from "prettier/standalone";
import * as estree from "prettier/plugins/estree";
import * as babel from "prettier/plugins/babel";
import * as html from "prettier/plugins/html";
import * as postcss from "prettier/plugins/postcss";

export type Lang = "html" | "js" | "json" | "css";

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
  const parser = parserMap[lang];
  const plugins = [babel.default, estree.default, html.default, postcss.default];
  return await prettier.format(code ?? "", {
    parser,
    plugins,
    ...options,
  });
}
