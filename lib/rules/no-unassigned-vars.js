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
		dialects: ["typescript", "javascript"],
		language: "javascript",

		docs: {
			description:
				"Disallow variable declarations that use `let` or `var` but have no initial value and are never assigned",
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
			VariableDeclarator(node) {
				/** @type {import('estree').VariableDeclaration} */
				const declaration = node.parent;
				const shouldCheck =
					!node.init &&
					node.id.type === "Identifier" &&
					declaration.kind !== "const" &&
					!declaration.declare;
				if (!shouldCheck) {
					return;
				}
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
