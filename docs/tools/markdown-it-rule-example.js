"use strict";

module.exports =
function markdownItRuleExample({ open, close }) {
    return {
        validate(info) {
            return /^\s*(?:in)?correct(?!\S)/u.test(info);
        },
        render(tokens, index) {
            const tagToken = tokens[index];

            if (tagToken.nesting < 0) {
                return close ? close() : void 0;
            }

            const { type, parserOptionsJSON } = /^\s*(?<type>\S+)(\s+(?<parserOptionsJSON>.+?))?\s*$/u.exec(tagToken.info).groups;
            const parserOptions = { sourceType: "module", ...(parserOptionsJSON && JSON.parse(parserOptionsJSON)) };
            const codeBlockToken = tokens[index + 1];

            // Remove trailing newline and presentational `⏎` characters (https://github.com/eslint/eslint/issues/17627):
            const code = codeBlockToken.content
                .replace(/\n$/u, "")
                .replace(/⏎(?=\n)/gu, "");

            return open(type, code, parserOptions, codeBlockToken);
        }
    };
};
