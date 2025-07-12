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
		/*
		 * TODO: We should allow passing `customErrorTypes` option once something like `typescript-eslint`'s
		 * 		`TypeOrValueSpecifier` is implemented in core Eslint.
		 *      See:
		 * 		1. https://typescript-eslint.io/packages/type-utils/type-or-value-specifier/
		 *      2. https://github.com/eslint/eslint/pull/19913#discussion_r2192608593
		 *      3. https://github.com/eslint/eslint/discussions/16540
		 */
		schema: [],
		messages: {
			missingCause:
				"There is no `cause` attached to the symptom error being thrown.",
			missingCauseInFunction:
				"The function needs to use the caught error when constructing a symptom error.",
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
		const BUILT_IN_ERROR_TYPES = Object.freeze(
			new Set([
				"Error",
				"EvalError",
				"RangeError",
				"ReferenceError",
				"SyntaxError",
				"TypeError",
				"URIError",
				"AggregateError",
			]),
		);

		//----------------------------------------------------------------------
		// Helpers
		//----------------------------------------------------------------------

		/**
		 * Checks if a `ThrowStatement` is constructing and throwing a new `Error` object.
		 *
		 * Covers all the error types on `globalThis` that support `cause` property:
		 * https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts
		 * @param {ASTNode} throwStatement The `ThrowStatement` that needs to be checked.
		 * @returns {boolean} `true` if a new "Error" is being thrown, else `false`.
		 */
		function isThrowingNewError(throwStatement) {
			return (
				(throwStatement.argument.type === "NewExpression" ||
					throwStatement.argument.type === "CallExpression") &&
				throwStatement.argument.callee.type === "Identifier" &&
				BUILT_IN_ERROR_TYPES.has(throwStatement.argument.callee.name)
			);
		}

		/**
		 * Checks if a `ThrowStatement` is throwing the return value of a function call.
		 * @param {ASTNode} throwStatement The `ThrowStatement` that needs to be checked.
		 * @returns {boolean} `true` if the throw invokes a function call, else `false`.
		 */
		function isThrowingFuncReturnVal(throwStatement) {
			return (
				throwStatement.argument.type === "CallExpression" &&
				throwStatement.argument.callee.type === "Identifier" &&
				/*
				 * If the callee name is not part of built-in Error types,
				 * consider it to be a function call.
				 */
				!BUILT_IN_ERROR_TYPES.has(throwStatement.argument.callee.name)
			);
		}

		/**
		 * Checks if a function call uses the caught error, i.e. error is passed as an argument.
		 * @param {ASTNode} functionCallExpression The function call to be checked.
		 * @param {string} caughtErrorName The name of the error that should needs to be passed to the function.
		 * @returns {boolean} `true` if the error represented by `caughtErrorName` is used by `functionCallExpression` in any way, else `false`.
		 */
		function functionUsesError(functionCallExpression, caughtErrorName) {
			return functionCallExpression.arguments.some(arg => {
				if (arg.type === "Identifier") {
					return arg.name === caughtErrorName;
				}

				if (arg.type === "ObjectExpression") {
					return arg.properties.some(prop => {
						// Covers { err } and { key: err }
						if (prop.type === "Property") {
							const val = prop.value;
							return (
								val.type === "Identifier" &&
								val.name === caughtErrorName
							);
						}
						return false;
					});
				}

				return false;
			});
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

					// Check if there are throw statements and caught error is being ignored
					if (!caughtError) {
						// TODO: Add an option that allows disabling this behavior?
						context.report({
							node: parentCatch,
							messageId: "missingErrorParam",
						});
						return;
					}

					// Check if a new error is being thrown
					if (isThrowingNewError(throwStatement)) {
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
											const errorMessage = messageArgument ?
												sourceCode.getText(
													messageArgument,
												) : '""';
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
					} else if (isThrowingFuncReturnVal(throwStatement)) {
						// Check if the caught error was passed to the function
						const functionCall = throwStatement.argument;
						if (
							!functionUsesError(functionCall, caughtError.name)
						) {
							context.report({
								node: functionCall,
								messageId: "missingCauseInFunction",
							});
						}
					}
				}
			},
		};
	},
};
