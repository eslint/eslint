/**
 * @fileoverview Rule to restrict what can be thrown as an exception.
 * @author Dieter Oberkofler
 */

"use strict";

const astUtils = require("../ast-utils");
const _ = require("lodash");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow throwing literals as exceptions",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-throw-literal"
        },
        fixable: "code",
        schema: []
    },

    create(context) {

        const sourceCode = context.getSourceCode();

        /**
         * Report the error message
         * @param {string} value which is thrown
         * @param {boolean} containsSemi either the literal ends with semicolon
         * @returns {string} new text to be replaced with the wrong code
         */
        function createThrowNewErrorStatement(value, containsSemi) {
            const semiInsertion = containsSemi ? ";" : "";

            return `throw new Error(${value})${semiInsertion}`;
        }

        return {

            ThrowStatement(node) {
                if (!astUtils.couldBeError(node.argument)) {
                    context.report({
                        node,
                        message: "Expected an object to be thrown.",
                        fix(fixer) {
                            const containsSemicolon = sourceCode.getText().endsWith(";");
                            const value = _.get(node.argument, "value");
                            let newText = null;

                            if (_.isString(value)) {
                                const literal = node.argument.raw;

                                newText = createThrowNewErrorStatement(literal, containsSemicolon);
                            } else if (_.isNumber(value) || _.isBoolean(value) || (_.has(node.argument, "value") && (_.isNull(value) || _.isUndefined(value)))) {
                                newText = createThrowNewErrorStatement(value, containsSemicolon);
                            }

                            return fixer.replaceText(node, newText);
                        }
                    });
                } else if (node.argument.type === "Identifier") {
                    if (node.argument.name === "undefined") {
                        context.report({ node, message: "Do not throw undefined." });
                    }
                }

            }

        };

    }
};
