/**
 * @fileoverview The rule should warn against code that tries to compare against -0.
 * @author Aladdin-ADD <hh_2013@foxmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		hasSuggestions: true,
		type: "problem",

		docs: {
			description: "Disallow comparing against `-0`",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-compare-neg-zero",
		},

		fixable: null,
		schema: [],

		messages: {
			unexpected:
				"Do not use the '{{operator}}' operator to compare against -0.",
			useObjectIs: "Use Object.is() to compare against -0.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		//--------------------------------------------------------------------------
		// Helpers
		//--------------------------------------------------------------------------

		/**
		 * Checks a given node is -0
		 * @param {ASTNode} node A node to check.
		 * @returns {boolean} `true` if the node is -0.
		 */
		function isNegZero(node) {
			return (
				node.type === "UnaryExpression" &&
				node.operator === "-" &&
				node.argument.type === "Literal" &&
				node.argument.value === 0
			);
		}
		const OPERATORS_TO_CHECK = new Set([
			">",
			">=",
			"<",
			"<=",
			"==",
			"===",
			"!=",
			"!==",
		]);
		const OPERATORS_TO_SUGGEST = new Set(["===", "!=="]);

		/**
		 * Gets the source text for a node when replacing its parent expression.
		 * @param {ASTNode} node A node to get text for.
		 * @returns {string} The node's source text.
		 */
		function getReplacementText(node) {
			const text = sourceCode.getText(node);

			return node.type === "SequenceExpression" ? `(${text})` : text;
		}

		/**
		 * Gets a suggestion to replace strict comparisons against -0 with Object.is().
		 * @param {ASTNode} node A BinaryExpression node.
		 * @returns {Object|null} A suggestion descriptor or null if no suggestion applies.
		 */
		function getSuggestion(node) {
			if (!OPERATORS_TO_SUGGEST.has(node.operator)) {
				return null;
			}

			const objectIsCall = `Object.is(${getReplacementText(node.left)}, ${getReplacementText(node.right)})`;
			const replacement =
				node.operator === "!==" ? `!${objectIsCall}` : objectIsCall;

			return {
				messageId: "useObjectIs",
				fix: fixer => fixer.replaceText(node, replacement),
			};
		}

		return {
			BinaryExpression(node) {
				if (OPERATORS_TO_CHECK.has(node.operator)) {
					if (isNegZero(node.left) || isNegZero(node.right)) {
						const suggestion = getSuggestion(node);

						context.report({
							node,
							messageId: "unexpected",
							data: { operator: node.operator },
							suggest: suggestion ? [suggestion] : [],
						});
					}
				}
			},
		};
	},
};
