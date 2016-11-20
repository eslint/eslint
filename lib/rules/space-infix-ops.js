/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const OPERATORS = [
    "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=", "in",
    "instanceof", "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
    "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",
    "?", ":", ",", "**"
];

const operatorEnum = { enum: ["always", "never", "ignore"] };
const schemaProperties = {
    int32Hint: { type: "boolean" },
    all: operatorEnum
};

OPERATORS.forEach(operator => {
    schemaProperties[operator] = operatorEnum;
});

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
                properties: schemaProperties,
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const option = context.options[0] || {};
        const int32Hint = Boolean(option.int32Hint);
        const allSetting = option.all || "always";

        // Build maps of operators that must or must not
        // have spaces around them.
        const spacesYes = {};
        const spacesNo = {};

        OPERATORS.forEach(operator => {
            const thisSetting = option[operator];

            if (thisSetting === "always" ||
                (allSetting === "always" && !thisSetting)) {
                spacesYes[operator] = true;
            } else if (thisSetting === "never" ||
              (allSetting === "never" && !thisSetting)) {
                spacesNo[operator] = true;
            }
        });

        const sourceCode = context.getSourceCode();

        /**
         * Returns the first token which violates the rule
         * @param {ASTNode} left - The left node of the main node
         * @param {ASTNode} right - The right node of the main node
         * @returns {Object} The violator token or null
         * @private
         */
        function getFirstViolatingToken(left, right) {
            const tokens = sourceCode.getTokensBetween(left, right, 1);

            for (let i = 1, l = tokens.length - 1; i < l; ++i) {
                const op = tokens[i];
                const type = op.type;
                const value = op.value;
                const range = op.range;

                if (type === "Punctuator" || type === "Keyword") {
                    const endOfPrev = tokens[i - 1].range[1];
                    const startOfOperator = range[0];
                    const endOfOperator = range[1];
                    const startOfNext = tokens[i + 1].range[0];
                    const shouldHaveSpaces = spacesYes[value];
                    const shouldNotHaveSpaces = spacesNo[value];
                    const hasSpaces =
                        endOfPrev < startOfOperator &&
                        endOfOperator < startOfNext;
                    const lacksSpaces =
                        endOfPrev === startOfOperator ||
                        endOfOperator === startOfNext;

                    if ((shouldHaveSpaces && lacksSpaces) ||
                        (shouldNotHaveSpaces && hasSpaces)) {
                        return op;
                    }
                }
            }
            return null;
        }

        /**
         * Reports an AST node as a rule violation
         * @param {ASTNode} mainNode - The node to report
         * @param {Object} culpritToken - The token which has a problem
         * @returns {void}
         * @private
         */
        function report(mainNode, culpritToken) {
            const operator = culpritToken.value;
            const must = spacesYes[operator] ? "must" : "must not";

            context.report({
                node: mainNode,
                loc: culpritToken.loc.start,
                message: `${operator} operator ${must} be surrounded by spaces.`,
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
            });
        }

        /**
         * Check if the node is binary then report
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkBinary(node) {
            if (node.left.typeAnnotation) {
                return;
            }

            const nonSpacedNode = getFirstViolatingToken(node.left, node.right);

            if (nonSpacedNode) {
                if (!(int32Hint && sourceCode.getText(node).substr(-2) === "|0")) {
                    report(node, nonSpacedNode);
                }
            }
        }

        /**
         * Check if the node is conditional
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkConditional(node) {
            const nonSpacedConsequesntNode = getFirstViolatingToken(node.test, node.consequent);
            const nonSpacedAlternateNode = getFirstViolatingToken(node.consequent, node.alternate);

            if (nonSpacedConsequesntNode) {
                report(node, nonSpacedConsequesntNode);
            } else if (nonSpacedAlternateNode) {
                report(node, nonSpacedAlternateNode);
            }
        }

        /**
         * Check if the node is a variable
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkVar(node) {
            if (node.init) {
                const nonSpacedNode = getFirstViolatingToken(node.id, node.init);

                if (nonSpacedNode) {
                    report(node, nonSpacedNode);
                }
            }
        }

        return {
            AssignmentExpression: checkBinary,
            AssignmentPattern: checkBinary,
            BinaryExpression: checkBinary,
            LogicalExpression: checkBinary,
            ConditionalExpression: checkConditional,
            VariableDeclarator: checkVar
        };

    }
};
