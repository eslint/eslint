/**
 * @fileoverview Rule to flag constant comparisons and logical expressions that always/never short circuit
 * @author Jordan Eldredge <https://jordaneldredge.com>
 */

"use strict";

const {
	isNullLiteral,
	isConstant,
	isReferenceToGlobalVariable,
	isLogicalAssignmentOperator,
	skipTSAssertions,
	ECMASCRIPT_GLOBALS,
} = require("./utils/ast-utils");

const NUMERIC_OR_STRING_BINARY_OPERATORS = new Set([
	"+",
	"-",
	"*",
	"/",
	"%",
	"|",
	"^",
	"&",
	"**",
	"<<",
	">>",
	">>>",
]);

const RELATIONAL_OPERATORS = new Set(["<", "<=", ">", ">="]);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a node is `null` or `undefined`. Similar to the one
 * found in ast-utils.js, but this one correctly handles the edge case that
 * `undefined` has been redefined.
 * @param {Scope} scope Scope in which the expression was found.
 * @param {ASTNode} node A node to check.
 * @returns {boolean} Whether or not the node is a `null` or `undefined`.
 * @public
 */
function isNullOrUndefined(scope, node) {
	const targetNode = skipTSAssertions(node);

	return (
		isNullLiteral(targetNode) ||
		(targetNode.type === "Identifier" &&
			targetNode.name === "undefined" &&
			isReferenceToGlobalVariable(scope, targetNode)) ||
		(targetNode.type === "UnaryExpression" &&
			targetNode.operator === "void")
	);
}

/**
 * Test if an AST node has a statically knowable constant nullishness. Meaning,
 * it will always resolve to a constant value of either: `null`, `undefined`
 * or not `null` _or_ `undefined`. An expression that can vary between those
 * three states at runtime would return `false`.
 * @param {Scope} scope The scope in which the node was found.
 * @param {ASTNode} node The AST node being tested.
 * @param {boolean} nonNullish if `true` then nullish values are not considered constant.
 * @returns {boolean} Does `node` have constant nullishness?
 */
function hasConstantNullishness(scope, node, nonNullish) {
	const targetNode = skipTSAssertions(node);

	if (nonNullish && isNullOrUndefined(scope, targetNode)) {
		return false;
	}

	switch (targetNode.type) {
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
			const callee = skipTSAssertions(targetNode.callee);

			if (callee.type !== "Identifier") {
				return false;
			}
			const functionName = callee.name;

			return (
				(functionName === "Boolean" ||
					functionName === "String" ||
					functionName === "Number" ||
					functionName === "Symbol" ||
					functionName === "BigInt") &&
				isReferenceToGlobalVariable(scope, callee)
			);
		}
		case "LogicalExpression": {
			return (
				targetNode.operator === "??" &&
				hasConstantNullishness(scope, targetNode.right, true)
			);
		}
		case "AssignmentExpression":
			if (targetNode.operator === "=") {
				return hasConstantNullishness(
					scope,
					targetNode.right,
					nonNullish,
				);
			}

			/*
			 * Handling short-circuiting assignment operators would require
			 * walking the scope. We won't attempt that (for now...) /
			 */
			if (isLogicalAssignmentOperator(targetNode.operator)) {
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
			const last = targetNode.expressions.at(-1);

			return hasConstantNullishness(scope, last, nonNullish);
		}
		case "Identifier":
			return (
				targetNode.name === "undefined" &&
				isReferenceToGlobalVariable(scope, targetNode)
			);
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
 * @param {Scope} scope The scope in which the node was found.
 * @param {ASTNode} node The node to test
 * @returns {boolean} Is `node` guaranteed to be a boolean?
 */
function isStaticBoolean(scope, node) {
	const targetNode = skipTSAssertions(node);

	switch (targetNode.type) {
		case "Literal":
			return typeof targetNode.value === "boolean";
		case "CallExpression": {
			const callee = skipTSAssertions(targetNode.callee);

			return (
				callee.type === "Identifier" &&
				callee.name === "Boolean" &&
				isReferenceToGlobalVariable(scope, callee) &&
				(targetNode.arguments.length === 0 ||
					isConstant(scope, targetNode.arguments[0], true))
			);
		}
		case "UnaryExpression":
			return (
				targetNode.operator === "!" &&
				isConstant(scope, targetNode.argument, true)
			);
		default:
			return false;
	}
}

/**
 * Test if an AST node will always give the same result when compared to a
 * boolean value. Note that comparison to boolean values is different than
 * truthiness.
 * https://262.ecma-international.org/5.1/#sec-11.9.3
 *
 * JavaScript `==` operator works by converting the boolean to `1` (true) or
 * `+0` (false) and then checks the values `==` equality to that number.
 * @param {Scope} scope The scope in which node was found.
 * @param {ASTNode} node The node to test.
 * @returns {boolean} Will `node` always coerce to the same boolean value?
 */
function hasConstantLooseBooleanComparison(scope, node) {
	const targetNode = skipTSAssertions(node);

	switch (targetNode.type) {
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
		case "ArrayExpression": {
			const nonSpreadElements = targetNode.elements.filter(
				e =>
					// Elements can be `null` in sparse arrays: `[,,]`;
					e !== null && e.type !== "SpreadElement",
			);

			/*
			 * Possible future direction if needed: We could check if the
			 * single value would result in variable boolean comparison.
			 * For now we will err on the side of caution since `[x]` could
			 * evaluate to `[0]` or `[1]`.
			 */
			return (
				targetNode.elements.length === 0 || nonSpreadElements.length > 1
			);
		}
		case "ArrowFunctionExpression":
		case "FunctionExpression":
			return true;
		case "UnaryExpression":
			if (
				targetNode.operator === "void" || // Always returns `undefined`
				targetNode.operator === "typeof" // All `typeof` strings, when coerced to number, are not 0 or 1.
			) {
				return true;
			}
			if (targetNode.operator === "!") {
				return isConstant(scope, targetNode.argument, true);
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
			const callee = skipTSAssertions(targetNode.callee);

			if (
				callee.type === "Identifier" &&
				callee.name === "Boolean" &&
				isReferenceToGlobalVariable(scope, callee)
			) {
				return (
					targetNode.arguments.length === 0 ||
					isConstant(scope, targetNode.arguments[0], true)
				);
			}
			return false;
		}
		case "Literal": // True or false, literals never change
			return true;
		case "Identifier":
			return (
				targetNode.name === "undefined" &&
				isReferenceToGlobalVariable(scope, targetNode)
			);
		case "TemplateLiteral":
			/*
			 * In theory we could try to check if the quasi are sufficient to
			 * prove that the expression will always be true, but it would be
			 * tricky to get right. For example: `000.${foo}000`
			 */
			return targetNode.expressions.length === 0;
		case "AssignmentExpression":
			if (targetNode.operator === "=") {
				return hasConstantLooseBooleanComparison(
					scope,
					targetNode.right,
				);
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
			const last = targetNode.expressions.at(-1);

			return hasConstantLooseBooleanComparison(scope, last);
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
 * to a boolean value. This can happen if the expression can never be boolean, or
 * if it is always the same boolean value.
 * @param {Scope} scope The scope in which the node was found.
 * @param {ASTNode} node The node to test
 * @returns {boolean} Will `node` always give the same result when compared to a
 * static boolean value?
 */
function hasConstantStrictBooleanComparison(scope, node) {
	const targetNode = skipTSAssertions(node);

	switch (targetNode.type) {
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
			return NUMERIC_OR_STRING_BINARY_OPERATORS.has(targetNode.operator);
		case "UnaryExpression": {
			if (targetNode.operator === "delete") {
				return false;
			}
			if (targetNode.operator === "!") {
				return isConstant(scope, targetNode.argument, true);
			}

			/*
			 * The remaining operators return either strings or numbers, neither
			 * of which are boolean.
			 */
			return true;
		}
		case "SequenceExpression": {
			const last = targetNode.expressions.at(-1);

			return hasConstantStrictBooleanComparison(scope, last);
		}
		case "Identifier":
			return (
				targetNode.name === "undefined" &&
				isReferenceToGlobalVariable(scope, targetNode)
			);
		case "AssignmentExpression":
			if (targetNode.operator === "=") {
				return hasConstantStrictBooleanComparison(
					scope,
					targetNode.right,
				);
			}

			/*
			 * Handling short-circuiting assignment operators would require
			 * walking the scope. We won't attempt that (for now...)
			 */
			if (isLogicalAssignmentOperator(targetNode.operator)) {
				return false;
			}

			/*
			 * The remaining assignment expressions all result in either a number
			 * or a string, neither of which can ever be boolean.
			 */
			return true;
		case "CallExpression": {
			const callee = skipTSAssertions(targetNode.callee);

			if (callee.type !== "Identifier") {
				return false;
			}
			const functionName = callee.name;

			if (
				(functionName === "String" ||
					functionName === "Number" ||
					functionName === "BigInt" ||
					functionName === "Symbol") &&
				isReferenceToGlobalVariable(scope, callee)
			) {
				return true;
			}
			if (
				functionName === "Boolean" &&
				isReferenceToGlobalVariable(scope, callee)
			) {
				return (
					targetNode.arguments.length === 0 ||
					isConstant(scope, targetNode.arguments[0], true)
				);
			}
			return false;
		}
		case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
		case "JSXFragment":
			return false;
		default:
			return false;
	}
}

/**
 * Test if an AST node will always result in a newly constructed object
 * @param {Scope} scope The scope in which the node was found.
 * @param {ASTNode} node The node to test
 * @returns {boolean} Will `node` always be new?
 */
function isAlwaysNew(scope, node) {
	const targetNode = skipTSAssertions(node);

	switch (targetNode.type) {
		case "ObjectExpression":
		case "ArrayExpression":
		case "ArrowFunctionExpression":
		case "FunctionExpression":
		case "ClassExpression":
			return true;
		case "NewExpression": {
			const callee = skipTSAssertions(targetNode.callee);

			if (callee.type !== "Identifier") {
				return false;
			}

			/*
			 * All the built-in constructors are always new, but
			 * user-defined constructors could return a sentinel
			 * object.
			 *
			 * Catching these is especially useful for primitive constructors
			 * which return boxed values, a surprising gotcha' in JavaScript.
			 */
			return (
				Object.hasOwn(ECMASCRIPT_GLOBALS, callee.name) &&
				isReferenceToGlobalVariable(scope, callee)
			);
		}
		case "Literal":
			// Regular expressions are objects, and thus always new
			return typeof targetNode.regex === "object";
		case "SequenceExpression": {
			const last = targetNode.expressions.at(-1);

			return isAlwaysNew(scope, last);
		}
		case "AssignmentExpression":
			if (targetNode.operator === "=") {
				return isAlwaysNew(scope, targetNode.right);
			}
			return false;
		case "ConditionalExpression":
			return (
				isAlwaysNew(scope, targetNode.consequent) &&
				isAlwaysNew(scope, targetNode.alternate)
			);
		case "JSXElement": // ESLint has a policy of not assuming any specific JSX behavior.
		case "JSXFragment":
			return false;
		default:
			return false;
	}
}

/**
 * Checks if one operand will cause the result to be constant.
 * @param {Scope} scope Scope in which the expression was found.
 * @param {ASTNode} a One side of the expression
 * @param {ASTNode} b The other side of the expression
 * @param {string} operator The binary expression operator
 * @returns {ASTNode | null} The node which will cause the expression to have a constant result.
 */
function findBinaryExpressionConstantOperand(scope, a, b, operator) {
	if (operator === "==" || operator === "!=") {
		if (
			(isNullOrUndefined(scope, a) &&
				hasConstantNullishness(scope, b, false)) ||
			(isStaticBoolean(scope, a) &&
				hasConstantLooseBooleanComparison(scope, b))
		) {
			return b;
		}
	} else if (operator === "===" || operator === "!==") {
		if (
			(isNullOrUndefined(scope, a) &&
				hasConstantNullishness(scope, b, false)) ||
			(isStaticBoolean(scope, a) &&
				hasConstantStrictBooleanComparison(scope, b))
		) {
			return b;
		}
	}
	return null;
}

/**
 * Checks if a node is a statically knowable literal.
 * @param {Scope} scope The scope in which the node was found.
 * @param {ASTNode} node The node to test.
 * @returns {boolean} `true` if the node is a literal.
 */
function isStaticLiteral(scope, node) {
	const targetNode = skipTSAssertions(node);

	switch (targetNode.type) {
		case "Literal":
			return true;
		case "UnaryExpression":
			return (
				["-", "+", "~"].includes(targetNode.operator) &&
				skipTSAssertions(targetNode.argument).type === "Literal"
			);
		case "Identifier":
			return (
				targetNode.name === "undefined" &&
				isReferenceToGlobalVariable(scope, targetNode)
			);
		case "TemplateLiteral":
			return targetNode.expressions.length === 0;
		default:
			return false;
	}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Disallow expressions where the operation doesn't affect the value",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-constant-binary-expression",
		},
		defaultOptions: [
			{
				checkRelationalComparisons: false,
			},
		],
		schema: [
			{
				type: "object",
				properties: {
					checkRelationalComparisons: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			constantBinaryOperand:
				"Unexpected constant binary expression. Compares constantly with the {{otherSide}}-hand side of the `{{operator}}`.",
			constantShortCircuit:
				"Unexpected constant {{property}} on the left-hand side of a `{{operator}}` expression.",
			alwaysNew:
				"Unexpected comparison to newly constructed object. These two values can never be equal.",
			bothAlwaysNew:
				"Unexpected comparison of two newly constructed objects. These two values can never be equal.",
			constantRelationalComparison:
				"Unexpected constant relational comparison. Both sides of the `{{operator}}` are literal values.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const { checkRelationalComparisons } = context.options[0];

		return {
			LogicalExpression(node) {
				const { operator, left } = node;
				const scope = sourceCode.getScope(node);

				if (
					(operator === "&&" || operator === "||") &&
					isConstant(scope, left, true)
				) {
					context.report({
						node: left,
						messageId: "constantShortCircuit",
						data: { property: "truthiness", operator },
					});
				} else if (
					operator === "??" &&
					hasConstantNullishness(scope, left, false)
				) {
					context.report({
						node: left,
						messageId: "constantShortCircuit",
						data: { property: "nullishness", operator },
					});
				}
			},
			BinaryExpression(node) {
				const scope = sourceCode.getScope(node);
				const { right, left, operator } = node;
				const rightConstantOperand =
					findBinaryExpressionConstantOperand(
						scope,
						left,
						right,
						operator,
					);
				const leftConstantOperand = findBinaryExpressionConstantOperand(
					scope,
					right,
					left,
					operator,
				);

				if (rightConstantOperand) {
					context.report({
						node: rightConstantOperand,
						messageId: "constantBinaryOperand",
						data: { operator, otherSide: "left" },
					});
				} else if (leftConstantOperand) {
					context.report({
						node: leftConstantOperand,
						messageId: "constantBinaryOperand",
						data: { operator, otherSide: "right" },
					});
				} else if (operator === "===" || operator === "!==") {
					if (isAlwaysNew(scope, left)) {
						context.report({ node: left, messageId: "alwaysNew" });
					} else if (isAlwaysNew(scope, right)) {
						context.report({ node: right, messageId: "alwaysNew" });
					}
				} else if (operator === "==" || operator === "!=") {
					/*
					 * If both sides are "new", then both sides are objects and
					 * therefore they will be compared by reference even with `==`
					 * equality.
					 */
					if (isAlwaysNew(scope, left) && isAlwaysNew(scope, right)) {
						context.report({
							node: left,
							messageId: "bothAlwaysNew",
						});
					}
				} else if (
					checkRelationalComparisons &&
					RELATIONAL_OPERATORS.has(operator)
				) {
					if (
						isStaticLiteral(scope, left) &&
						isStaticLiteral(scope, right)
					) {
						context.report({
							node,
							messageId: "constantRelationalComparison",
							data: { operator },
						});
					}
				}
			},

			/*
			 * In theory we could handle short-circuiting assignment operators,
			 * for some constant values, but that would require walking the
			 * scope to find the value of the variable being assigned. This is
			 * dependent on https://github.com/eslint/eslint/issues/13776
			 *
			 * AssignmentExpression() {},
			 */
		};
	},
};
