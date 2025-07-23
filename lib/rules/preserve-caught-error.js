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
		/*
		 * This is an indicator of an error cause node, that is too complicated to be detected and fixed.
		 * Eg, when error options is an `Identifier` or a `SpreadElement`.
		 */
		const UNKNOWN_CAUSE = Symbol("unknown_cause");

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

			return (
				(throwStatement.argument.type === "NewExpression" ||
					throwStatement.argument.type === "CallExpression") &&
				throwStatement.argument.callee.type === "Identifier" &&
				builtInErrorTypes.has(throwStatement.argument.callee.name)
			);
		}

		/**
		 * Finds and returns the ASTNode that is used as the `cause` of the Error being thrown
		 * @param {ASTNode} throwStatement `ThrowStatement` to be checked.
		 * @returns {ASTNode | UNKNOWN_CAUSE | null} The `cause` of `Error` being thrown, `null` if not set.
		 */
		function getErrorCause(throwStatement) {
			const throwExpression = throwStatement.argument;
			/*
			 * Determine which argument index holds the options object
			 * `AggregateError` is a special case as it accepts the `options` object as third argument.
			 */
			const optionsIndex =
				throwExpression.callee.name === "AggregateError" ? 2 : 1;
			const errorOptions = throwExpression.arguments[optionsIndex];

			if (errorOptions) {
				if (errorOptions.type === "ObjectExpression") {
					if (
						errorOptions.properties.some(
							prop => prop.type === "SpreadElement",
						)
					) {
						/*
						 * If there is a spread element is part of error options, it is too complicated
						 * to verify if the cause is used properly and auto-fix.
						 */
						return UNKNOWN_CAUSE;
					}

					const causeProperty = errorOptions.properties.find(
						prop =>
							prop.type === "Property" &&
							prop.key.type === "Identifier" &&
							prop.key.name === "cause",
					);

					return causeProperty ? causeProperty.value : null;
				}

				// Error options exist, but too complicated to be analyzed/fixed
				return UNKNOWN_CAUSE;
			}

			return null;
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
				return fixer.insertTextAfterRange(
					[optionsNode.range[0], optionsNode.range[0] + 1],
					`cause: ${caughtErrorName}`,
				);
			}

			const lastProp = properties.at(-1);
			const lastPropText = sourceCode.getText(lastProp).trim();
			const needsComma = !lastPropText.endsWith(",");
			const insertion = `${
				needsComma ? "," : ""
			} cause: ${caughtErrorName}`;

			return fixer.insertTextAfter(lastProp, insertion);
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

		//----------------------------------------------------------------------
		// Public
		//----------------------------------------------------------------------
		return {
			ThrowStatement(node) {
				// Check if the throw is inside a catch block
				const parentCatch = findParentCatch(node);
				const throwStatement = node;

				// Check if a new error is being thrown in a catch block
				if (parentCatch && isThrowingNewError(throwStatement)) {
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

					// Check if there is a cause attached to the new error
					const thrownErrorCause = getErrorCause(throwStatement);

					if (thrownErrorCause === UNKNOWN_CAUSE) {
						// Error options exist, but too complicated to be analyzed/fixed
						return;
					}

					if (thrownErrorCause === null) {
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
										const isNew =
											throwExpression.type ===
											"NewExpression";

										const errorPrefix = `${
											isNew ? "new " : ""
										}${errorType}`;

										// AggregateError: errors, message, options
										if (errorType === "AggregateError") {
											const errorsArg = args[0]
												? sourceCode.getText(args[0])
												: "[]";
											const messageArg = args[1]
												? sourceCode.getText(args[1])
												: '""';
											const optionsArg = args[2];

											if (!optionsArg) {
												// No 3rd arg → insert full throw expression
												return fixer.replaceText(
													throwExpression,
													`${errorPrefix}(${errorsArg}, ${messageArg}, { cause: ${caughtError.name} })`,
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

										// Normal Error types
										const optionsArg = args[1];

										if (!optionsArg) {
											// Case: `throw new Error()` → insert both message and options
											if (args.length === 0) {
												return fixer.replaceText(
													throwExpression,
													`${errorPrefix}("", { cause: ${caughtError.name} })`,
												);
											}

											// Case: message exists, add options
											return fixer.insertTextAfter(
												args[0],
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
			},
		};
	},
};
