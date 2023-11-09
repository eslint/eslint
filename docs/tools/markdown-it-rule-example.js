"use strict";

/** @typedef {import("../../lib/shared/types").ParserOptions} ParserOptions */

/**
 * A callback function to handle the opening of container blocks.
 * @callback OpenHandler
 * @param {"correct" | "incorrect"} type The type of the example.
 * @param {string} code The example code.
 * @param {ParserOptions} parserOptions The parser options to be passed to the Playground.
 * @param {Object} codeBlockToken The `markdown-it` token for the code block inside the container.
 * @returns {string | undefined} If a text is returned, it will be appended to the rendered output
 * of `markdown-it`.
 */

/**
 * A callback function to handle the closing of container blocks.
 * @callback CloseHandler
 * @returns {string | undefined} If a text is returned, it will be appended to the rendered output
 * of `markdown-it`.
 */

/**
 * This is a utility to simplify the creation of `markdown-it-container` options to handle rule
 * examples in the documentation.
 * It is designed to automate the following common tasks:
 *
 * - Ensure that the plugin instance only matches container blocks tagged with 'correct' or
 * 'incorrect'.
 * - Parse the optional `parserOptions` after the correct/incorrect tag.
 * - Apply common transformations to the code inside the code block, like stripping '⏎' at the end
 * of a line or the last newline character.
 *
 * Additionally, the opening and closing of the container blocks are handled by two distinct
 * callbacks, of which only the `open` callback is required.
 * @param {Object} options The options object.
 * @param {OpenHandler} options.open The open callback.
 * @param {CloseHandler} [options.close] The close callback.
 * @returns {Object} The `markdown-it-container` options.
 * @example
 * const markdownIt = require("markdown-it");
 * const markdownItContainer = require("markdown-it-container");
 *
 * markdownIt()
 *     .use(markdownItContainer, "rule-example", markdownItRuleExample({
 *         open(type, code, parserOptions, codeBlockToken) {
 *             // do something
 *         }
 *         close() {
 *             // do something
 *         }
 *     }))
 *     .render(text);
 *
 */
function markdownItRuleExample({ open, close }) {
    return {
        validate(info) {
            return /^\s*(?:in)?correct(?!\S)/u.test(info);
        },
        render(tokens, index) {
            const tagToken = tokens[index];

            if (tagToken.nesting < 0) {
                const text = close ? close() : void 0;

                // Return an empty string to avoid appending unexpected text to the output.
                return typeof text === "string" ? text : "";
            }

            const { type, parserOptionsJSON } = /^\s*(?<type>\S+)(\s+(?<parserOptionsJSON>.+?))?\s*$/u.exec(tagToken.info).groups;
            const parserOptions = { sourceType: "module", ...(parserOptionsJSON && JSON.parse(parserOptionsJSON)) };
            const codeBlockToken = tokens[index + 1];

            // Remove trailing newline and presentational `⏎` characters (https://github.com/eslint/eslint/issues/17627):
            const code = codeBlockToken.content
                .replace(/\n$/u, "")
                .replace(/⏎(?=\n)/gu, "");

            const text = open(type, code, parserOptions, codeBlockToken);

            // Return an empty string to avoid appending unexpected text to the output.
            return typeof text === "string" ? text : "";
        }
    };
}

module.exports = markdownItRuleExample;
