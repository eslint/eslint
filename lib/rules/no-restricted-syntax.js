/**
 * @fileoverview Rule to flag use of certain node types
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const esquery = require("esquery");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow specified syntax",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-restricted-syntax"
        },

        fixable: "code",

        schema: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "object",
                        properties: {
                            selector: { type: "string" },
                            message: { type: "string" },
                            replace: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            pattern: { type: "string" },
                                            replacement: { type: "string" }
                                        },
                                        required: ["pattern", "replacement"],
                                        additionalProperties: false
                                    }
                                ]
                            }
                        },
                        required: ["selector"],
                        additionalProperties: false
                    }
                ]
            },
            uniqueItems: true,
            minItems: 0
        },

        messages: {
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            restrictedSyntax: "{{message}}"
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;

        /**
         * Tries to replace the node using the given replacement.
         * @param {RuleFixer} fixer Rule fixer
         * @param {Node} node The node to fix
         * @param {string|object} selectorOrObject The selector or object
         * @returns {null|{range: [number, number], text: string}} null or a fix object
         */
        function tryReplacement(fixer, node, selectorOrObject) {
            if (typeof selectorOrObject.replace === "string") {
                return fixer.replaceText(
                    node,
                    selectorOrObject.replace
                );
            }

            const text = sourceCode.getText(node);

            const { pattern, replacement } =
                selectorOrObject.replace;

            const isRegex = pattern.startsWith("/") && /\/[gimuy]*$/u.test(pattern);

            if (!isRegex) {
                return fixer.replaceText(pattern, replacement);
            }

            const parsed = esquery.parse(`[attr=${pattern}]`).value;

            if (parsed.type !== "regexp") {
                return null;
            }

            const fixedText = text.replace(parsed.value, replacement);

            return fixer.replaceText(node, fixedText);
        }

        return context.options.reduce((result, selectorOrObject) => {
            const isStringFormat = (typeof selectorOrObject === "string");
            const hasCustomMessage = !isStringFormat && Boolean(selectorOrObject.message);

            const selector = isStringFormat ? selectorOrObject : selectorOrObject.selector;
            const message = hasCustomMessage ? selectorOrObject.message : `Using '${selector}' is not allowed.`;

            return Object.assign(result, {
                [selector](node) {
                    context.report({
                        node,
                        messageId: "restrictedSyntax",
                        data: { message },
                        fix(fixer) {
                            if (isStringFormat || !("replace" in selectorOrObject)) {
                                return null;
                            }

                            try {
                                return tryReplacement(fixer, node, selectorOrObject);
                            } catch {
                                return null;
                            }
                        }
                    });
                }
            });
        }, {});

    }
};
