/** @typedef {import("markdown-it")} MarkdownIt */

const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");

/**
 *
 * @param {MarkdownIt} md markdown-it
 * @param {string} str code
 * @param {string} lang code language
 * @returns
 */
const highlighter = function (md, str, lang) {
    let result = "";
    if (lang) {
        try {
            loadLanguages([lang]);
            result = Prism.highlight(str, Prism.languages[lang], lang);
        } catch (err) {
            console.log(err);
        }
    } else {
        result = md.utils.escapeHtml(str);
    }

    return `<pre><code>${result}</code></pre>`;
};

/**
 *
 * modified from https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/preWrapper.ts
 * @param {MarkdownIt} md
 */
const preWrapperPlugin = (md) => {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args;
        const lang = tokens[idx].info.trim();
        const rawCode = fence(...args);
        return `<div class="language-${lang}">${rawCode}</div>`;
    };
};

/**
 *
 * modified from https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/lineNumbers.ts
 * @param {MarkdownIt} md
 */
const lineNumberPlugin = (md) => {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args;
        const lang = tokens[idx].info.trim();
        const rawCode = fence(...args);
        const code = rawCode.slice(
            rawCode.indexOf("<code>"),
            rawCode.indexOf("</code>")
        );
        const lines = code.split("\n");
        const lineNumbersCode = [...Array(lines.length - 1)]
            .map(
                (line, index) =>
                    `<span class="line-number">${index + 1}</span><br>`
            )
            .join("");

        const lineNumbersWrapperCode = `<div class="line-numbers-wrapper">${lineNumbersCode}</div>`;

        const finalCode = rawCode
            .replace(/<\/div>$/, `${lineNumbersWrapperCode}</div>`)
            .replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
            .replace(/<code>/, `<code class="language-${lang}">`)
            .replace(/<pre>/, `<pre class="language-${lang}">`);

        return finalCode;
    };
};

module.exports.highlighter = highlighter;
module.exports.preWrapperPlugin = preWrapperPlugin;
module.exports.lineNumberPlugin = lineNumberPlugin;
