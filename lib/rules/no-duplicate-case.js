/**
 * @fileoverview Rule to disallow a duplicate case label.
 * @author Dieter Oberkofler
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow duplicate case labels",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-duplicate-case",
		},

		schema: [],

		messages: {
			unexpected: "Duplicate case label.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		/**
		 * Builds the key that two nodes share exactly when the rule considers
		 * them equal: the same node type and the same sequence of token types
		 * and values.
		 * @param {ASTNode} node The node to describe.
		 * @returns {string} A key that is equal for equal nodes only.
		 */
		function keyOf(node) {
			let key = node.type;

			for (const token of sourceCode.getTokens(node)) {
				key += `\0${token.type}\0${token.value}`;
			}

			return key;
		}
		return {
			SwitchStatement(node) {
				const previousTests = new Set();

				for (const switchCase of node.cases) {
					if (switchCase.test) {
						const key = keyOf(switchCase.test);

						if (previousTests.has(key)) {
							context.report({
								node: switchCase,
								messageId: "unexpected",
							});
						} else {
							previousTests.add(key);
						}
					}
				}
			},
		};
	},
};
