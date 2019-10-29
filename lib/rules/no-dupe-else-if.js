/**
 * @fileoverview Rule to disallow duplicate conditions in if-else-if chains
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow duplicate conditions in if-else-if chains",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-dupe-else-if"
        },

        schema: [],

        messages: {
            unexpected: "Duplicate condition in if-else-if chain."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            IfStatement(node) {
                let current = node;

                while (current.parent && current.parent.type === "IfStatement" && current.parent.alternate === current) {
                    current = current.parent;

                    if (astUtils.equalTokens(node.test, current.test, sourceCode)) {
                        context.report({ node: node.test, messageId: "unexpected" });
                        break;
                    }
                }
            }
        };
    }
};
