/**
 * @fileoverview Enforce a maximum number of classes per file
 * @author James Garbutt <https://github.com/43081j>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "Enforce a maximum number of classes per file",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/max-classes-per-file",
		},

		schema: [
			{
				oneOf: [
					{
						type: "integer",
						minimum: 1,
					},
					{
						type: "object",
						properties: {
							ignoreExpressions: {
								type: "boolean",
							},
							max: {
								type: "integer",
								minimum: 1,
							},
						},
						additionalProperties: false,
					},
				],
			},
		],

		defaultOptions: [1],

		messages: {
			maximumExceeded:
				"File has too many classes ({{ classCount }}). Maximum allowed is {{ max }}.",
		},
	},
	create(context) {
		const sourceCode = context.sourceCode;
		const option = context.options[0];
		const [ignoreExpressions, max] =
			typeof option === "number"
				? [false, option]
				: [option.ignoreExpressions, option.max || 1];

		let classCount = 0;
		let classNodeToReport = null;

		/**
		 * Gets the location of the class head, excluding its body.
		 * @param {ASTNode} node The class node.
		 * @returns {SourceLocation} The class head location.
		 */
		function getClassHeadLoc(node) {
			const tokenBeforeBody = sourceCode.getTokenBefore(node.body);

			return {
				start: node.loc.start,
				end: tokenBeforeBody.loc.end,
			};
		}

		/**
		 * Counts a class node and remembers the first one over the maximum.
		 * @param {ASTNode} node The class node.
		 * @returns {void}
		 */
		function countClass(node) {
			classCount++;

			if (classCount === max + 1) {
				classNodeToReport = node;
			}
		}

		return {
			Program() {
				classCount = 0;
				classNodeToReport = null;
			},
			"Program:exit"() {
				if (classCount > max) {
					context.report({
						node: classNodeToReport,
						loc: getClassHeadLoc(classNodeToReport),
						messageId: "maximumExceeded",
						data: {
							classCount,
							max,
						},
					});
				}
			},
			ClassDeclaration: countClass,
			ClassExpression(node) {
				if (!ignoreExpressions) {
					countClass(node);
				}
			},
		};
	},
};
