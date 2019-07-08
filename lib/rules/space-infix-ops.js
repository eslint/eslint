/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */
"use strict";

/**
 * Returns the first token which violates the rule
 * @param {SourceCode} sourceCode The source code object to get the operator
 * @param {ASTNode} left - The left node of the main node
 * @param {ASTNode} right - The right node of the main node
 * @param {string} op - The operator of the main node
 * @returns {Object} The violator token or null
 * @private
 */
function getFirstNonSpacedToken({ sourceCode, left, right, op }) {
    const operator = sourceCode.getFirstTokenBetween(left, right, token => token.value === op);
    const prev = sourceCode.getTokenBefore(operator);
    const next = sourceCode.getTokenAfter(operator);

    if (!sourceCode.isSpaceBetweenTokens(prev, operator) || !sourceCode.isSpaceBetweenTokens(operator, next)) {
        return operator;
    }

    return null;
}

/**
 * Reports an AST node as a rule violation
 * @param {SourceCode} sourceCode - The source code object to get the tokens
 * @param {ASTNode} mainNode - The node to report
 * @param {Object} culpritToken - The token which has a problem
 * @returns {MessageDescriptor} descriptor A descriptor for the report from a rule.
 * @private
 */
function getDescriptor({ sourceCode, mainNode, culpritToken }) {
    return {
        node: mainNode,
        loc: culpritToken.loc.start,
        message: "Operator '{{operator}}' must be spaced.",
        data: {
            operator: culpritToken.value
        },
        fix(fixer) {
            const previousToken = sourceCode.getTokenBefore(culpritToken);
            const afterToken = sourceCode.getTokenAfter(culpritToken);
            let fixString = "";

            if (culpritToken.range[0] - previousToken.range[1] === 0) {
                fixString = " ";
            }

            fixString += culpritToken.value;

            if (afterToken.range[0] - culpritToken.range[1] === 0) {
                fixString += " ";
            }

            return fixer.replaceText(culpritToken, fixString);
        }
    };
}

/**
 * Check if the node is binary then report
 * @param {SourceCode} sourceCode - sourceCode object of the file
 * @param {ASTNode} node node to evaluate
 * @param {boolean} int32Hint is int32Hint or not
 * @returns {MessageDescriptor | null} descriptor A descriptor for the report from a rule.
 * @public
 */
function checkBinary({ sourceCode, node, int32Hint }) {
    const leftNode = (node.left.typeAnnotation) ? node.left.typeAnnotation : node.left;
    const rightNode = node.right;

    // search for = in AssignmentPattern nodes
    const operator = node.operator || "=";

    const nonSpacedNode = getFirstNonSpacedToken({
        sourceCode,
        left: leftNode,
        right: rightNode,
        op: operator
    });

    if (
        nonSpacedNode &&
        !(int32Hint && sourceCode.getText(node).endsWith("|0"))
    ) {
        return getDescriptor({
            sourceCode,
            mainNode: node,
            culpritToken: nonSpacedNode
        });
    }
    return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "require spacing around infix operators",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/space-infix-ops"
        },

        fixable: "whitespace",

        schema: [
            {
                type: "object",
                properties: {
                    int32Hint: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const int32Hint = context.options[0] ? context.options[0].int32Hint === true : false;
        const sourceCode = context.getSourceCode();

        /**
         * Check if the node is conditional
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkConditional(node) {
            const nonSpacedConsequesntNode = getFirstNonSpacedToken({
                sourceCode,
                left: node.test,
                right: node.consequent,
                op: "?"
            });
            const nonSpacedAlternateNode = getFirstNonSpacedToken({
                sourceCode,
                left: node.consequent,
                right: node.alternate,
                op: ":"
            });

            if (nonSpacedConsequesntNode) {
                context.report(getDescriptor({
                    context,
                    sourceCode,
                    mainNode: node,
                    culpritToken: nonSpacedConsequesntNode
                }));
            } else if (nonSpacedAlternateNode) {
                context.report(getDescriptor({
                    context,
                    sourceCode,
                    mainNode: node,
                    culpritToken: nonSpacedAlternateNode
                }));
            }
        }

        /**
         * Check if the node is a variable
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkVar(node) {
            const leftNode = (node.id.typeAnnotation) ? node.id.typeAnnotation : node.id;
            const rightNode = node.init;

            if (rightNode) {
                const nonSpacedNode = getFirstNonSpacedToken({
                    sourceCode,
                    left: leftNode,
                    right: rightNode,
                    op: "="
                });

                if (nonSpacedNode) {
                    context.report(getDescriptor({
                        context,
                        sourceCode,
                        mainNode: node,
                        culpritToken: nonSpacedNode
                    }));
                }
            }
        }

        /**
         * Check if the node is binary then report
         * @param {ASTNode} node node to evaluate
         * @param {boolean} int32Hint is int32Hint or not
         * @returns {void}
         * @private
         */
        function checkBinaryImpl(node) {
            const descriptor = checkBinary({ sourceCode, node, int32Hint });

            if (descriptor !== null) {
                context.report(descriptor);
            }
        }

        return {
            AssignmentExpression: checkBinaryImpl,
            AssignmentPattern: checkBinaryImpl,
            BinaryExpression: checkBinaryImpl,
            LogicalExpression: checkBinaryImpl,
            ConditionalExpression: checkConditional,
            VariableDeclarator: checkVar
        };

    }
};

module.exports.checkBinary = checkBinary;
