/**
 * @fileoverview Rule to flag constant comparisons and logical expressions that always/never short circuit
 * @author Jordan Eldredge <https://jordaneldredge.com>
 */

"use strict";

const { isNullOrUndefined } = require("./utils/ast-utils");

const NUMERIC_OR_STRING_BINARY_OPERATORS = new Set(["+", "-", "*", "/", "%", "|", "^", "&"]);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Test if an AST node has a statically knowable constant truthiness. Meaning,
 * it will always coerce to either `true` or `false` when cast directly to
 * boolean.
 * @param {ASTNode} node The AST node being tested.
 * @returns {boolean} Does `node` have constant truthiness?
 */
function hasConstantTruthiness(node) {
    switch (node.type) {
        case "ObjectExpression": // Objects are always truthy
        case "ArrayExpression": // Arrays are always truthy
        case "ArrowFunctionExpression": // Functions are always truthy
        case "FunctionExpression": // Functions are always truthy
        case "ClassExpression": // Classes are always truthy
        case "NewExpression": // Objects are always truthy
        case "Literal": // Truthy, or falsy, literals never change
            return true;
        case "CallExpression": {
            if (node.callee.type === "Identifier" && node.callee.name === "Boolean") {
                return node.arguments.length === 0 || hasConstantTruthiness(node.arguments[0]);
            }
            return false;
        }
        case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
        case "JSXFragment":
            return false;
        case "AssignmentExpression":
            if (node.operator !== "=") {
                return false; // We won't go so far as to try to evaluate += etc.
            }
            return hasConstantTruthiness(node.right);
        case "TemplateLiteral":

            /*
             * Possible future direction if needed: If all quasis are empty, we
             * could look at node.expressions and try to determine if they are
             * static truthinesss.
             */
            return node.quasis.some(quasi => quasi.value.cooked.length);
        case "UnaryExpression":
            if (node.operator === "void" || // Always returns `undefined`
                node.operator === "typeof" // All type strings are truthy
            ) {
                return true;
            }
            if (node.operator === "!") {
                return hasConstantTruthiness(node.argument);
            }

            /*
             * We won't try to reason about +, -, ~, or delete
             * Possible future direction if needed: In theory, for the
             * mathematical operators, we could look at the argument and try to
             * determine if it coerces to a constant numeric value.
             */
            return false;
        case "SequenceExpression": {
            const last = node.expressions[node.expressions.length - 1];

            return hasConstantTruthiness(last);
        }
        case "Identifier": {
            return node.name === "undefined";
        }

        default:
            return false;
    }
}

/**
 * Test if an AST node has a statically knowable constant nullishness. Meaning,
 * it will always resolve to a constant value of either: `null`, `undefined`
 * or not `null` _or_ `undefined`. An expression that can vary between those
 * three states at runtime would return `false`.
 * @param {ASTNode} node The AST node being tested.
 * @returns {boolean} Does `node` have constant nullishness?
 */
function hasConstantNullishness(node) {
    switch (node.type) {
        case "ObjectExpression": // Objects are never nullish
        case "ArrayExpression": // Arrays are never nullish
        case "ArrowFunctionExpression": // Functions never nullish
        case "FunctionExpression": // Functions are never nullish
        case "ClassExpression": // Classes are never nullish
        case "NewExpression": // Objects are never nullish
        case "Literal": // Nullish, or non-nullish, literals never change
        case "TemplateLiteral": // A string is never nullish
        case "UpdateExpression": // Numbers are never nullish
        case "BinaryExpression": // Numbers, strings, or booleans are never nullish
            return true;
        case "CallExpression": {
            if (node.callee.type !== "Identifier") {
                return false;
            }
            const functionName = node.callee.name;

            return (functionName === "Boolean" || functionName === "String" || functionName === "Number");
        }
        case "AssignmentExpression":
            if (node.operator === "=") {
                return hasConstantNullishness(node.right);
            }

            /*
             * Handling short-circuiting assignment operators would require
             * walking the scope. We won't attempt that (for now...) /
             */
            if (
                node.operator === "&&=" ||
                node.operator === "||=" ||
                node.operator === "??="
            ) {
                return false;
            }

            /*
             * The remaining assignment expressions all result in a numeric or
             * string (non-nullish) value:
             *   "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "|=", "^=", "&="
             */

            return true;
        case "UnaryExpression":

            /*
             * "void" Always returns `undefined`
             * "typeof" All types are strings, and thus non-nullish
             * "!" Boolean is never nullish
             * "delete" Returns a boolean, which is never nullish
             * Math operators always return numbers or strings, neither of which
             * are non-nullish "+", "-", "~"
             */

            return true;
        case "SequenceExpression": {
            const last = node.expressions[node.expressions.length - 1];

            return hasConstantNullishness(last);
        }
        case "Identifier":
            return node.name === "undefined";
        case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
        case "JSXFragment":
            return false;
        default:
            return false;
    }
}

/**
 * Test if an AST node is a boolean value that never changes. Specifically we
 * test for:
 * 1. Literal booleans (`true` or `false`)
 * 2. Unary `!` expressions with a constant value
 * 3. Constant booleans created via the `Boolean` global function
 * @param {ASTNode} node The node to test
 * @returns {boolean} Is `node` guaranteed to be a boolean?
 */
function isStaticBoolean(node) {
    switch (node.type) {
        case "Literal":
            return typeof node.value === "boolean";
        case "CallExpression":
            return node.callee.type === "Identifier" && node.callee.name === "Boolean" &&
         (node.arguments.length === 0 || hasConstantTruthiness(node.arguments[0]));
        case "UnaryExpression":
            return node.operator === "!" && hasConstantTruthiness(node.argument);
        default:
            return false;
    }
}


/**
 * Test if an AST node will always give the same result when compared to a
 * bolean value. Note that comparison to boolean values is different than
 * truthiness.
 * https://262.ecma-international.org/5.1/#sec-11.9.3
 *
 * Javascript `==` operator works by converting the boolean to `1` (true) or
 * `+0` (false) and then checks the values `==` equality to that number.
 * @param {ASTNode} node The node to test
 * @returns {boolean} Will `node` always coerce to the same boolean value?
 */
function hasConstantLooseBooleanComparison(node) {
    switch (node.type) {
        case "ObjectExpression":
        case "ClassExpression":

            /**
             * In theory objects like:
             *
             * `{toString: () => a}`
             * `{valueOf: () => a}`
             *
             * Or a classes like:
             *
             * `class { static toString() { return a } }`
             * `class { static valueOf() { return a } }`
             *
             * Are not constant verifiably when `inBooleanPosition` is
             * false, but it's an edge case we've opted not to handle.
             */
            return true;
        case "ArrayExpression":
            if (node.elements.length === 1) {

                /*
                 * Possible future direction if needed: We could check if the
                 * single value would result in variable boolean comparison.
                 * For now we will err on the side of caution since `[x]` could
                 * evaluate to `[0]` or `[1]`.
                 */

                return false;
            }
            return true;
        case "ArrowFunctionExpression":
        case "FunctionExpression":
            return true;
        case "UnaryExpression":
            if (node.operator === "void" || // Always returns `undefined`
                node.operator === "typeof" // All type strings are truthy
            ) {
                return true;
            }
            if (node.operator === "!") {
                return hasConstantTruthiness(node.argument);
            }

            /*
             * We won't try to reason about +, -, ~, or delete
             * In theory, for the mathematical operators, we could look at the
             * argument and try to determine if it coerces to a constant numeric
             * value.
             */
            return false;
        case "NewExpression": // Objects might have custom `.valueOf` or `.toString`.
            return false;
        case "CallExpression": {
            if (node.callee.type === "Identifier" && node.callee.name === "Boolean") {
                return node.arguments.length === 0 || hasConstantTruthiness(node.arguments[0]);
            }
            return false;
        }
        case "Literal": // True or false, literals never change
            return true;
        case "Identifier":
            return node.name === "undefined";
        case "TemplateLiteral":

            /*
             * In theory we could try to check if the quasi are sufficient to
             * prove that the expression will always be true, but it would be
             * tricky to get right. For example: `000.${foo}000`
             */
            return node.expressions.length === 0;
        case "AssignmentExpression":
            if (node.operator === "=") {
                return hasConstantLooseBooleanComparison(node.right);
            }

            /*
             * Handling short-circuiting assignment operators would require
             * walking the scope. We won't attempt that (for now...)
             *
             * The remaining assignment expressions all result in a numeric or
             * string (non-nullish) values which could be truthy or falsy:
             *   "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "|=", "^=", "&="
             */
            return false;
        case "SequenceExpression": {
            const last = node.expressions[node.expressions.length - 1];

            return hasConstantLooseBooleanComparison(last);
        }
        case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
        case "JSXFragment":
            return false;
        default:
            return false;
    }
}


/**
 * Test if an AST node will always give the same result when _strictly_ compared
 * to a bolean value. This can happen if the expression can never be boolean, or
 * if it is always the same boolean value.
 * @param {ASTNode} node The node to test
 * @returns {boolean} Will `node` always give the same result when compared to a
 * static boolean value?
 */
function hasConstantStrictBooleanComparison(node) {
    switch (node.type) {
        case "ObjectExpression": // Objects are not booleans
        case "ArrayExpression": // Arrays are not booleans
        case "ArrowFunctionExpression": // Functions are not booleans
        case "FunctionExpression":
        case "ClassExpression": // Classes are not booleans
        case "NewExpression": // Objects are not booleans
        case "TemplateLiteral": // Strings are not booleans
        case "Literal": // True, false, or not boolean, literals never change.
        case "UpdateExpression": // Numbers are not booleans
            return true;
        case "BinaryExpression":
            return NUMERIC_OR_STRING_BINARY_OPERATORS.has(node.operator);
        case "UnaryExpression": {
            if (node.operator === "delete") {
                return false;
            }
            if (node.operator === "!") {
                return hasConstantTruthiness(node.argument);
            }

            /*
             * The remaining operators return either strings or numbers, neither
             * of which are boolean.
             */
            return true;
        }
        case "SequenceExpression": {
            const last = node.expressions[node.expressions.length - 1];

            return hasConstantStrictBooleanComparison(last);
        }
        case "Identifier":
            return node.name === "undefined";
        case "AssignmentExpression":
            if (node.operator === "=") {
                return hasConstantStrictBooleanComparison(node.right);
            }

            /*
             * Handling short-circuiting assignment operators would require
             * walking the scope. We won't attempt that (for now...)
             */
            if (node.operator === "&&=" || node.operator === "||=" || node.operator === "??=") {
                return false;
            }

            /*
             * The remaining assignment expressions all result in either a number
             * or a string, neither of which can ever be boolean.
             */
            return true;
        case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
        case "JSXFragment":
            return false;
        default:
            return false;
    }
}

/**
 * Test if an AST node will always result in a newly constructed object
 * @param {ASTNode} node The node to test
 * @returns {boolean} Will `node` always be new?
 */
function isAlwaysNew(node) {
    switch (node.type) {
        case "ObjectExpression":
        case "ArrayExpression":
        case "ArrowFunctionExpression":
        case "FunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return true;
        case "Literal":

            // Regular expressions are objects, and thus always new
            return typeof node.regex === "object";
        case "SequenceExpression": {
            const last = node.expressions[node.expressions.length - 1];

            return isAlwaysNew(last);
        }
        case "AssignmentExpression":
            if (node.operator === "=") {
                return isAlwaysNew(node.right);
            }
            return false;
        case "ConditionalExpression":
            return isAlwaysNew(node.consequent) && isAlwaysNew(node.alternate);
        case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
        case "JSXFragment":
            return false;
        default:
            return false;
    }
}


/**
 * Checks if one operand will cause the result to be constant.
 * @param {ASTNode} a One side of the expression
 * @param {ASTNode} b The other side of the expression
 * @param {string} operator The binary expression operator
 * @returns {ASTNode | null} The node which will cause the expression to have a constant result.
 */
function findBinaryExpressionConstantOperand(a, b, operator) {
    if (operator === "==" || operator === "!=") {
        if (
            (isNullOrUndefined(a) && hasConstantNullishness(b)) ||
            (isStaticBoolean(a) && hasConstantLooseBooleanComparison(b)) ||

            /*
             * If both sides are "new", then both sides are objects and
             * therefore they will be compared by reference even with `==`
             * equality.
             */
            (isAlwaysNew(a) && isAlwaysNew(b))
        ) {
            return b;
        }
    } else if (operator === "===" || operator === "!==") {
        if (
            (isNullOrUndefined(a) && hasConstantNullishness(b)) ||
            (isStaticBoolean(a) && hasConstantStrictBooleanComparison(b))
        ) {
            return b;
        }
    }
    return null;
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow expressions where the operation doesn’t affect the value",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-constant-binary-expression"
        },
        schema: [],
        messages: {
            constantBinaryOperand: "Unexpected constant binary expression. Compares constantly with the {{otherSide}}-hand side of the `{{operator}}`.",
            constantShortCircuit: "Unexpected constant {{property}} on the left-hand side of a `{{operator}}` expression.",
            alwaysNew: "Unexpected comparison to newly constructed object. These two values can never be equal."
        }
    },

    create(context) {
        return {
            LogicalExpression(node) {
                const { operator, left } = node;

                if ((operator === "&&" || operator === "||") && hasConstantTruthiness(left)) {
                    context.report({ node: left, messageId: "constantShortCircuit", data: { property: "truthiness", operator } });
                } else if (operator === "??" && hasConstantNullishness(left)) {
                    context.report({ node: left, messageId: "constantShortCircuit", data: { property: "nullishness", operator } });
                }
            },
            BinaryExpression(node) {

                const { right, left, operator } = node;
                const rightConstantOperand = findBinaryExpressionConstantOperand(left, right, operator);
                const leftConstantOperand = findBinaryExpressionConstantOperand(right, left, operator);

                if (rightConstantOperand) {
                    context.report({ node: rightConstantOperand, messageId: "constantBinaryOperand", data: { operator, otherSide: "left" } });
                } else if (leftConstantOperand) {
                    context.report({ node: leftConstantOperand, messageId: "constantBinaryOperand", data: { operator, otherSide: "right" } });
                } else if (operator === "===" || operator === "!==") {
                    if (isAlwaysNew(left)) {
                        context.report({ node: left, messageId: "alwaysNew" });
                    } else if (isAlwaysNew(right)) {
                        context.report({ node: right, messageId: "alwaysNew" });
                    }
                }

            }

            /*
             * In theory we could handle short circuting assignment operators,
             * for some constant values, but that would require walking the
             * scope to find the value of the variable being assigned. This is
             * dependant on https://github.com/eslint/eslint/issues/13776
             *
             * AssignmentExpression() {},
             */
        };
    }
};
