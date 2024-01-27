const Prism = require("prismjs");
const { Linter } = require("../../../lib/api");
const astUtils = require("../../../lib/shared/ast-utils");

module.exports = { install };

function install() {
    const linter = new Linter({ configType: "flat" });
    Prism.hooks.add("after-tokenize", (env) => {
        // Content that starts with `/* eslint ` and whose language is js is considered an example of an eslint rule.
        if (env.language !== "js" || !/^\s*\/\*\s*eslint\s/u.test(env.code)) {
            return;
        }

        const code = env.code;
        const tokens = env.tokens;

        /** Copied from SourceCode constructor */
        lineStartIndices = [0];
        const lineEndingPattern = astUtils.createGlobalLinebreakMatcher();
        let match;
        while ((match = lineEndingPattern.exec(code))) {
            lineStartIndices.push(match.index + match[0].length);
        }
        /**
         * Converts a (line, column) pair into a range index.
         * @param {Object} loc A line/column location
         * @param {number} loc.line The line number of the location (1-indexed)
         * @param {number} loc.column The column number of the location (1-indexed)
         * Copied from SourceCode#getIndexFromLoc
         * */
        function getIndexFromLoc(loc) {
            const lineStartIndex = lineStartIndices[loc.line - 1];
            const positionIndex = lineStartIndex + loc.column - 1;
            return positionIndex;
        }

        // Run lint to extract the error range.
        // Use `sourceType: "script"` and `ecmaVersion: 2015` to make the initial parsing loose.
        let messages = linter.verify(
            code,
            { languageOptions: { sourceType: "script", parserOptions: { ecmaVersion: 2015 } } },
            { filename: "code.js" },
        );
        if (messages.some((m) => m.fatal)) {
            // If it contains a fatal error, change it to remove `ecmaVersion: 2015` and re-parse it.
            messages = linter.verify(
                code,
                { languageOptions: { sourceType: "script" } },
                { filename: "code.js" },
            );
        }
        if (messages.some((m) => m.fatal)) {
            // If it contains a fatal error, change it to `sourceType: 'module'` and re-parse it.
            messages = linter.verify(
                code,
                { languageOptions: { sourceType: "module" } },
                { filename: "code.js" },
            );
        }
        const ranges = messages.map((m) => {
            const start = getIndexFromLoc({
                line: m.line,
                column: m.column,
            });
            return [
                start,
                m.endLine == null
                    ? start + 1
                    : getIndexFromLoc({
                          line: m.endLine,
                          column: m.endColumn,
                      }),
            ];
        });

        let currentRange = ranges.shift();
        if (!currentRange) {
            return;
        }
        let start = 0;
        env.tokens = [...convertMarked(tokens)];

        /**
         * Generates a token stream with the `marked` class assigned to the error range.
         * @param {(string | Prism.Token)[]} tokens
         */
        function* convertMarked(tokens) {
            for (const token of tokens) {
                if (!currentRange) {
                    yield token;
                    continue;
                }
                let content;
                let buildToken;
                if (typeof token === "string") {
                    content = token;
                    buildToken = (content) => content;
                } else {
                    if (typeof token.content !== "string") {
                        token.content = [...convertMarked([token.content].flat())];
                        yield token;
                        continue;
                    }
                    content = token.content;
                    buildToken = (content) =>
                        content === token.content
                            ? token
                            : new Prism.Token(token.type, content, token.alias);
                }
                while (currentRange && content && currentRange[0] < start + content.length) {
                    const before = content.slice(0, Math.max(currentRange[0] - start, 0));
                    if (before) {
                        yield buildToken(before);
                    }
                    const mark = content.slice(
                        Math.max(currentRange[0] - start, 0),
                        currentRange[1] - start,
                    );
                    yield new Prism.Token(
                        [typeof token === "string" ? "" : token.type, "eslint-marked"].join(" "),
                        mark,
                        token.alias,
                    );
                    content = content.slice(currentRange[1] - start);
                    start = start + before.length + mark.length;
                    if (currentRange[1] <= start) {
                        currentRange = ranges.shift();
                    }
                }
                if (content.length > 0) {
                    yield buildToken(content);
                }
                start = start + content.length;
            }
        }
    });
}
