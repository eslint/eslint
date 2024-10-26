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

/**
 * @typedef Options
 * @property {string} codeCopyButtonTitle The title for the code copy button.
 */

/**
 *
 * modified from https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/preWrapper.ts
 * @param {MarkdownIt} md
 * @param {Options} options
 * @license MIT License. See file header.
 */
const preWrapperPlugin = (md, options) => {
    options = options || {
        codeCopyButtonTitle: 'Copy code',
    }

    const fence = md.renderer.rules.fence
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args
        const token = tokens[idx]

        // remove title from info
        token.info = token.info.replace(/\[.*\]/, '')

        const active = / active( |$)/.test(token.info) ? ' active' : ''
        token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

        const lang = extractLang(token.info)

        return (
            `<div class="language-${lang} ${active}" style="position: relative">` +
            `<button title="${options.codeCopyButtonTitle}" class="c-btn c-btn--secondary c-btn--copy"></button>` +
            fence(...args) +
            '</div>'
        )
    }
}

/**
 * @param {string} info
 * @return {string}
 */
function extractLang(info) {
    return info
        .trim()
        .replace(/=(\d*)/, '')
        .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
        .replace(/(-vue|{| ).*$/, '')
        .replace(/^vue-html$/, 'template')
        .replace(/^ansi$/, '')
}


module.exports.preWrapperPlugin = preWrapperPlugin;
