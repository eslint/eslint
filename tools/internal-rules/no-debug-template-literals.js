/**
 * @fileoverview Internal rule to disallow template literals in `debug` calls.
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Escapes the `%` characters in a text so that it can be safely used in a format string.
 * @param {string} text The text to escape.
 * @returns {string} The escaped text.
 */
function escapeFormatString(text) {
	return text.replace(/%/gu, "%%");
}

/**
 * Determines whether a callee refers to a `debug` logger that formats its first argument.
 * `debug()` is always matched, while `debug.someMethod()` is only matched if the method
 * name is listed in the `methods` option.
 * @param {ASTNode} callee The callee of a `CallExpression` node.
 * @param {Set<string>} methods The names of the `debug` methods to check.
 * @returns {boolean} `true` if the callee is a `debug` logger.
 */
function isDebugCallee(callee, methods) {
	if (callee.type === "Identifier") {
		return callee.name === "debug";
	}

	return (
		callee.type === "MemberExpression" &&
		!callee.computed &&
		callee.object.type === "Identifier" &&
		callee.object.name === "debug" &&
		methods.has(callee.property.name)
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		defaultOptions: [{ methods: [] }],
		docs: {
			description:
				"Disallow template literals as the format argument of `debug` calls",
			recommended: false,
		},
		type: "suggestion",
		hasSuggestions: true,
		schema: [
			{
				type: "object",
				properties: {
					methods: {
						type: "array",
						items: { type: "string" },
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			unexpectedTemplateLiteral:
				"Use a format string with placeholders instead of a template literal.",
			replaceWithFormatString:
				"Replace the template literal with a format string and arguments.",
		},
	},

	create(context) {
		const { sourceCode } = context;
		const [{ methods }] = context.options;
		const methodNames = new Set(methods);

		/**
		 * Creates a fix that replaces a template literal with a format string and arguments.
		 * @param {ASTNode} templateLiteral The `TemplateLiteral` node to replace.
		 * @returns {Function} A fix function.
		 */
		function createFix(templateLiteral) {
			return fixer => {
				// Comments inside the template literal would be lost or may break the code.
				if (sourceCode.getCommentsInside(templateLiteral).length) {
					return null;
				}

				const { expressions, quasis } = templateLiteral;
				const formatString = quasis
					.map(quasi => escapeFormatString(quasi.value.cooked))
					.join("%s");
				const newArguments = [
					JSON.stringify(formatString),
					...expressions.map(expression => {
						const text = sourceCode.getText(expression);

						// A sequence expression would be split into multiple arguments.
						return expression.type === "SequenceExpression"
							? `(${text})`
							: text;
					}),
				];

				return fixer.replaceText(
					templateLiteral,
					newArguments.join(", "),
				);
			};
		}

		return {
			CallExpression(node) {
				if (!isDebugCallee(node.callee, methodNames)) {
					return;
				}

				const [formatArgument] = node.arguments;

				if (formatArgument?.type !== "TemplateLiteral") {
					return;
				}

				/*
				 * A suggestion is only offered when the template literal is the sole argument.
				 * Otherwise, `%` sequences in the template text are likely placeholders that
				 * consume the other arguments, and rewriting the call would escape those
				 * placeholders and shift the position of the arguments they consume.
				 */
				const suggest =
					node.arguments.length === 1
						? [
								{
									messageId: "replaceWithFormatString",
									fix: createFix(formatArgument),
								},
							]
						: [];

				context.report({
					node: formatArgument,
					messageId: "unexpectedTemplateLiteral",
					suggest,
				});
			},
		};
	},
};
