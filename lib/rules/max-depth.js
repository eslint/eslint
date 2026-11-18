/**
 * @fileoverview A rule to set the maximum depth block can be nested in a function.
 * @author Ian Christian Myers
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
			description: "Enforce a maximum depth that blocks can be nested",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/max-depth",
		},

		schema: [
			{
				oneOf: [
					{
						type: "integer",
						minimum: 0,
					},
					{
						type: "object",
						properties: {
							maximum: {
								type: "integer",
								minimum: 0,
							},
							max: {
								type: "integer",
								minimum: 0,
							},
						},
						additionalProperties: false,
					},
				],
			},
		],

		defaultOptions: [4],

		messages: {
			tooDeeply:
				"Blocks are nested too deeply ({{depth}}). Maximum allowed is {{maxDepth}}.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		//--------------------------------------------------------------------------
		// Helpers
		//--------------------------------------------------------------------------

		const functionStack = [],
			option = context.options[0];
		let maxDepth = 4;

		if (
			typeof option === "object" &&
			(Object.hasOwn(option, "maximum") || Object.hasOwn(option, "max"))
		) {
			maxDepth = option.maximum || option.max;
		}
		if (typeof option === "number") {
			maxDepth = option;
		}

		/**
		 * When parsing a new function, store it in our function stack
		 * @returns {void}
		 * @private
		 */
		function startFunction() {
			functionStack.push(0);
		}

		/**
		 * When parsing is done then pop out the reference
		 * @returns {void}
		 * @private
		 */
		function endFunction() {
			functionStack.pop();
		}

		/**
		 * Save the block and Evaluate the node
		 * @param {ASTNode} node node to evaluate
		 * @returns {void}
		 * @private
		 */
		function pushBlock(node) {
			const len = ++functionStack[functionStack.length - 1];

			if (len > maxDepth) {
				context.report({
					node,
					loc: sourceCode.getFirstToken(node).loc,
					messageId: "tooDeeply",
					data: { depth: len, maxDepth },
				});
			}
		}

		/**
		 * Pop the saved block
		 * @returns {void}
		 * @private
		 */
		function popBlock() {
			functionStack[functionStack.length - 1]--;
		}

		/**
		 * Checks whether a node is an else-if statement.
		 * @param {ASTNode} node node to evaluate
		 * @returns {boolean} Whether the node is an else-if statement
		 */
		function isElseIf(node) {
			return (
				node.parent.type === "IfStatement" &&
				node.parent.alternate === node
			);
		}

		//--------------------------------------------------------------------------
		// Public API
		//--------------------------------------------------------------------------

		return {
			Program: startFunction,
			FunctionDeclaration: startFunction,
			FunctionExpression: startFunction,
			ArrowFunctionExpression: startFunction,
			StaticBlock: startFunction,

			IfStatement(node) {
				if (!isElseIf(node)) {
					pushBlock(node);
				}
			},
			SwitchStatement: pushBlock,
			TryStatement: pushBlock,
			DoWhileStatement: pushBlock,
			WhileStatement: pushBlock,
			WithStatement: pushBlock,
			ForStatement: pushBlock,
			ForInStatement: pushBlock,
			ForOfStatement: pushBlock,

			"IfStatement:exit"(node) {
				if (!isElseIf(node)) {
					popBlock();
				}
			},
			"SwitchStatement:exit": popBlock,
			"TryStatement:exit": popBlock,
			"DoWhileStatement:exit": popBlock,
			"WhileStatement:exit": popBlock,
			"WithStatement:exit": popBlock,
			"ForStatement:exit": popBlock,
			"ForInStatement:exit": popBlock,
			"ForOfStatement:exit": popBlock,

			"FunctionDeclaration:exit": endFunction,
			"FunctionExpression:exit": endFunction,
			"ArrowFunctionExpression:exit": endFunction,
			"StaticBlock:exit": endFunction,
			"Program:exit": endFunction,
		};
	},
};
