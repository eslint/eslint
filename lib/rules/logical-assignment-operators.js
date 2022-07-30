/**
 * @fileoverview Rule to replace assignment expressions with logical operator assignment
 * @author Daniel Martens
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const astUtils = require("./utils/ast-utils.js");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


/**
 * Returns true iff either "undefined" or a void expression (eg. "void 0")
 * @param {ASTNode} expression Expression to check
 * @param {import('eslint-scope').Scope} scope Scope of the expression
 * @returns {boolean} True iff "undefined" or "void ..."
 */
function isUndefined(expression, scope) {
    if (expression.type === "Identifier" && expression.name === "undefined") {
        return astUtils.isReferenceToGlobalVariable(scope, expression);
    }

    return expression.type === "UnaryExpression" &&
           expression.operator === "void" &&
           expression.argument.type === "Literal" &&
           expression.argument.value === 0;
}

/**
 * Returns true iff the reference is either an identifier or member expression
 * @param {ASTNode} expression Expression to check
 * @returns {boolean} True for identifiers and member expressions
 */
function isReference(expression) {
    return (expression.type === "Identifier" && expression.name !== "undefined") ||
           expression.type === "MemberExpression";
}

/**
 * Returns true iff the expression checks for nullish with loose equals.
 * Examples: value == null, value == void 0
 * @param {ASTNode} expression Test condition
 * @param {import('eslint-scope').Scope} scope Scope of the expression
 * @returns {boolean} True iff implicit nullish comparison
 */
function isImplicitNullishComparison(expression, scope) {
    if (expression.type !== "BinaryExpression" || expression.operator !== "==") {
        return false;
    }

    const reference = isReference(expression.left) ? "left" : "right";
    const nullish = reference === "left" ? "right" : "left";

    return isReference(expression[reference]) &&
           (astUtils.isNullLiteral(expression[nullish]) || isUndefined(expression[nullish], scope));
}

/**
 * Condition with two equal comparisons.
 * @param {ASTNode} expression Condition
 * @returns {boolean} True iff matches ? === ? || ? === ?
 */
function isDoubleComparison(expression) {
    return expression.type === "LogicalExpression" &&
           expression.operator === "||" &&
           expression.left.type === "BinaryExpression" &&
           expression.left.operator === "===" &&
           expression.right.type === "BinaryExpression" &&
           expression.right.operator === "===";
}

/**
 * Returns true iff the expression checks for undefined and null.
 * Example: value === null || value === undefined
 * @param {ASTNode} expression Test condition
 * @param {import('eslint-scope').Scope} scope Scope of the expression
 * @returns {boolean} True iff explicit nullish comparison
 */
function isExplicitNullishComparison(expression, scope) {
    if (!isDoubleComparison(expression)) {
        return false;
    }
    const leftReference = isReference(expression.left.left) ? "left" : "right";
    const leftNullish = leftReference === "left" ? "right" : "left";
    const rightReference = isReference(expression.right.left) ? "left" : "right";
    const rightNullish = rightReference === "left" ? "right" : "left";

    return astUtils.isSameReference(expression.left[leftReference], expression.right[rightReference], true) &&
           ((astUtils.isNullLiteral(expression.left[leftNullish]) && isUndefined(expression.right[rightNullish], scope)) ||
           (isUndefined(expression.left[leftNullish], scope) && astUtils.isNullLiteral(expression.right[rightNullish])));
}

/**
 * Returns true for:
 * truthiness checks:  value, Boolean(value), !!value
 * falsyness checks:   !value, !Boolean(value)
 * nullish checks:     value == null, value === undefined || value === null
 * @param {ASTNode} expression Test condition
 * @param {import('eslint-scope').Scope} scope Scope of the expression
 * @returns {?{ reference: ASTNode, operator: '??'|'||'|'&&'}} Null if not a known existence
 */
function getExistence(expression, scope) {
    const isNegated = expression.type === "UnaryExpression" && expression.operator === "!";
    const base = isNegated ? expression.argument : expression;

    switch (true) {
        case isReference(base):
            return { reference: base, operator: isNegated ? "||" : "&&" };
        case base.type === "UnaryExpression" && base.operator === "!" && isReference(base.argument):
            return { reference: base.argument, operator: "&&" };
        case base.type === "CallExpression" && base.callee.name === "Boolean" && base.arguments.length === 1 && isReference(base.arguments[0]):
            return { reference: base.arguments[0], operator: isNegated ? "||" : "&&" };
        case isImplicitNullishComparison(expression, scope):
            return { reference: isReference(expression.left) ? expression.left : expression.right, operator: "??" };
        case isExplicitNullishComparison(expression, scope):
            return { reference: isReference(expression.left.left) ? expression.left.left : expression.left.right, operator: "??" };
        default: return null;
    }
}

/**
 * Returns true iff the node is inside a with block
 * @param {ASTNode} node Node to check
 * @returns {boolean} True iff passed node is inside a with block
 */
function isInsideWithBlock(node) {
    if (node.type === "Program") {
        return false;
    }

    return node.parent.type === "WithStatement" && node.parent.body === node ? true : isInsideWithBlock(node.parent);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Require or disallow assignment logical operator shorthand",
            recommended: false,
            url: "https://eslint.org/docs/rules/logical-assignment-operators"
        },

        schema: {
            type: "array",
            oneOf: [{
                items: [
                    { const: "always" },
                    {
                        type: "object",
                        properties: {
                            enforceForIfStatements: {
                                type: "boolean"
                            }
                        },
                        additionalProperties: false
                    }
                ],
                minItems: 0, // 0 for allowing passing no options
                maxItems: 2
            }, {
                items: [{ const: "never" }],
                minItems: 1,
                maxItems: 1
            }]
        },
        fixable: "code",
        // eslint-disable-next-line eslint-plugin/require-meta-has-suggestions -- Does not detect conditional suggestions
        hasSuggestions: true,
        messages: {
            assignment: "Assignment (=) can be replaced with operator assignment ({{operator}}).",
            useLogicalOperator: "Convert this assignment to use the operator {{ operator }}.",
            logical: "Logical expression can be replaced with an assignment ({{ operator }}).",
            if: "If can be replaced with operator assignment.",
            convertIf: "Replace this if with an logical assignment.",
            unexpected: "Unexpected logical operator assignment ({{operator}}) shorthand.",
            separate: "Separate the logical assignment into an assignment with a logical operator."
        }
    },

    create(context) {
        const mode = context.options[0] === "never" ? "never" : "always";
        const checkIf = mode === "always" && context.options.length > 1 && context.options[1].enforceForIfStatements;
        const sourceCode = context.getSourceCode();
        const isStrict = context.getScope().isStrict;

        /**
         * Do not fix if the access could be a getter
         * @param {ASTNode} assignment Assignment expression
         * @returns {boolean} True iff the fix is safe
         */
        function canBeFixed(assignment) {
            return assignment.left.type === "Identifier" &&
                   (isStrict || !isInsideWithBlock(assignment));
        }


        /**
         * Adds a fixer or suggestion whether on the fix is safe.
         * @param {{ messageId: string, node: ASTNode }} descriptor Report descriptor without fix or suggest
         * @param {{ messageId: string, fix: Function }} suggestion Adds the fix or the whole suggestion as only element in "suggest" to suggestion
         * @param {boolean} shouldBeFixed Fix iff the condition is true
         * @returns {Object} Descriptor with either an added fix or suggestion
         */
        function createConditionalFixer(descriptor, suggestion, shouldBeFixed) {
            if (shouldBeFixed) {
                return {
                    ...descriptor,
                    fix: suggestion.fix
                };
            }

            return {
                ...descriptor,
                suggest: [suggestion]
            };
        }


        /**
         * Returns the operator token for assignments and binary expressions
         * @param {ASTNode} node AssignmentExpression or BinaryExpression
         * @returns {import('eslint').AST.Token} Operator token between the left and right expression
         */
        function getOperatorToken(node) {
            return sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
        }

        if (mode === "never") {
            return {

                // foo ||= bar
                "AssignmentExpression"(assignment) {
                    if (!astUtils.isLogicalAssignmentOperator(assignment.operator)) {
                        return;
                    }

                    const descriptor = {
                        messageId: "unexpected",
                        node: assignment,
                        data: { operator: assignment.operator }
                    };
                    const suggestion = {
                        messageId: "separate",
                        data: { operator: assignment.operator },
                        *fix(ruleFixer) {
                            if (sourceCode.getCommentsInside(assignment).length > 0) {
                                return;
                            }

                            const operatorToken = getOperatorToken(assignment);

                            // -> foo = bar
                            yield ruleFixer.replaceText(operatorToken, "=");

                            const assignmentText = sourceCode.getText(assignment.left);
                            const operator = assignment.operator.slice(0, -1);

                            // -> foo = foo || bar
                            yield ruleFixer.insertTextAfter(operatorToken, ` ${assignmentText} ${operator}`);

                            const precedence = astUtils.getPrecedence(assignment.right) <= astUtils.getPrecedence({ type: "LogicalExpression", operator });

                            // ?? and || / && cannot be mixed but have same precedence
                            const mixed = assignment.operator === "??=" && astUtils.isLogicalExpression(assignment.right);

                            if (!astUtils.isParenthesised(sourceCode, assignment.right) && (precedence || mixed)) {

                                // -> foo = foo || (bar)
                                yield ruleFixer.insertTextBefore(assignment.right, "(");
                                yield ruleFixer.insertTextAfter(assignment.right, ")");
                            }
                        }
                    };

                    context.report(createConditionalFixer(descriptor, suggestion, canBeFixed(assignment)));
                }
            };
        }

        return {

            // foo = foo || bar
            "AssignmentExpression[operator='='][right.type='LogicalExpression']"(assignment) {
                if (!astUtils.isSameReference(assignment.left, assignment.right.left, true)) {
                    return;
                }

                const descriptor = {
                    messageId: "assignment",
                    node: assignment,
                    data: { operator: assignment.right.operator }
                };
                const suggestion = {
                    messageId: "useLogicalOperator",
                    data: { operator: assignment.operator },
                    *fix(ruleFixer) {
                        if (sourceCode.getCommentsInside(assignment).length > 0) {
                            return;
                        }

                        // No need for parenthesis around the assignment based on precedence as the precedence stays the same even with changed operator
                        const assignmentOperatorToken = getOperatorToken(assignment);

                        // -> foo ||= foo || bar
                        yield ruleFixer.insertTextBefore(assignmentOperatorToken, assignment.right.operator);

                        // -> foo ||= bar
                        yield ruleFixer.removeRange([assignment.right.range[0], assignment.right.right.range[0]]);

                        if (astUtils.isParenthesised(sourceCode, assignment.right.right)) {

                            // Opening parenthesis already removed
                            const closingParenthesis = sourceCode.getTokenAfter(assignment.right.right);

                            yield ruleFixer.remove(closingParenthesis);
                        }
                    }
                };

                context.report(createConditionalFixer(descriptor, suggestion, canBeFixed(assignment)));
            },

            // foo || (foo = bar)
            'LogicalExpression[right.type="AssignmentExpression"][right.operator="="]'(logical) {
                if (astUtils.isSameReference(logical.left, logical.right.left)) {
                    context.report({
                        messageId: "logical",
                        node: logical,
                        data: { operator: logical.operator },
                        *fix(ruleFixer) {
                            if (sourceCode.getCommentsInside(logical).length > 0) {
                                return;
                            }

                            const requiresParenthesis = logical.parent.type !== "ExpressionStatement" &&
                                                        (astUtils.getPrecedence({ type: "AssignmentExpression" }) < astUtils.getPrecedence(logical.parent));

                            if (!astUtils.isParenthesised(sourceCode, logical) && requiresParenthesis) {
                                yield ruleFixer.insertTextBefore(logical, "(");
                                yield ruleFixer.insertTextAfter(logical, ")");
                            }

                            // Right side has to be parenthesized, otherwise would be parsed as (foo || foo) = bar which is illegal
                            const leftToStartRight = [logical.range[0], logical.right.range[0]];

                            yield ruleFixer.removeRange(leftToStartRight); // -> foo = bar)

                            const endParenthesis = sourceCode.getTokenAfter(logical.right);

                            yield ruleFixer.remove(endParenthesis); // -> foo = bar

                            const operatorToken = getOperatorToken(logical.right);

                            yield ruleFixer.insertTextBefore(operatorToken, logical.operator); // -> foo ||= bar
                        }
                    });
                }
            },

            // if (foo) foo = bar
            "IfStatement[alternate=null]"(ifNode) {
                if (!checkIf) {
                    return;
                }

                const hasBody = ifNode.consequent.type === "BlockStatement";

                if (hasBody && ifNode.consequent.body.length !== 1) {
                    return;
                }

                const body = hasBody ? ifNode.consequent.body[0] : ifNode.consequent;
                const scope = context.getScope();
                const existence = getExistence(ifNode.test, scope);

                if (
                    body.type === "ExpressionStatement" &&
                    body.expression.type === "AssignmentExpression" &&
                    body.expression.operator === "=" &&
                    existence !== null &&
                    astUtils.isSameReference(existence.reference, body.expression.left)
                ) {
                    const descriptor = {
                        messageId: "if",
                        node: ifNode
                    };
                    const suggestion = {
                        messageId: "convertIf",
                        *fix(ruleFixer) {
                            const isElseIf = ifNode.parent.type === "IfStatement";

                            if (
                                sourceCode.getCommentsInside(ifNode).length > 0 ||
                                (isElseIf && sourceCode.getCommentsBefore(ifNode).length > 0)
                            ) {
                                return;
                            }

                            const firstBodyToken = sourceCode.getFirstToken(body);
                            const prevToken = sourceCode.getTokenBefore(ifNode, { skip: isElseIf ? 1 : 0 });

                            if (
                                prevToken !== null &&
                                prevToken.value !== ";" &&
                                prevToken.value !== "{" &&
                                firstBodyToken.type !== "Identifier" &&
                                firstBodyToken.type !== "Keyword"
                            ) {

                                // Do not fix if the fixed statement could be part of the previous statement (eg. fn() if (a == null) (a) = b --> fn()(a) ??= b)
                                return;
                            }


                            const operatorToken = getOperatorToken(body.expression);

                            yield ruleFixer.insertTextBefore(operatorToken, existence.operator); // -> if (foo) foo ||= bar

                            const ifNodeStart = isElseIf ? sourceCode.getTokenBefore(ifNode) : ifNode;

                            yield ruleFixer.removeRange([ifNodeStart.range[0], body.range[0]]); // -> foo ||= bar

                            yield ruleFixer.removeRange([body.range[1], ifNode.range[1]]); // -> foo ||= bar, only present if "if" had a body

                            const nextToken = sourceCode.getTokenAfter(body.expression);

                            if (hasBody && (nextToken !== null && nextToken.value !== ";")) {
                                yield ruleFixer.insertTextAfter(ifNode, ";");
                            }
                        }
                    };
                    const shouldBeFixed = ifNode.test.type !== "LogicalExpression";

                    context.report(createConditionalFixer(descriptor, suggestion, shouldBeFixed));
                }
            }
        };
    }
};
