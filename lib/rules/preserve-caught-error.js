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
		schema: [], // Add a schema if the rule has options
		messages: {
			missingCause:
				"There is no `cause` attached to the symptom error being thrown.",
			incorrectCause:
				"The symptom error is being thrown with an incorrect `cause`.",
			includeCause:
				"Include the original caught error as the `cause` of the symptom error.",
		},
		hasSuggestions: true,
	},

	create(context) {
		// variables should be defined here

		//----------------------------------------------------------------------
		// Helpers
		//----------------------------------------------------------------------

		/**
		 * Finds and returns the first `ThrowStatement` node in the block, `null` if not found.
		 * @param {ASTNode} blockStatement The block statement whose body needs to be searched.
		 * @returns {ASTNode | null} The first `ThrowStatement` found in the scope of `blockStatement`.
		 */
		function findThrowStatement(blockStatement) {
			for (const node of blockStatement.body) {
				if (node.type === "ThrowStatement") {
					return node;
				}

				// Check nested blocks (e.g., if, for, while, etc.)
				if (node.type === "IfStatement") {
					if (node.consequent.type === "BlockStatement") {
						// Search the entire block of the `IfStatement`
						const throwStatement = findThrowStatement(
							node.consequent
						);
						if (throwStatement) {
							return throwStatement;
						}
					} else if (node.consequent.type === "ThrowStatement") {
						/**
						 * If something is thrown directly as a consequent of the current `IfStatement` without braces.
						 *
						 * e.g. if (condition) throw new Error("Failed", { cause: err });
						 */
						return node.consequent;
					}
				} else if (node.type === "SwitchStatement") {
					// Look through all the cases of a `SwitchStatement`
					for (const switchCase of node.cases) {
						for (const statement of switchCase.consequent) {
							if (statement.type === "ThrowStatement") {
								return statement;
							}

							if (statement.type === "BlockStatement") {
								const throwStatement =
									findThrowStatement(statement);
								if (throwStatement) {
									return throwStatement;
								}
							}
						}
					}
				} else if (
					// Other general constructs with bodies like loops, try etc.
					"body" in node &&
					node.body &&
					"type" in node.body &&
					node.body.type === "BlockStatement"
				) {
					const throwStatement = findThrowStatement(node.body);
					if (throwStatement) {
						return throwStatement;
					}
				}
			}

			return null;
		}

		/**
		 * Checks if a `ThrowStatement` is constructing and throwing a new `Error` object.
		 *
		 * Covers all the error types on `globalThis` that support `cause` property:
		 * https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts
		 * @param {ASTNode} throwStatement The `ThrowStatement` that needs to be checked.
		 * @returns {boolean} `true` if a new "Error" is being thrown, else `false`.
		 */
		function isThrowingNewError(throwStatement) {
			// TODO: I feel like we should flag this for any class name that includes "Error"
			const knownErrorTypes = new Set([
				"Error",
				"EvalError",
				"RangeError",
				"ReferenceError",
				"SyntaxError",
				"TypeError",
				"URIError",
				"AggregateError",
			]);

			return (
				throwStatement.argument.type === "NewExpression" &&
				throwStatement.argument.callee.type === "Identifier" &&
				knownErrorTypes.has(throwStatement.argument.callee.name)
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
								prop.key.name === "cause"
					  )
					: null;

			return causeProperty ? causeProperty.value : null;
		}

		//----------------------------------------------------------------------
		// Public
		//----------------------------------------------------------------------
		return {
			CatchClause(node) {
				/*
				 * Check if the catch block is looking at a `cause` error.
				 * e.g. catch(error) --> `error` was caught.
				 */
				const caughtError =
					node.param?.type === "Identifier" ? node.param : null;
				if (!caughtError) {
					// TODO: Flag a special kind of warning suggesting to read the caught error.
					return;
				}

				// Find the first Throw Statement
				const throwStatement = findThrowStatement(node.body);

				// Check if a new error is being thrown
				if (throwStatement && isThrowingNewError(throwStatement)) {
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
										const newExpression =
											throwStatement.argument;
										const messageArgument =
											newExpression.arguments[0];
										const errorMessage =
											context.sourceCode.getText(
												messageArgument
											);
										const errorType =
											newExpression.callee.name;

										return fixer.replaceText(
											throwStatement,
											`throw new ${errorType}(${errorMessage}, { cause: ${caughtError.name} });`
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
							thrownErrorCause?.type === "Identifier" &&
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
											caughtError.name
										);
									},
								},
							],
						});
					}
				}
			},
		};
	},
};
