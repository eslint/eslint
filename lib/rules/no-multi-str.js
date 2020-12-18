/**
 * @fileoverview Rule to flag when using multiline strings
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const newLineAndWhiteSpaceMatcher = /\\(?<newline>\r\n|[\r\n\u2028\u2029])(?<whitespace>\s*)/gu;

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow multiline strings",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-multi-str"
        },

        schema: [],

        messages: {
            multilineString: "Multiline support is limited to browsers supporting ES5 only.",
            stringConcat: "Use string concat and preserve whitespace.",
            stringConcatTrim: "Use string concat and trim leading whitespace on each line."
        }
    },

    create(context) {

        /**
         * Determines if a given node is part of JSX syntax.
         * @param {ASTNode} node The node to check.
         * @returns {boolean} True if the node is a JSX node, false if not.
         * @private
         */
        function isJSXElement(node) {
            return node.type.indexOf("JSX") === 0;
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {

            Literal(node) {
                if (astUtils.LINEBREAK_MATCHER.test(node.raw) && !isJSXElement(node.parent)) {

                    const suggest = [];
                    const quote = node.raw[0];

                    if (quote === "'" || quote === "\"") {
                        if (newLineAndWhiteSpaceMatcher.test(node.raw)) {

                            suggest.push({
                                messageId: "stringConcat",
                                fix(fixer) {
                                    const newLiteral = node.raw.replace(newLineAndWhiteSpaceMatcher, `${quote} +$<newline>${quote}$<whitespace>`);

                                    return fixer.replaceText(node, newLiteral);
                                }
                            });

                            suggest.push({
                                messageId: "stringConcatTrim",
                                fix(fixer) {
                                    const newLiteral = node.raw.replace(newLineAndWhiteSpaceMatcher, `${quote} +$<newline>$<whitespace>${quote}`);

                                    return fixer.replaceText(node, newLiteral);
                                }
                            });
                        }
                    }

                    context.report({
                        node,
                        messageId: "multilineString",
                        suggest
                    });
                }
            }
        };

    }
};
