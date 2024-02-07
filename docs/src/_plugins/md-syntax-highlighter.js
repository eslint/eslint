/**
 * MIT License

Copyright (c) 2019-present, Yuxi (Evan) You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/** @typedef {import("markdown-it")} MarkdownIt */

const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");

/**
 *
 * @param {MarkdownIt} md markdown-it
 * @param {string} str code
 * @param {string} lang code language
 * @returns {string} highlighted result wrapped in pre
 */
const highlighter = function (md, str, lang) {
    let result = "";
    if (lang) {
        try {
            loadLanguages([lang]);
            result = Prism.highlight(str, Prism.languages[lang], lang);
        } catch (err) {
            console.log(lang, err);
            // we still want to wrap the result later
            result = md.utils.escapeHtml(str);
        }
    } else {
        result = md.utils.escapeHtml(str);
    }

    return `<pre class="language-${lang}"><code>${result}</code></pre>`;
};

/**
 *
 * modified from https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/lineNumbers.ts
 * @param {MarkdownIt} md
 * @license MIT License. See file header.
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

        const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`;

        const finalCode = rawCode
            .replace(/<\/pre>\n/, `${lineNumbersWrapperCode}</pre>`)
            .replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
            .replace(/<code>/, `<code class="language-${lang}">`)

        return finalCode;
    };
};

module.exports.highlighter = highlighter;
module.exports.lineNumberPlugin = lineNumberPlugin;
