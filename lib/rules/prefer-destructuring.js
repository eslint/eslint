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
         * Find the length to slice the nodeText since destructuring removes
         * the accessor syntax from the right hand side of the AST
         *
         * @param {Token} lastToken the last token in the reportNode
         * @param {SourceCode} sourceCode the source code object for simplicity
         * @returns {Object} removalState the state from the right hand side to move/remove the text
         */
        function findRightHandRemovalState(lastToken, sourceCode) {
            let lengthToRemove, accessorToken;

            if (lastToken) {

                // Calls to the object with dot syntax
                if (lastToken.type === "Identifier") {
                    accessorToken = lastToken;
                    const punctuator = sourceCode.getTokenBefore(lastToken);

                    lengthToRemove = lastToken.range[1] - punctuator.range[0];

                // Calls to the object with bracket syntax
                } else if (lastToken.type === "Punctuator" && lastToken.value === "]") {
                    accessorToken = sourceCode.getTokenBefore(lastToken);
                    const closingBracket = sourceCode.getTokenBefore(accessorToken);

                    lengthToRemove = lastToken.range[1] - closingBracket.range[0];
                }
            } else {

                // Case for no trailing semicolon
                lengthToRemove = lastToken.range[1] - lastToken.range[0];
            }

            return { lengthToRemove, accessorToken };
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

            const sourceCode = context.getSourceCode();
            const previousNode = sourceCode.getTokenBefore(reportNode);

            // Check to avoid issues with ASI
            if (previousNode && previousNode.type !== "Keyword" && previousNode.value !== ";") {
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

            if (!type) {
                return;
            }

            context.report({
                node: reportNode,
                message: `Use ${type} destructuring`,
                fix: fixer => {

                    // No-op if destructuring is type array
                    if (type === "array") {
                        return null;
                    }

                    const lastToken = sourceCode.getLastToken(reportNode);
                    const nodeText = sourceCode.getText(reportNode);

                    const removalState = findRightHandRemovalState(lastToken, sourceCode);
                    const removalIndex = nodeText.length - removalState.lengthToRemove;

                    let fixedText;

                    fixedText = nodeText.slice(0, removalIndex);

                    // Remove the left node to replace with destructured text
                    const noLeftNodeText = fixedText.slice(leftNode.name.length, fixedText.length);

                    if (!enforceForRenamedProperties) {
                        fixedText = `{ ${leftNode.name} }${noLeftNodeText}`;
                    } else {
                        fixedText = `{ ${removalState.accessorToken.value}: ${leftNode.name} }${noLeftNodeText}`;
                    }

                    // Wrap in parentheses to avoid syntax errors if no declaration
                    if (previousNode === null || (previousNode || {}).value === ";") {
                        fixedText = `(${fixedText})`;
                    }

                    return fixer.replaceText(reportNode, fixedText);
                }
            });
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
