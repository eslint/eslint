/**
 * @fileoverview Rule to flag variables that are never assigned
 * @author Jacob Bandes-Storch <https://github.com/jtbandes>
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
			description:
				"Disallow variable declarations that use `let` or `var` but have no intitial value and are never assigned",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-unassigned-vars",
		},

		schema: [],
		messages: {
			unassigned:
				"'{{name}}' is not initialized and never assigned, so it will always be undefined.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			[`VariableDeclaration:matches([kind=let], [kind=var]):not([declare=true]) > VariableDeclarator[id.type=Identifier]:not([init])`](
				node,
			) {
				const [variable] = sourceCode.getDeclaredVariables(node);
				if (!variable) {
					return;
				}
				let hasRead = false;
				for (const reference of variable.references) {
					if (reference.isWrite()) {
						return;
					}
					if (reference.isRead()) {
						hasRead = true;
					}
				}
				if (!hasRead) {
					// Variables that are never read should be flagged by no-unused-vars instead
					return;
				}
				context.report({
					node,
					messageId: "unassigned",
					data: { name: node.id.name },
				});
			},
		};
	},
};
