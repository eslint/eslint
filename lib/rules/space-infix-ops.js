/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require spacing around infix operators",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                type: "object",
                properties: {
                    int32Hint: {
                        type: "boolean"
                    },
                    exceptions: {
                        type: "object",
                        patternProperties: {
                            "^([A-Z][a-z]*)+$": {
                                enum: ["always", "never", "ignore"]
                            }
                        },
                        additionalProperties: false
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = context.options[0];
        const int32Hint = options ? options.int32Hint === true : false;
        const exceptions = options && options.exceptions;
        const neverExceptions = new Set();
        const ignoreExceptions = new Set();

        if (exceptions) {
            Object.keys(exceptions).forEach(nodeType => {
                if (exceptions[nodeType] === "never") {
                    neverExceptions.add(nodeType);
                } else if (exceptions[nodeType] === "ignore") {
                    ignoreExceptions.add(nodeType);
                }
            });
        }

        const OPERATORS = [
            "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=", "in",
            "instanceof", "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
            "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",
            "?", ":", ",", "**"
        ];

        const sourceCode = context.getSourceCode();

        /**
         * Returns the first token which violates the rule
         * @param {ASTNode} left - The left node of the main node
         * @param {ASTNode} right - The right node of the main node
         * @param {boolean} never - How to apply the rule - "always", "never", or "ignore"
         * @returns {Object} The violator token or null
         * @private
         */
        function getFirstNonSpacedToken(left, right, never) {
            const comparator = never ? (a, b) => a < b : (a, b) => a >= b;
            const tokens = sourceCode.getTokensBetween(left, right, 1);

            for (let i = 1, l = tokens.length - 1; i < l; ++i) {
                const op = tokens[i];
                const opStart = op.range[0];
                const opEnd = op.range[1];
                const prevEnd = tokens[i - 1].range[1];
                const nextStart = tokens[i + 1].range[0];

                if (
                    (op.type === "Punctuator" || op.type === "Keyword") &&
                    OPERATORS.indexOf(op.value) >= 0 &&
                    (comparator(prevEnd, opStart) || comparator(opEnd, nextStart))
                ) {
                    return op;
                }
            }
            return null;
        }

        /**
         * Reports an AST node as a rule violation
         * @param {ASTNode} mainNode - The node to report
         * @param {Object} culpritToken - The token which has a problem
         * @param {boolean} never - Should lack of spaces be enforced?
         * @returns {void}
         * @private
         */
        function report(mainNode, culpritToken, never) {
            context.report({
                node: mainNode,
                loc: culpritToken.loc.start,
                message: "Infix operators must be spaced.",
                fix(fixer) {
                    const prevToken = sourceCode.getTokenBefore(culpritToken);
                    const nextToken = sourceCode.getTokenAfter(culpritToken);
                    const prevEnd = prevToken.range[1];
                    const nextStart = nextToken.range[0];
                    const culpritStart = culpritToken.range[0];
                    const culpritEnd = culpritToken.range[1];
                    let fixString = "";

                    if (never) {
                        return fixer.replaceTextRange([prevEnd, nextStart], culpritToken.value);
                    }

                    if (culpritStart - prevEnd === 0) {
                        fixString += " ";
                    }

                    fixString += culpritToken.value;

                    if (nextStart - culpritEnd === 0) {
                        fixString += " ";
                    }

                    return fixer.replaceText(culpritToken, fixString);
                }
            });
        }

        /**
         * Check if the node is binary then report
         * @param {ASTNode} node - The node to evaluate
         * @param {boolean} never - Should lack of spaces be enforced?
         * @returns {void}
         * @private
         */
        function checkBinary(node, never) {
            if (node.left.typeAnnotation) {
                return;
            }

            const nonSpacedNode = getFirstNonSpacedToken(node.left, node.right, never);

            if (nonSpacedNode) {
                if (!(int32Hint && sourceCode.getText(node).substr(-2) === "|0")) {
                    report(node, nonSpacedNode, never);
                }
            }
        }

        /**
         * Check if the node is conditional
         * @param {ASTNode} node - The node to evaluate
         * @param {boolean} never - Should lack of spaces be enforced?
         * @returns {void}
         * @private
         */
        function checkConditional(node, never) {
            const nonSpacedConsequesntNode = getFirstNonSpacedToken(node.test, node.consequent, never);
            const nonSpacedAlternateNode = getFirstNonSpacedToken(node.consequent, node.alternate, never);

            if (nonSpacedConsequesntNode) {
                report(node, nonSpacedConsequesntNode, never);
            } else if (nonSpacedAlternateNode) {
                report(node, nonSpacedAlternateNode, never);
            }
        }

        /**
         * Check if the node is a variable
         * @param {ASTNode} node - The node to evaluate
         * @param {boolean} never - Should lack of spaces be enforced?
         * @returns {void}
         * @private
         */
        function checkVar(node, never) {
            if (node.init) {
                const nonSpacedNode = getFirstNonSpacedToken(node.id, node.init, never);

                if (nonSpacedNode) {
                    report(node, nonSpacedNode, never);
                }
            }
        }

        const checks = {
            AssignmentExpression: checkBinary,
            AssignmentPattern: checkBinary,
            BinaryExpression: checkBinary,
            LogicalExpression: checkBinary,
            ConditionalExpression: checkConditional,
            VariableDeclarator: checkVar
        };

        if (exceptions) {
            Object.keys(checks).forEach(nodeType => {
                const check = checks[nodeType];

                if (ignoreExceptions.has(nodeType)) {
                    delete checks[nodeType];
                } else {
                    checks[nodeType] = node => check(node, neverExceptions.has(nodeType));
                }
            });
        }

        return checks;
    }
};
