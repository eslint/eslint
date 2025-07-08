/**
 * @fileoverview Rule to preserve caught errors when re-throwing exceptions
 * @author Amnish Singh Arora
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
			description:
				"Disallow losing originally caught error when re-throwing custom errors",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/preserve-caught-error", // URL to the documentation page for this rule
		},
		schema: [
			{
				type: "object",
				properties: {
					customErrorTypes: {
						type: "array",
						items: { type: "string" },
						uniqueItems: true,
						description:
							"List of custom user-defined error types that implement the `Error` interface. E.g. OpenAI's SDK provides various custom error types like `ApiError`. See https://github.com/openai/openai-node/blob/1a20cac26189a8e37abc7b94422b8f04c0020a8d/src/core/error.ts#L5",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			missingCause:
				"There is no `cause` attached to the symptom error being thrown.",
			incorrectCause:
				"The symptom error is being thrown with an incorrect `cause`.",
			includeCause:
				"Include the original caught error as the `cause` of the symptom error.",
			missingErrorParam:
				"The caught error is not accessible because the catch clause lacks the error parameter.",
		},
		hasSuggestions: true,
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const options = context.options[0] || {};
		const additionalErrorTypes = options.customErrorTypes || [];

		//----------------------------------------------------------------------
		// Helpers
		//----------------------------------------------------------------------

		/**
		 * Checks if a `ThrowStatement` is constructing and throwing a new `Error` object.
		 *
		 * Covers all the error types on `globalThis` that support `cause` property:
		 * https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts
		 * @param {ASTNode} throwStatement The `ThrowStatement` that needs to be checked.
		 * @param {string[]} customErrorTypes A list of custom error types that need to be considered as well.
		 * @returns {boolean} `true` if a new "Error" is being thrown, else `false`.
		 */
		function isThrowingNewError(throwStatement, customErrorTypes = []) {
			const builtInErrorTypes = new Set([
				"Error",
				"EvalError",
				"RangeError",
				"ReferenceError",
				"SyntaxError",
				"TypeError",
				"URIError",
				"AggregateError",
			]);

			const allErrorTypes = new Set([
				...builtInErrorTypes,
				...customErrorTypes,
			]);
			return (
				(throwStatement.argument.type === "NewExpression" ||
					throwStatement.argument.type === "CallExpression") &&
				throwStatement.argument.callee.type === "Identifier" &&
				allErrorTypes.has(throwStatement.argument.callee.name)
			);
		}

		/**
		 * Finds and returns the ASTNode that is used as the `cause` of the Error being thrown
		 * @param {ASTNode} throwStatement `ThrowStatement` to be checked.
		 * @returns {ASTNode | null} The `cause` of `Error` being thrown, `null` if not set.
		 */
		function getErrorCause(throwStatement) {
			const newExpression = throwStatement.argument;
			const errorOptions = newExpression.arguments[1];
			const causeProperty =
				errorOptions?.type === "ObjectExpression"
					? errorOptions.properties.find(
							prop =>
								prop.type === "Property" &&
								prop.key.type === "Identifier" &&
								prop.key.name === "cause",
						)
					: null;

			return causeProperty ? causeProperty.value : null;
		}

		/**
		 * Finds and returns the `CatchClause` node, that the `node` is part of.
		 * @param {ASTNode} node The AST node to be evaluated.
		 * @returns {ASTNode | null} The closest parent `CatchClause` node, `null` if the `node` is not in a catch block.
		 */
		function findParentCatch(node) {
			let currentNode = node;

			while (currentNode && currentNode.type !== "CatchClause") {
				currentNode = currentNode.parent;
			}

			return currentNode;
		}

		//----------------------------------------------------------------------
		// Public
		//----------------------------------------------------------------------
		return {
			ThrowStatement(node) {
				// Check if the throw is inside a catch block
				const parentCatch = findParentCatch(node);
				const throwStatement = node;

				if (parentCatch) {
					const caughtError =
						parentCatch.param?.type === "Identifier"
							? parentCatch.param
							: null;

					if (!caughtError) {
						// TODO: Add an option that allows disabling this behavior
						context.report({
							node: parentCatch,
							messageId: "missingErrorParam",
						});
						return;
					}

					// Check if a new error is being thrown
					if (
						isThrowingNewError(throwStatement, additionalErrorTypes)
					) {
						// Check if there is a cause attached to the new error
						const thrownErrorCause = getErrorCause(throwStatement);
						if (!thrownErrorCause) {
							context.report({
								messageId: "missingCause",
								node: throwStatement,
								suggest: [
									{
										messageId: "includeCause",
										fix(fixer) {
											// Get the original error information to forge a fixed version
											const throwExpression =
												throwStatement.argument;
											const messageArgument =
												throwExpression.arguments[0];
											const errorMessage =
												sourceCode.getText(
													messageArgument,
												);
											const errorType =
												throwExpression.callee.name;

											return fixer.replaceText(
												throwStatement,
												`throw ${throwExpression.type === "NewExpression" ? "new " : ""}${errorType}(${errorMessage}, { cause: ${caughtError.name} });`,
											);
										},
									},
								],
							});

							// We don't need to check further
							return;
						}

						// If there is an attached cause, verify that is matches the caught error
						if (
							!(
								thrownErrorCause.type === "Identifier" &&
								thrownErrorCause.name === caughtError.name
							)
						) {
							context.report({
								messageId: "incorrectCause",
								node: thrownErrorCause,
								suggest: [
									{
										messageId: "includeCause",
										fix(fixer) {
											return fixer.replaceText(
												thrownErrorCause,
												caughtError.name,
											);
										},
									},
								],
							});
						}
					}
				}
			},
		};
	},
};
