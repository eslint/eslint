/**
 * @fileoverview Rule to preserve caught errors when re-throwing exceptions
 * @author Amnish Singh Arora
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

/** @typedef {import("estree").Node} ASTNode */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/*
 * This is an indicator of an error cause node, that is too complicated to be detected and fixed.
 * Eg, when error options is an `Identifier` or a `SpreadElement`.
 */
const UNKNOWN_CAUSE = Symbol("unknown_cause");

const BUILT_IN_ERROR_TYPES = new Set([
	"Error",
	"EvalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError",
	"AggregateError",
]);

/**
 * Finds and returns information about the `cause` property of an error being thrown.
 * @param {ASTNode} throwStatement `ThrowStatement` to be checked.
 * @param {string} errorClassName The name of the error class being thrown.
 * @returns {{ value: ASTNode; multipleDefinitions: boolean; } | UNKNOWN_CAUSE | null}
 * Information about the `cause` of the error being thrown, such as the value node and
 * whether there are multiple definitions of `cause`. `null` if there is no `cause`.
 */
function getErrorCause(throwStatement, errorClassName) {
	const throwExpression = throwStatement.argument;
	const isBuiltIn = BUILT_IN_ERROR_TYPES.has(errorClassName);

	// For built-in errors, use positional logic (we know their constructor signature)
	if (isBuiltIn) {
		/*
		 * Determine which argument index holds the options object
		 * `AggregateError` is a special case as it accepts the `options` object as third argument.
		 */
		const optionsIndex =
			throwExpression.callee.name === "AggregateError" ? 2 : 1;

		/*
		 * Make sure there is no `SpreadElement` at or before the `optionsIndex`
		 * as this messes up the effective order of arguments and makes it complicated
		 * to track where the actual error options need to be at
		 */
		const spreadExpressionIndex = throwExpression.arguments.findIndex(
			arg => arg.type === "SpreadElement",
		);
		if (
			spreadExpressionIndex >= 0 &&
			spreadExpressionIndex <= optionsIndex
		) {
			return UNKNOWN_CAUSE;
		}

		const errorOptions = throwExpression.arguments[optionsIndex];

		if (errorOptions) {
			if (errorOptions.type === "ObjectExpression") {
				if (
					errorOptions.properties.some(
						prop => prop.type === "SpreadElement",
					)
				) {
					/*
					 * If there is a spread element as part of error options, it is too complicated
					 * to verify if the cause is used properly and auto-fix.
					 */
					return UNKNOWN_CAUSE;
				}

				const causeProperties = errorOptions.properties.filter(
					prop => astUtils.getStaticPropertyName(prop) === "cause",
				);

				const causeProperty = causeProperties.at(-1);
				return causeProperty
					? {
							value: causeProperty.value,
							multipleDefinitions: causeProperties.length > 1,
						}
					: null;
			}

			// Error options exist, but too complicated to be analyzed/fixed
			return UNKNOWN_CAUSE;
		}

		return null;
	}

	/*
	 * For custom error classes, use search logic (we don't know their constructor signature).
	 * Search all arguments for an ObjectExpression with a `cause` property.
	 */
	let lastCauseInfo = null;

	for (const arg of throwExpression.arguments) {
		if (arg.type === "ObjectExpression") {
			const causeProperties = arg.properties.filter(
				prop => astUtils.getStaticPropertyName(prop) === "cause",
			);

			if (causeProperties.length > 0) {
				/*
				 * Found an object with cause(s).
				 * Check if this specific object has spread elements.
				 */
				if (
					arg.properties.some(prop => prop.type === "SpreadElement")
				) {
					// Too complex to analyze this specific object
					return UNKNOWN_CAUSE;
				}

				// Found a valid cause, update to this one (last-one-wins)
				const causeProperty = causeProperties.at(-1);
				lastCauseInfo = {
					value: causeProperty.value,
					multipleDefinitions: causeProperties.length > 1,
				};
			}
		}
	}

	return lastCauseInfo;
}

/**
 * Finds and returns the `CatchClause` node, that the `node` is part of.
 * @param {ASTNode} node The AST node to be evaluated.
 * @returns {ASTNode | null } The closest parent `CatchClause` node, `null` if the `node` is not in a catch block.
 */
function findParentCatch(node) {
	let currentNode = node;

	while (currentNode && currentNode.type !== "CatchClause") {
		if (
			[
				"FunctionDeclaration",
				"FunctionExpression",
				"ArrowFunctionExpression",
				"StaticBlock",
			].includes(currentNode.type)
		) {
			/*
			 * Make sure the ThrowStatement is not made inside a function definition or a static block inside a high level catch.
			 * In such cases, the caught error is not directly related to the Throw.
			 *
			 * For example,
			 * try {
			 * } catch (error) {
			 * 	foo = {
			 * 		bar() {
			 *	 	throw new Error();
			 * 	  }
			 * };
			 * }
			 */
			return null;
		}
		currentNode = currentNode.parent;
	}

	return currentNode;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		defaultOptions: [
			{
				requireCatchParameter: false,
			},
		],

		docs: {
			description:
				"Disallow losing originally caught error when re-throwing custom errors",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/preserve-caught-error", // URL to the documentation page for this rule
		},
		schema: [
			{
				type: "object",
				properties: {
					requireCatchParameter: {
						type: "boolean",
						description:
							"Requires the catch blocks to always have the caught error parameter so it is not discarded.",
					},
					errorClassNames: {
						type: "array",
						description:
							"Additional error class names to check for cause preservation.",
						items: {
							type: "string",
						},
						uniqueItems: true,
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
			missingCatchErrorParam:
				"The caught error is not accessible because the catch clause lacks the error parameter. Start referencing the caught error using the catch parameter.",
			partiallyLostError:
				"Re-throws cannot preserve the caught error as a part of it is being lost due to destructuring.",
			caughtErrorShadowed:
				"The caught error is being attached as `cause`, but is shadowed by a closer scoped redeclaration.",
		},
		hasSuggestions: true,
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const [
			{
				requireCatchParameter,
				errorClassNames: configuredErrorClassNames = [],
			},
		] = context.options;

		// Track error class names: built-in + configured + auto-detected (same file only)
		const errorClassNames = new Set([
			...BUILT_IN_ERROR_TYPES,
			...configuredErrorClassNames,
		]);

		//----------------------------------------------------------------------
		// Helpers
		//----------------------------------------------------------------------

		/**
		 * Checks if a `ThrowStatement` is constructing and throwing a new `Error` object.
		 *
		 * Covers all the error types on `globalThis` that support `cause` property:
		 * https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts
		 * @param {ASTNode} throwStatement The `ThrowStatement` that needs to be checked.
		 * @returns {{ isError: boolean; className: string | null }} Information about the error.
		 */
		function getErrorInfo(throwStatement) {
			if (
				!(
					throwStatement.argument.type === "NewExpression" ||
					throwStatement.argument.type === "CallExpression"
				) ||
				throwStatement.argument.callee.type !== "Identifier"
			) {
				return { isError: false, className: null };
			}

			const errorClassName = throwStatement.argument.callee.name;

			// Check if it's a built-in error type (must be global reference)
			if (BUILT_IN_ERROR_TYPES.has(errorClassName)) {
				return {
					isError: sourceCode.isGlobalReference(
						throwStatement.argument.callee,
					),
					className: errorClassName,
				};
			}

			// Check if it's a custom error class name (configured or auto-detected)
			if (errorClassNames.has(errorClassName)) {
				return { isError: true, className: errorClassName };
			}

			return { isError: false, className: null };
		}

		/**
		 * Inserts `cause: <caughtErrorName>` into an inline options object expression.
		 * @param {RuleFixer} fixer The fixer object.
		 * @param {ASTNode} optionsNode The options object node.
		 * @param {string} caughtErrorName The name of the caught error (e.g., "err").
		 * @returns {Fix} The fix object.
		 */
		function insertCauseIntoOptions(fixer, optionsNode, caughtErrorName) {
			const properties = optionsNode.properties;

			if (properties.length === 0) {
				// Insert inside empty braces: `{}` → `{ cause: err }`
				return fixer.insertTextAfter(
					sourceCode.getFirstToken(optionsNode),
					`cause: ${caughtErrorName}`,
				);
			}

			const lastProp = properties.at(-1);
			const lastToken = sourceCode.getLastToken(lastProp);

			// Check if there's a trailing comma after the last property
			const nextToken = sourceCode.getTokenAfter(lastToken);
			const hasTrailingComma =
				nextToken && astUtils.isCommaToken(nextToken);

			if (hasTrailingComma) {
				// Insert before the trailing comma: `{ a: 1, }` → `{ a: 1, cause: err, }`
				return fixer.insertTextBefore(
					nextToken,
					`, cause: ${caughtErrorName}`,
				);
			}

			// No trailing comma, insert after last property: `{ a: 1 }` → `{ a: 1, cause: err }`
			return fixer.insertTextAfter(
				lastProp,
				`, cause: ${caughtErrorName}`,
			);
		}

		//----------------------------------------------------------------------
		// Public
		//----------------------------------------------------------------------
		return {
			/*
			 * Auto-detect classes that extend Error (same file only).
			 * For cross-file imports, use errorClassNames config option.
			 */
			ClassDeclaration(node) {
				if (node.superClass?.name === "Error") {
					errorClassNames.add(node.id.name);
				}
			},

			ClassExpression(node) {
				if (node.superClass?.name === "Error" && node.id?.name) {
					errorClassNames.add(node.id.name);
				}
			},

			ThrowStatement(node) {
				// Check if the throw is inside a catch block
				const parentCatch = findParentCatch(node);
				const throwStatement = node;

				// Check if a new error is being thrown in a catch block
				if (parentCatch) {
					const errorInfo = getErrorInfo(throwStatement);

					if (!errorInfo.isError) {
						return;
					}
					if (
						parentCatch.param &&
						parentCatch.param.type !== "Identifier"
					) {
						/*
						 * When a part of the caught error is being lost at the parameter level, commonly due to destructuring.
						 * e.g. catch({ message, ...rest })
						 */
						context.report({
							messageId: "partiallyLostError",
							node: parentCatch,
						});
						return;
					}

					const caughtError =
						parentCatch.param?.type === "Identifier"
							? parentCatch.param
							: null;

					// Check if there are throw statements and caught error is being ignored
					if (!caughtError) {
						if (requireCatchParameter) {
							context.report({
								node: throwStatement,
								messageId: "missingCatchErrorParam",
							});
							return;
						}
						return;
					}

					// Check if there is a cause attached to the new error
					const errorCauseInfo = getErrorCause(
						throwStatement,
						errorInfo.className,
					);

					if (errorCauseInfo === UNKNOWN_CAUSE) {
						// Error options exist, but too complicated to be analyzed/fixed
						return;
					}

					if (errorCauseInfo === null) {
						// If there is no `cause` attached to the error being thrown.
						context.report({
							messageId: "missingCause",
							node: throwStatement,
							suggest: [
								{
									messageId: "includeCause",
									fix(fixer) {
										const throwExpression =
											throwStatement.argument;
										const args = throwExpression.arguments;
										const errorType =
											throwExpression.callee.name;
										const isBuiltIn =
											BUILT_IN_ERROR_TYPES.has(errorType);

										// AggregateError: errors, message, options (built-in only)
										if (errorType === "AggregateError") {
											const errorsArg = args[0];
											const messageArg = args[1];
											const optionsArg = args[2];

											if (!errorsArg) {
												// Case: `throw new AggregateError()` → insert all arguments
												const lastToken =
													sourceCode.getLastToken(
														throwExpression,
													);
												const lastCalleeToken =
													sourceCode.getLastToken(
														throwExpression.callee,
													);
												const parenToken =
													sourceCode.getFirstTokenBetween(
														lastCalleeToken,
														lastToken,
														astUtils.isOpeningParenToken,
													);

												if (parenToken) {
													return fixer.insertTextAfter(
														parenToken,
														`[], "", { cause: ${caughtError.name} }`,
													);
												}
												return fixer.insertTextAfter(
													throwExpression.callee,
													`([], "", { cause: ${caughtError.name} })`,
												);
											}

											if (!messageArg) {
												// Case: `throw new AggregateError([])` → insert message and options
												return fixer.insertTextAfter(
													errorsArg,
													`, "", { cause: ${caughtError.name} }`,
												);
											}

											if (!optionsArg) {
												// Case: `throw new AggregateError([], "")` → insert error options only
												return fixer.insertTextAfter(
													messageArg,
													`, { cause: ${caughtError.name} }`,
												);
											}

											if (
												optionsArg.type ===
												"ObjectExpression"
											) {
												return insertCauseIntoOptions(
													fixer,
													optionsArg,
													caughtError.name,
												);
											}

											// Complex dynamic options — skip
											return null;
										}

										// For built-in Error types (not AggregateError)
										if (isBuiltIn) {
											const messageArg = args[0];
											const optionsArg = args[1];

											if (!messageArg) {
												// Case: `throw new Error()` → insert both message and options
												const lastToken =
													sourceCode.getLastToken(
														throwExpression,
													);
												const lastCalleeToken =
													sourceCode.getLastToken(
														throwExpression.callee,
													);
												const parenToken =
													sourceCode.getFirstTokenBetween(
														lastCalleeToken,
														lastToken,
														astUtils.isOpeningParenToken,
													);

												if (parenToken) {
													return fixer.insertTextAfter(
														parenToken,
														`"", { cause: ${caughtError.name} }`,
													);
												}
												return fixer.insertTextAfter(
													throwExpression.callee,
													`("", { cause: ${caughtError.name} })`,
												);
											}
											if (!optionsArg) {
												// Case: `throw new Error("Some message")` → insert only options
												return fixer.insertTextAfter(
													messageArg,
													`, { cause: ${caughtError.name} }`,
												);
											}

											if (
												optionsArg.type ===
												"ObjectExpression"
											) {
												return insertCauseIntoOptions(
													fixer,
													optionsArg,
													caughtError.name,
												);
											}

											return null; // Identifier or spread — do not fix
										}

										/*
										 * For custom error classes - use search logic.
										 * Find the last ObjectExpression argument or add after last argument.
										 */
										const lastArg = args.at(-1);

										if (!lastArg) {
											// No arguments at all: `throw new CustomError()`
											const lastToken =
												sourceCode.getLastToken(
													throwExpression,
												);
											const lastCalleeToken =
												sourceCode.getLastToken(
													throwExpression.callee,
												);
											const parenToken =
												sourceCode.getFirstTokenBetween(
													lastCalleeToken,
													lastToken,
													astUtils.isOpeningParenToken,
												);

											if (parenToken) {
												return fixer.insertTextAfter(
													parenToken,
													`{ cause: ${caughtError.name} }`,
												);
											}
											return fixer.insertTextAfter(
												throwExpression.callee,
												`({ cause: ${caughtError.name} })`,
											);
										}

										// Find the last ObjectExpression in arguments (without spread elements)
										let lastObjectArgIndex = -1;
										for (
											let i = args.length - 1;
											i >= 0;
											i--
										) {
											if (
												args[i].type ===
													"ObjectExpression" &&
												!args[i].properties.some(
													prop =>
														prop.type ===
														"SpreadElement",
												)
											) {
												lastObjectArgIndex = i;
												break;
											}
										}

										if (lastObjectArgIndex >= 0) {
											// Add cause to the last ObjectExpression (without spread)
											return insertCauseIntoOptions(
												fixer,
												args[lastObjectArgIndex],
												caughtError.name,
											);
										}

										// No suitable ObjectExpression found, add as last argument
										return fixer.insertTextAfter(
											lastArg,
											`, { cause: ${caughtError.name} }`,
										);
									},
								},
							],
						});

						// We don't need to check further
						return;
					}

					const { value: thrownErrorCause } = errorCauseInfo;

					// If there is an attached cause, verify that it matches the caught error
					if (
						!(
							thrownErrorCause.type === "Identifier" &&
							thrownErrorCause.name === caughtError.name
						)
					) {
						const suggest = errorCauseInfo.multipleDefinitions
							? null // If there are multiple `cause` definitions, a suggestion could be confusing.
							: [
									{
										messageId: "includeCause",
										fix(fixer) {
											/*
											 * In case `cause` is attached using object property shorthand or as a method or accessor.
											 * e.g. throw Error("fail", { cause });
											 *      throw Error("fail", { cause() { doSomething(); } });
											 *      throw Error("fail", { get cause() { return error; } });
											 */
											if (
												thrownErrorCause.parent
													.method ||
												thrownErrorCause.parent
													.shorthand ||
												thrownErrorCause.parent.kind !==
													"init"
											) {
												return fixer.replaceText(
													thrownErrorCause.parent,
													`cause: ${caughtError.name}`,
												);
											}

											return fixer.replaceText(
												thrownErrorCause,
												caughtError.name,
											);
										},
									},
								];
						context.report({
							messageId: "incorrectCause",
							node: thrownErrorCause,
							suggest,
						});
						return;
					}

					/*
					 * If the attached cause matches the identifier name of the caught error,
					 * make sure it is not being shadowed by a closer scoped redeclaration.
					 *
					 * e.g. try {
					 *      doSomething();
					 * 	  } catch (error) {
					 * 	     if (whatever) {
					 * 	       const error = anotherError;
					 * 	       throw new Error("Something went wrong");
					 * 	     }
					 *   }
					 */
					let scope = sourceCode.getScope(throwStatement);
					do {
						const variable = scope.set.get(caughtError.name);
						if (variable) {
							break;
						}
						scope = scope.upper;
					} while (scope);

					if (scope?.block !== parentCatch) {
						// Caught error is being shadowed
						context.report({
							messageId: "caughtErrorShadowed",
							node: throwStatement,
						});
					}
				}
			},
		};
	},
};
