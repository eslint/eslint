/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const esUtils = require("esutils");

const OPERATORS = [
    "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=",
    "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
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
        const int32Hint = !!option.int32Hint;
        const allSetting = option.all || "always";

        /*
         * Build maps of operators that must or must not
         * have spaces around them.
         */
        const spacesYes = { in: true, instanceof: true };
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
         * Determines whether a token appears to be an identifier.
         * TODO: Is this the best way to determine this?
         * TODO: This approach was copied from no-extra-parens.js line 283.
         * @param {ASTNode} token - the token to be tested
         * @returns {boolean} indicating whether it appears to be an identifier
         */
        function startsWithIdentifierPart(token) {
            const text = sourceCode.getText(token);

            return esUtils.code.isIdentifierPartES6(text.charCodeAt(0));
        }

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

                const value = op.value;

                if (value === "(" || value === ")") {
                    continue;
                }

                const type = op.type;

                if (type === "Punctuator" || type === "Keyword") {
                    const range = op.range;
                    const endOfPrev = tokens[i - 1].range[1];
                    const startOfOperator = range[0];
                    const endOfOperator = range[1];
                    const startOfNext = tokens[i + 1].range[0];

                    /*
                     * Spaces must surround the operator if either token
                     * is not an identifier.
                     */
                    const shouldHaveSpaces =
                        !(startsWithIdentifierPart(left) || left.type === "UnaryExpression") ||
                        !(startsWithIdentifierPart(right) || right.type === "UnaryExpression") ||
                        spacesYes[value];
                    const shouldNotHaveSpaces = spacesNo[value];
                    const hasSpaces =
                        endOfPrev < startOfOperator ||
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
                data: { must, operator },
                message: "Operator `{{operator}}` {{must}} be surrounded by spaces.",
                fix(fixer) {
                    const shouldHaveSpaces = spacesYes[operator];
                    const previousToken = sourceCode.getTokenBefore(culpritToken);
                    const nextToken = sourceCode.getTokenAfter(culpritToken);
                    const fixString = shouldHaveSpaces ? ` ${culpritToken.value} ` : culpritToken.value;

                    return fixer.replaceTextRange([previousToken.range[1], nextToken.range[0]], fixString);
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
