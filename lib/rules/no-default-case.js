/**
 * @fileoverview Rule to disallow default clauses in switch statements
 * @author Ofek Gabay <https://github.com/tupe12334>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "Disallow `default` clauses in `switch` statements",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-default-case",
		},

		schema: [
			{
				type: "object",
				properties: {
					allowEmpty: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],

		messages: {
			unexpectedDefault: "Unexpected 'default' clause.",
			unexpectedNonEmptyDefault:
				"Unexpected 'default' clause. Use 'allowEmpty' option to allow empty default cases.",
		},
	},

	create(context) {
		const [{ allowEmpty = false } = {}] = context.options;

		/**
		 * Checks if a default case is empty (contains only comments or no statements)
		 * @param {ASTNode} defaultCase The default case node
		 * @returns {boolean} Whether the default case is empty
		 */
		function isEmptyCase(defaultCase) {
			return defaultCase.consequent.length === 0;
		}

		return {
			SwitchStatement(node) {
				const defaultCase = node.cases.find(c => c.test === null);

				if (defaultCase) {
					const isEmpty = isEmptyCase(defaultCase);

					if (!allowEmpty || !isEmpty) {
						context.report({
							node: defaultCase,
							messageId:
								allowEmpty && !isEmpty
									? "unexpectedNonEmptyDefault"
									: "unexpectedDefault",
						});
					}
				}
			},
		};
	},
};
