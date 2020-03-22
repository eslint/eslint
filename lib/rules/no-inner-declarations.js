/**
 * @fileoverview Rule to enforce declarations in program or function body root.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validParent = ["Program", "ExportNamedDeclaration", "ExportDefaultDeclaration"];
const validBlockStatementParent = ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"];

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow variable or `function` declarations in nested blocks",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-inner-declarations"
        },

        schema: [
            {
                enum: ["functions", "both"]
            }
        ],

        messages: {
            moveDeclToRoot: "Move {{type}} declaration to {{body}} root."
        }
    },

    create(context) {

        /**
         * Ensure that a given node is at a program or function body's root.
         * @param {ASTNode} node Declaration node to check.
         * @returns {void}
         */
        function check(node) {
            const ancestors = context.getAncestors();
            let ancestor = ancestors.pop();

            if (
                ancestor.type === "BlockStatement" &&
            !!~validBlockStatementParent.indexOf(ancestor.parent.type)
            ) {
                return;
            }

            if ((~validParent.indexOf(ancestor.type))) {
                return;
            }

            let parentsListToCheck = ancestor.type === "BlockStatement" ? validBlockStatementParent : validParent;

            while (ancestor && !~parentsListToCheck.indexOf(ancestor.type)) {
                ancestor = ancestors.pop();
                if (ancestor.type === "BlockStatement") {
                    ancestor = ancestor.parent;
                    parentsListToCheck = validBlockStatementParent;
                } else {
                    parentsListToCheck = validParent;
                }
            }

            context.report({
                node,
                messageId: "moveDeclToRoot",
                data: {
                    type: (node.type === "FunctionDeclaration" ? "function" : "variable"),
                    body: (ancestor.type === "Program" ? "program" : "function body")
                }
            });
        }


        return {

            FunctionDeclaration: check,
            VariableDeclaration(node) {
                if (context.options[0] === "both" && node.kind === "var") {
                    check(node);
                }
            }

        };

    }
};
