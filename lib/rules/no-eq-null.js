/**
 * @fileoverview Rule to flag comparisons to null without a type-checking
 * operator.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const STRICT_OPERATORS = {
	"==": "===",
	"!=": "!==",
};

const LOGICAL_OPERATORS = {
	"==": "||",
	"!=": "&&",
};

/*
 * Node types whose value is guaranteed to be the same when it is read twice,
 * so that the operand can be duplicated in a suggestion. Reading a call or a
 * member expression a second time could observe a different value or run side
 * effects, so those operands only get the suggestion that replaces the
 * operator.
 */
const DUPLICABLE_NODE_TYPES = new Set([
	"Identifier",
	"ThisExpression",
	"MetaProperty",
	"Literal",
]);

/**
 * Checks whether an operand can be duplicated in a suggestion.
 * An `Identifier` that refers to a global variable is excluded: globals can be
 * accessor properties, so the two reads could return different values.
 * @param {ASTNode} node The operand to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if reading the operand twice cannot change the result.
 */
function isSafeToReadTwice(node, sourceCode) {
	return (
		DUPLICABLE_NODE_TYPES.has(node.type) &&
		(node.type !== "Identifier" ||
			!astUtils.isReferenceToGlobalVariable(
				sourceCode.getScope(node),
				node,
			))
	);
}

/**
 * Checks whether `undefined` is shadowed by a binding in an enclosing scope.
 * The suggestion spells out `undefined`, so it would not compare against the
 * global value there.
 * @param {Scope} scope The scope of the comparison.
 * @returns {boolean} `true` if `undefined` is declared in a non-global scope.
 */
function isUndefinedShadowed(scope) {
	for (
		let current = scope;
		current && current.type !== "global";
		current = current.upper
	) {
		if (current.set.has("undefined")) {
			return true;
		}
	}

	return false;
}

/**
 * Checks whether the expanded comparison has to be parenthesized.
 * The replacement is a logical expression, so it binds more loosely than the
 * comparison it replaces and cannot be mixed with `??` at all.
 * @param {ASTNode} node The comparison being replaced.
 * @returns {boolean} `true` if the replacement needs parentheses.
 */
function needsParentheses(node) {
	const { parent } = node;

	// `??` cannot be mixed with `||` or `&&` without parentheses.
	if (parent.type === "LogicalExpression" && parent.operator === "??") {
		return true;
	}

	if (parent.type === "ConditionalExpression") {
		return parent.test === node;
	}

	return (
		(parent.type === "BinaryExpression" ||
			parent.type === "LogicalExpression") &&
		astUtils.getPrecedence(parent) >
			astUtils.getPrecedence({
				type: "LogicalExpression",
				operator: LOGICAL_OPERATORS[node.operator],
			})
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		hasSuggestions: true,

		docs: {
			description:
				"Disallow `null` comparisons without type-checking operators",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-eq-null",
		},

		schema: [],

		messages: {
			unexpected: "Use '===' to compare with null.",
			replaceOperator:
				"Replace '{{actualOperator}}' with '{{expectedOperator}}' (no longer matches `undefined`).",
			strictNullCheck:
				"Compare strictly with `null` and `undefined` (keeps the current result).",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			BinaryExpression(node) {
				if (node.operator !== "==" && node.operator !== "!=") {
					return;
				}

				const nullIsLeft = astUtils.isNullLiteral(node.left);
				const nullIsRight = astUtils.isNullLiteral(node.right);

				if (!nullIsLeft && !nullIsRight) {
					return;
				}

				const otherOperand = nullIsLeft ? node.right : node.left;
				const operatorToken = sourceCode.getFirstTokenBetween(
					node.left,
					node.right,
					token => token.value === node.operator,
				);
				const expectedOperator = STRICT_OPERATORS[node.operator];

				/** @type {Array<Object>} */
				const suggest = [
					{
						messageId: "replaceOperator",
						data: {
							actualOperator: node.operator,
							expectedOperator,
						},
						fix: fixer =>
							fixer.replaceText(operatorToken, expectedOperator),
					},
				];

				/*
				 * Keeping the `undefined` match requires the operand to appear
				 * twice. Only offer that suggestion when reading the operand
				 * twice cannot change the result, and only when replacing the
				 * whole expression would not discard comments.
				 */
				if (
					nullIsLeft !== nullIsRight &&
					isSafeToReadTwice(otherOperand, sourceCode) &&
					!isUndefinedShadowed(sourceCode.getScope(node)) &&
					sourceCode.getCommentsInside(node).length === 0
				) {
					const operandText = sourceCode.getText(otherOperand);
					const comparison = `${operandText} ${expectedOperator} null ${LOGICAL_OPERATORS[node.operator]} ${operandText} ${expectedOperator} undefined`;

					suggest.push({
						messageId: "strictNullCheck",
						fix: fixer =>
							fixer.replaceText(
								node,
								needsParentheses(node)
									? `(${comparison})`
									: comparison,
							),
					});
				}

				context.report({
					node,
					messageId: "unexpected",
					suggest,
				});
			},
		};
	},
};
