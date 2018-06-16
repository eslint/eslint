/**
 * @fileoverview A rule to set the maximum number of line of code in a function.
 * @author Pete Ward <peteward44@gmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const OPTIONS_SCHEMA = {
    type: "object",
    properties: {
        max: {
            type: "integer",
            minimum: 0
        },
        ignoreComments: {
            type: "boolean"
        },
        skipBlankLines: {
            type: "boolean"
        },
        ignoreIIFEs: {
            type: "boolean"
        }
    },
    additionalProperties: false
};

const OPTIONS_OR_INTEGER_SCHEMA = {
    oneOf: [
        OPTIONS_SCHEMA,
        {
            type: "integer",
            minimum: 1
        }
    ]
};

/**
 * Given a list of comment nodes, return the line numbers for those comments.
 * @param {Array} comments An array of comment nodes.
 * @returns {Map.<string,Node>} An array of line numbers containing comments.
 */
function getCommentLineNumbers(comments) {
    const map = new Map();

    if (!comments) {
        return map;
    }
    comments.forEach(comment => {
        for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
            map.set(i, comment);
        }
    });
    return map;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce a maximum number of line of code in a function",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/max-lines-per-function"
        },

        schema: [
            OPTIONS_OR_INTEGER_SCHEMA
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.lines;

        const option = context.options[0];
        let maxLines = 50;
        let ignoreComments = true;
        let skipBlankLines = true;
        let ignoreIIFEs = true;

        if (typeof option === "object") {
            if (typeof option.max === "number") {
                maxLines = option.max;
            } else if (typeof option.maximum === "number") {
                maxLines = option.maximum;
            }
            if (typeof option.ignoreComments === "boolean") {
                ignoreComments = option.ignoreComments;
            }
            if (typeof option.skipBlankLines === "boolean") {
                skipBlankLines = option.skipBlankLines;
            }
            if (typeof option.ignoreIIFEs === "boolean") {
                ignoreIIFEs = option.ignoreIIFEs;
            }
        } else if (typeof option === "number") {
            maxLines = option;
        }

        const commentLineNumbers = getCommentLineNumbers(sourceCode.getAllComments());

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Tells if a comment encompasses the entire line.
         * @param {string} line The source line with a trailing comment
         * @param {number} lineNumber The one-indexed line number this is on
         * @param {ASTNode} comment The comment to remove
         * @returns {boolean} If the comment covers the entire line
         */
        function isFullLineComment(line, lineNumber, comment) {
            const start = comment.loc.start,
                end = comment.loc.end,
                isFirstTokenOnLine = !line.slice(0, comment.loc.start.column).trim();

            return comment &&
                (start.line < lineNumber || (start.line === lineNumber && isFirstTokenOnLine)) &&
                (end.line > lineNumber || (end.line === lineNumber && end.column === line.length));
        }

        /**
         * Identifies is a node is a FunctionExpression which is part of an IIFE
         * @param {ASTNode} node Node to test
         * @returns {boolean} True if it's an IIFE
         */
        function isIIFE(node) {
            return node.type === "FunctionExpression" && node.parent && node.parent.type === "CallExpression";
        }

        /**
         * Count the lines in the function
         * @param {ASTNode} node Function AST node
         * @returns {void}
         * @private
         */
        function processFunction(node) {

            // attempting to process a FunctionExpression that's already been processed by a MethodDefinition or Property above it - so ignore
            if (node.type === "FunctionExpression" && node.parent && (node.parent.type === "MethodDefinition" || node.parent.type === "Property")) {
                return;
            }

            if (ignoreIIFEs && isIIFE(node)) {
                return;
            }
            let lineCount = 0;

            for (let i = node.loc.start.line - 1; i < node.loc.end.line; ++i) {
                const line = lines[i];

                if (ignoreComments) {
                    if (commentLineNumbers.has(i + 1) && isFullLineComment(line, i + 1, commentLineNumbers.get(i + 1))) {
                        continue;
                    }
                }

                if (skipBlankLines) {
                    if (line.match(/^\s*$/)) {
                        continue;
                    }
                }

                lineCount++;
            }

            if (lineCount > maxLines) {
                let functionNameNode = null;

                if (node.type === "FunctionExpression" || node.type === "FunctionDeclaration" || node.type === "ArrowFunctionExpression") {
                    functionNameNode = node;
                } else if ((node.type === "MethodDefinition" || node.type === "Property") && node.value.type === "FunctionExpression") {

                    // Get the name of the function from the FunctionExpression child object
                    functionNameNode = node.value;
                    functionNameNode.parent = node;
                }

                const name = functionNameNode ? astUtils.getFunctionNameWithKind(functionNameNode) : "function";

                context.report({
                    node,
                    message: "{{name}} has too many lines ({{lineCount}}). Maximum allowed is {{maxLines}}.",
                    data: { name, lineCount, maxLines }
                });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            FunctionDeclaration: processFunction,
            FunctionExpression: processFunction,
            ArrowFunctionExpression: processFunction,
            MethodDefinition: processFunction,
            Property: processFunction
        };
    }
};
