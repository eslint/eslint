"use strict";

const Prism = require("prismjs");
const { Linter } = require("../../lib/api");
const astUtils = require("../../lib/shared/ast-utils");
const { docsExampleCodeToParsableCode } = require("./code-block-utils");

/** @typedef {import("../../lib/shared/types").ParserOptions} ParserOptions */

/**
 * Content that needs to be marked with ESLint
 * @type {string|undefined}
 */
let contentMustBeMarked;

/**
 * Parser options received from the `::: incorrect` or `::: correct` container.
 * @type {ParserOptions|undefined}
 */
let contentParserOptions;

/**
 * Set content that needs to be marked.
 * @param {string} content Source code content that marks ESLint errors.
 * @param {ParserOptions} options The options used for validation.
 * @returns {void}
 */
function addContentMustBeMarked(content, options) {
    contentMustBeMarked = content;
    contentParserOptions = options;
}

/**
 * Register a hook for `Prism` to mark errors in ESLint.
 * @returns {void}
 */
function installPrismESLintMarkerHook() {
    const linter = new Linter({ configType: "flat" });

    Prism.hooks.add("after-tokenize", env => {

        if (contentMustBeMarked !== env.code) {

            // Ignore unmarked content.
            return;
        }
        contentMustBeMarked = void 0;
        const parserOptions = contentParserOptions;

        const code = env.code;
        const tokens = env.tokens;

        /** Copied from SourceCode constructor */
        const lineStartIndices = [0];
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
         * @returns {number} The range index of the location in the file.
         * Copied from SourceCode#getIndexFromLoc
         */
        function getIndexFromLoc(loc) {
            const lineStartIndex = lineStartIndices[loc.line - 1];
            const positionIndex = lineStartIndex + loc.column - 1;

            return positionIndex;
        }

        /*
         * Run lint to extract the error range.
         */
        const messages = linter.verify(

            // Remove trailing newline and presentational `⏎` characters
            docsExampleCodeToParsableCode(code),
            { languageOptions: { sourceType: parserOptions.sourceType, parserOptions } },
            { filename: "code.js" }
        );

        if (messages.some(m => m.fatal)) {

            // ESLint fatal error.
            return;
        }
        const ranges = messages.map(m => {
            const start = getIndexFromLoc({
                line: m.line,
                column: m.column
            });

            return [
                start,
                typeof m.endLine === "undefined"
                    ? start + 1
                    : getIndexFromLoc({
                        line: m.endLine,
                        column: m.endColumn
                    })
            ];
        });

        let currentRange = ranges.shift();

        if (!currentRange) {
            return;
        }
        let start = 0;

        /**
         * Generates a token stream with the `marked` class assigned to the error range.
         * @param {(string | Prism.Token)[]} originalTokens tokens to be converted
         * @returns {IterableIterator<string | Prism.Token>} converted tokens
         */
        function *convertMarked(originalTokens) {
            for (const token of originalTokens) {
                if (!currentRange) {
                    yield token;
                    continue;
                }
                let content;
                let buildToken;

                if (typeof token === "string") {
                    content = token;
                    buildToken = newContent => newContent;
                } else {
                    if (typeof token.content !== "string") {
                        token.content = [...convertMarked([token.content].flat())];
                        yield token;
                        continue;
                    }
                    content = token.content;
                    buildToken = newContent =>
                        (newContent === token.content
                            ? token
                            : new Prism.Token(token.type, newContent, token.alias));
                }
                while (currentRange && content && currentRange[0] < start + content.length) {
                    const before = content.slice(0, Math.max(currentRange[0] - start, 0));

                    if (before) {
                        yield buildToken(before);
                    }
                    const mark = content.slice(
                        Math.max(currentRange[0] - start, 0),
                        currentRange[1] - start
                    );

                    yield new Prism.Token(
                        [
                            typeof token === "string" ? "" : token.type,
                            "eslint-marked",
                            mark === "\n" && (currentRange[0] + 1 === currentRange[1])
                                ? "eslint-marked-line-feed"
                                : null
                        ].filter(Boolean).join(" "),
                        mark,
                        token.alias
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
                start += content.length;
            }
        }

        env.tokens = [...convertMarked(tokens)];
    });
}


module.exports = { installPrismESLintMarkerHook, addContentMustBeMarked };
