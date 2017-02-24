/**
 * @fileoverview Prefer destructuring from arrays and objects
 * @author Alex LaFroscia
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require destructuring from arrays and/or objects",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    array: {
                        type: "boolean"
                    },
                    object: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            },
            {
                type: "object",
                properties: {
                    enforceForRenamedProperties: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "code"
    },
    create(context) {

        let checkArrays = true;
        let checkObjects = true;
        let enforceForRenamedProperties = false;
        const enabledTypes = context.options[0];
        const additionalOptions = context.options[1];

        if (enabledTypes) {
            if (typeof enabledTypes.array !== "undefined") {
                checkArrays = enabledTypes.array;
            }

            if (typeof enabledTypes.object !== "undefined") {
                checkObjects = enabledTypes.object;
            }
        }

        if (additionalOptions) {
            if (typeof additionalOptions.enforceForRenamedProperties !== "undefined") {
                enforceForRenamedProperties = additionalOptions.enforceForRenamedProperties;
            }
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Determines if the given node node is accessing an array index
         *
         * This is used to differentiate array index access from object property
         * access.
         *
         * @param {ASTNode} node the node to evaluate
         * @returns {boolean} whether or not the node is an integer
         */
        function isArrayIndexAccess(node) {
            return Number.isInteger(node.property.value);
        }

        /**
         * Check that the `prefer-destructuring` rules are followed based on the
         * given left- and right-hand side of the assignment.
         *
         * Pulled out into a separate method so that VariableDeclarators and
         * AssignmentExpressions can share the same verification logic.
         *
         * @param {ASTNode} leftNode the left-hand side of the assignment
         * @param {ASTNode} rightNode the right-hand side of the assignment
         * @param {ASTNode} reportNode the node to report the error on
         * @returns {void}
         */
        function performCheck(leftNode, rightNode, reportNode) {
            if (rightNode.type !== "MemberExpression") {
                return;
            }

            let type;

            if (checkArrays && isArrayIndexAccess(rightNode)) {
                type = "array";
            }

            if (checkObjects) {
                const property = rightNode.property;
                const hasNameMatch = ((property.type === "Literal" && leftNode.name === property.value) ||
                                      (property.type === "Identifier" && leftNode.name === property.name));

                if (hasNameMatch || enforceForRenamedProperties) {
                    type = "object";
                }
            }

            if (!type) return;

            context.report({
              node: reportNode,
              message: `Use ${type} destructuring`,
              fix: fixer => {
                // If destructuring is type array, no-op
                // Thought to be impossible since accessing the first value via an index and accessing a value
                // through an iterator variable are fundamentally different and we can't tell the difference
                if (type === "array") {
                  return null;
                }

                const sourceCode = context.getSourceCode();
                const lastToken = sourceCode.getLastToken(reportNode);
                const nodeText = sourceCode.getText(reportNode);

                let fixedText;

                // Remove the last token and preceding punctuator
                const punctuator = sourceCode.getTokenBefore(lastToken);
                const lengthToRemove = lastToken.range[1] - punctuator.range[0];
                const removeIndex = nodeText.length - lengthToRemove;
                fixedText = nodeText.slice(0, removeIndex);

                // Remove the left node to replace with destructured text
                const noLeftNodeText = fixedText.slice(leftNode.name.length, fixedText.length);

                if (!enforceForRenamedProperties) {
                  fixedText = `{ ${leftNode.name} }${noLeftNodeText}`;
                } else {
                  fixedText = `{ ${lastToken.value}: ${leftNode.name} }${noLeftNodeText}`;
                }
                debugger;
                return fixer.replaceText(reportNode, fixedText);
              }
            });

            return;
        }

        /**
         * Check if a given variable declarator is coming from an property access
         * that should be using destructuring instead
         *
         * @param {ASTNode} node the variable declarator to check
         * @returns {void}
         */
        function checkVariableDeclarator(node) {

            // Skip if variable is declared without assignment
            if (!node.init) {
                return;
            }

            // We only care about member expressions past this point
            if (node.init.type !== "MemberExpression") {
                return;
            }

            performCheck(node.id, node.init, node);
        }

        /**
         * Run the `prefer-destructuring` check on an AssignmentExpression
         *
         * @param {ASTNode} node the AssignmentExpression node
         * @returns {void}
         */
        function checkAssigmentExpression(node) {
            if (node.operator === "=") {
                performCheck(node.left, node.right, node);
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            VariableDeclarator: checkVariableDeclarator,
            AssignmentExpression: checkAssigmentExpression
        };
    }
};
