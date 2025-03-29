/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 */
"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Returns `true`.
 * @returns {boolean} `true`.
 */
function alwaysTrue() {
	return true;
}

/**
 * Returns `false`.
 * @returns {boolean} `false`.
 */
function alwaysFalse() {
	return false;
}

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "Disallow unused expressions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-unused-expressions",
		},

		schema: [
			{
				type: "object",
				properties: {
					allowShortCircuit: {
						type: "boolean",
					},
					allowTernary: {
						type: "boolean",
					},
					allowTaggedTemplates: {
						type: "boolean",
					},
					enforceForJSX: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],

		defaultOptions: [
			{
				allowShortCircuit: false,
				allowTernary: false,
				allowTaggedTemplates: false,
				enforceForJSX: false,
			},
		],

		messages: {
			unusedExpression:
				"Expected an assignment or function call and instead saw an expression.",
		},
	},

	create(context) {
		const [
			{
				allowShortCircuit,
				allowTernary,
				allowTaggedTemplates,
				enforceForJSX,
			},
		] = context.options;

		/**
		 * The member functions return `true` if the type has no side-effects.
		 * Unknown nodes are handled as `false`, then this rule ignores those.
		 */
		const Checker = Object.assign(Object.create(null), {
			isDisallowed(node) {
				return (Checker[node.type] || alwaysFalse)(node);
			},

			ArrayExpression: alwaysTrue,
			ArrowFunctionExpression: alwaysTrue,
			BinaryExpression: alwaysTrue,
			ChainExpression(node) {
				return Checker.isDisallowed(node.expression);
			},
			ClassExpression: alwaysTrue,
			ConditionalExpression(node) {
				if (allowTernary) {
					return (
						Checker.isDisallowed(node.consequent) ||
						Checker.isDisallowed(node.alternate)
					);
				}
				return true;
			},
			FunctionExpression: alwaysTrue,
			Identifier: alwaysTrue,
			JSXElement() {
				return enforceForJSX;
			},
			JSXFragment() {
				return enforceForJSX;
			},
			Literal: alwaysTrue,
			LogicalExpression(node) {
				if (allowShortCircuit) {
					return Checker.isDisallowed(node.right);
				}
				return true;
			},
			MemberExpression: alwaysTrue,
			MetaProperty: alwaysTrue,
			ObjectExpression: alwaysTrue,
			SequenceExpression: alwaysTrue,
			TaggedTemplateExpression() {
				return !allowTaggedTemplates;
			},
			TemplateLiteral: alwaysTrue,
			ThisExpression: alwaysTrue,
			UnaryExpression(node) {
				return node.operator !== "void" && node.operator !== "delete";
			},
			// TypeScript-specific node types
			TSAsExpression(node) {
				return Checker.isDisallowed(node.expression);
			},
			TSTypeAssertion(node) {
				return Checker.isDisallowed(node.expression);
			},
			TSNonNullExpression(node) {
				return Checker.isDisallowed(node.expression);
			},
			TSInstantiationExpression(node) {
				return Checker.isDisallowed(node.expression);
			},
		});

		return {
			ExpressionStatement(node) {
				if (
					Checker.isDisallowed(node.expression) &&
					!astUtils.isDirective(node)
				) {
					context.report({ node, messageId: "unusedExpression" });
				}
			},
		};
	},
};
