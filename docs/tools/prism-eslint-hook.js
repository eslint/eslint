/**
 * @fileoverview Use Prism hooks to draw linting errors with red markers on markdown code blocks.
 * @author Yosuke Ota
 */
"use strict";

const Prism = require("prismjs");
const { docsExampleCodeToParsableCode } = require("./code-block-utils");

let isAvailable = false;
let Linter = null;
let astUtils = null;

/*
 * We can only do the syntax highlighting in the English-language
 * site because we need the Linter and astUtils. This same
 * code is run in translation sites where these utilities are
 * not available, so check to see if they are before attempting
 * to highlight the code.
 */
try {
    Linter = require("../../lib/api").Linter;
    astUtils = require("../../lib/shared/ast-utils");
    isAvailable = true;
} catch {

    // ignore
}

/** @typedef {import("../../lib/shared/types").LanguageOptions} LanguageOptions */

/**
 * Content that needs to be marked with ESLint
 * @type {string|undefined}
 */
let contentMustBeMarked;

/**
 * Parser options received from the `::: incorrect` or `::: correct` container.
 * @type {LanguageOptions|undefined}
 */
let contentLanguageOptions;

/**
 * Set content that needs to be marked.
 * @param {string} content Source code content that marks ESLint errors.
 * @param {LanguageOptions} options The options used for validation.
 * @returns {void}
 */
function addContentMustBeMarked(content, options) {
    contentMustBeMarked = content;
    contentLanguageOptions = options;
}

/**
 * Register a hook for `Prism` to mark errors in ESLint.
 * @returns {void}
 */
function installPrismESLintMarkerHook() {

    /**
     * A token type for marking the range reported by a rule.
     * This is also used for the `class` attribute of `<span>`.
     */
    const TOKEN_TYPE_ESLINT_MARKED = "eslint-marked";

    /**
     * Use in the class attribute of `<span>` when an error is displayed in the BOM code or empty string.
     */
    const CLASS_ESLINT_MARKED_ON_ZERO_WIDTH = "eslint-marked-on-zero-width";

    /**
     * Use in the class attribute of `<span>` when an error is displayed in the line-feed.
     */
    const CLASS_ESLINT_MARKED_ON_LINE_FEED = "eslint-marked-on-line-feed";

    /**
     * A Map that holds message IDs and messages.
     * @type {Map<string, string>}
     */
    const messageMap = new Map();

    /**
     * Gets the message ID from the given message.
     * @param {string} message Message
     * @returns {string} Message ID
     */
    function getMessageIdFromMessage(message) {
        let messageId;

        for (const [key, value] of messageMap.entries()) {
            if (value === message) {
                messageId = key;
                break;
            }
        }
        if (!messageId) {
            messageId = `eslint-message-id-${messageMap.size + 1}`;
            messageMap.set(messageId, message);
        }
        return messageId;
    }


    const linter = new Linter({ configType: "flat" });

    Prism.hooks.add("after-tokenize", env => {
        messageMap.clear();

        if (contentMustBeMarked !== env.code) {

            // Ignore unmarked content.
            return;
        }
        contentMustBeMarked = void 0;
        const config = contentLanguageOptions ? { languageOptions: contentLanguageOptions } : {};

        const code = env.code;

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
        const lintMessages = linter.verify(

            // Remove trailing newline and presentational `⏎` characters
            docsExampleCodeToParsableCode(code),
            config,
            { filename: "code.js" }
        );

        if (lintMessages.some(m => m.fatal)) {

            // ESLint fatal error.
            return;
        }
        const messages = lintMessages.map(message => {
            const start = getIndexFromLoc({
                line: message.line,
                column: message.column
            });

            return {
                message: message.message,
                range: [
                    start,
                    typeof message.endLine === "undefined"
                        ? start
                        : getIndexFromLoc({
                            line: message.endLine,
                            column: message.endColumn
                        })
                ]
            };
        });

        /**
         * Get the content of the token.
         * @param {string | Prism.Token} token The token
         * @returns {string} The content of the token
         */
        function getTokenContent(token) {
            if (typeof token === "string") {
                return token;
            }
            if (typeof token.content === "string") {
                return token.content;
            }
            return [token.content].flat().map(getTokenContent).join("");
        }

        /**
         * @typedef {Object} SplitTokenResult
         * @property {string | Prism.Token | null} before The token before the marked range
         * @property {Object} marked The marked token information
         * @property {Prism.Token} marked.token The token with the marked range
         * @property {boolean} marked.canBeMerged If true, it can be merged with previous and subsequent marked tokens.
         * @property {string | Prism.Token | null} after The token after the marked range
         */

        /**
         * Splits the given token into the `eslint-marked` token and the token before and after it with the specified range.
         * @param {Object} params Parameters
         * @param {string | Prism.Token} params.token Token to be split
         * @param {[number, number]} params.range Range to be marked
         * @param {string} params.message Report message
         * @param {number} params.tokenStart Starting position of the token
         * @returns {SplitTokenResult} Splitted tokens
         */
        function splitToken({ token, range, message, tokenStart }) {

            const content = getTokenContent(token);
            const tokenEnd = tokenStart + content.length;

            if (range[0] <= tokenStart && tokenEnd <= range[1]) {

                // The token is in range.
                const marked = new Prism.Token(
                    TOKEN_TYPE_ESLINT_MARKED,
                    [token],
                    [getMessageIdFromMessage(message)]
                );

                return { before: null, marked: { token: marked, canBeMerged: true }, after: null };
            }

            let buildToken;

            if (typeof token === "string") {
                buildToken = newContent => newContent;
            } else {
                if (typeof token.content !== "string") {
                    if (token.content.every(childContent => typeof childContent === "string")) {

                        // It can be flatten.
                        buildToken = newContent => new Prism.Token(token.type, newContent, token.alias);
                    } else {
                        // eslint-disable-next-line no-use-before-define -- Safe
                        token.content = [...convertMarked({ tokens: token.content, range, message, tokenStart })];
                        return { before: null, marked: { token, canBeMerged: false }, after: null };
                    }
                } else {
                    buildToken = newContent => new Prism.Token(token.type, newContent, token.alias);
                }
            }

            const before = tokenStart < range[0] ? buildToken(content.slice(0, range[0] - tokenStart)) : null;
            const mark = content.slice(before ? range[0] - tokenStart : 0, range[1] - tokenStart);
            const marked = new Prism.Token(
                TOKEN_TYPE_ESLINT_MARKED,
                mark ? [buildToken(mark)] : mark,
                [getMessageIdFromMessage(message)]
            );
            const after = range[1] - tokenStart < content.length ? buildToken(content.slice(range[1] - tokenStart)) : null;

            return { before, marked: { token: marked, canBeMerged: true }, after };
        }

        /**
         * Splits the given ESLint marked tokens with line feed code.
         * The line feed code is not displayed because there is no character width,
         * so by making it a single character token, the "wrap hook" applies CLASS_ESLINT_MARKED_ON_LINE_FEED
         * to each character and makes it visible.
         * @param {Prism.Token} token Token to be split
         * @returns {IterableIterator<Prism.Token>} Splitted tokens
         */
        function *splitMarkedTokenByLineFeed(token) {
            for (const contentToken of [token.content].flat()) {
                if (typeof contentToken !== "string") {
                    const content = getTokenContent(contentToken);

                    if (/[\r\n]/u.test(content)) {
                        yield new Prism.Token(token.type, [...splitMarkedTokenByLineFeed(contentToken)], token.alias);
                    } else {
                        yield new Prism.Token(token.type, [contentToken], token.alias);
                    }
                    continue;
                }
                if (!/[\r\n]/u.test(contentToken)) {
                    yield new Prism.Token(token.type, [contentToken], token.alias);
                    continue;
                }
                const contents = [];
                const reLineFeed = /\r\n?|\n/ug;
                let startIndex = 0;
                let matchLineFeed;

                while ((matchLineFeed = reLineFeed.exec(contentToken))) {
                    contents.push(contentToken.slice(startIndex, matchLineFeed.index));
                    contents.push(matchLineFeed[0]);
                    startIndex = reLineFeed.lastIndex;
                }
                contents.push(contentToken.slice(startIndex));
                yield* contents.filter(Boolean).map(str => new Prism.Token(token.type, [str], token.alias));
            }
        }

        /**
         * Splits the given tokens by line feed code.
         * @param {Prism.Token[]} tokens Token to be Separate
         * @returns {IterableIterator<Prism.Token>} Splitted tokens
         */
        function *splitTokensByLineFeed(tokens) {
            for (const token of tokens) {
                if (typeof token === "string") {
                    yield token;
                    continue;
                }

                const content = getTokenContent(token);

                if (!/[\r\n]/u.test(content)) {
                    yield token;
                    continue;
                }
                if (token.type === TOKEN_TYPE_ESLINT_MARKED) {
                    yield* splitMarkedTokenByLineFeed(token);
                    continue;
                }

                if (typeof token.content !== "string") {
                    token.content = [...splitTokensByLineFeed([token.content].flat())];
                }
                yield token;
            }
        }

        /**
         * Generates a token stream with the `eslint-marked` class assigned to the error range.
         * @param {Object} params Parameters
         * @param {string | Prism.Token | (string | Prism.Token[])} params.tokens Tokens to be converted
         * @param {[number, number]} params.range Range to be marked
         * @param {string} params.message Report message
         * @param {number} params.tokenStart Starting position of the tokens
         * @returns {IterableIterator<string | Prism.Token>} converted tokens
         */
        function *convertMarked({ tokens, range, message, tokenStart = 0 }) {
            let start = tokenStart;

            const buffer = [tokens].flat();

            let token;

            // Find the first token to mark
            while ((token = buffer.shift())) {
                const content = getTokenContent(token);
                const end = start + content.length;

                if (!content || end <= range[0]) {
                    yield token;
                    start = end;
                    continue;
                }

                break;
            }
            if (!token) {
                return;
            }

            // Mark the token.
            const { before, marked, after } = splitToken({ token, range, message, tokenStart: start });

            if (before) {
                yield before;
            }
            if (after) {
                yield* splitTokensByLineFeed([marked.token]);
                yield after;
            } else {

                // Subsequent tokens may still be present in the range.
                let nextTokenStartIndex = start + getTokenContent(token).length;
                let prevMarked = marked;
                let nextAfter;

                while (nextTokenStartIndex < range[1] && buffer.length) {
                    const nextToken = buffer.shift();
                    const next = splitToken({ token: nextToken, range, message, tokenStart: nextTokenStartIndex });

                    if (prevMarked.canBeMerged && next.marked.canBeMerged) {
                        prevMarked.token.content.push(...next.marked.token.content);
                    } else {
                        yield* splitTokensByLineFeed([prevMarked.token]);
                        prevMarked = next.marked;
                    }
                    if (next.after) {
                        nextAfter = next.after;
                    }
                    nextTokenStartIndex += getTokenContent(nextToken).length;
                }

                yield* splitTokensByLineFeed([prevMarked.token]);
                if (nextAfter) {
                    yield nextAfter;
                }
            }

            yield* buffer;
        }

        for (const { range, message } of messages) {
            env.tokens = [...convertMarked({ tokens: env.tokens, range, message })];
        }
    });

    Prism.hooks.add("wrap", env => {
        if (env.type === TOKEN_TYPE_ESLINT_MARKED) {
            const messageId = env.classes.find(c => messageMap.has(c));

            if (messageId) {
                env.attributes.title = messageMap.get(messageId);
            }

            if (
                env.content === "" ||
                env.content === "\ufeff"
            ) {
                env.classes.push(CLASS_ESLINT_MARKED_ON_ZERO_WIDTH);
            } else if (
                env.content === "\n" ||
                env.content === "\r" ||
                env.content === "\r\n"
            ) {
                env.classes.push(CLASS_ESLINT_MARKED_ON_LINE_FEED);
            }
        }
    });
}


module.exports = {
    installPrismESLintMarkerHook: isAvailable ? installPrismESLintMarkerHook : () => { /* noop */ },
    addContentMustBeMarked: isAvailable ? addContentMustBeMarked : () => { /* noop */ }
};
