/**
 * @fileoverview Rule to flag when the same variable is declared more then once.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
	meta: {
		type: "suggestion",
		dialects: ["typescript", "javascript"],
		language: "javascript",

		defaultOptions: [
			{ builtinGlobals: true, ignoreDeclarationMerge: true },
		],

		docs: {
			description: "Disallow variable redeclaration",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-redeclare",
		},

		messages: {
			redeclared: "'{{id}}' is already defined.",
			redeclaredAsBuiltin:
				"'{{id}}' is already defined as a built-in global variable.",
			redeclaredBySyntax:
				"'{{id}}' is already defined by a variable declaration.",
		},

		schema: [
			{
				type: "object",
				properties: {
					builtinGlobals: { type: "boolean" },
					ignoreDeclarationMerge: {
						type: "boolean",
						description:
							"Whether to ignore declaration merges between certain TypeScript declaration types.",
					},
				},
				additionalProperties: false,
			},
		],
	},

	create(context) {
		const [{ builtinGlobals, ignoreDeclarationMerge }] = context.options;
		const sourceCode = context.sourceCode;

		// TypeScript-specific node types for declaration merging
		const CLASS_DECLARATION_MERGE_NODES = new Set([
			"ClassDeclaration",
			"TSInterfaceDeclaration",
			"TSModuleDeclaration",
		]);

		const FUNCTION_DECLARATION_MERGE_NODES = new Set([
			"FunctionDeclaration",
			"TSModuleDeclaration",
		]);

		const ENUM_DECLARATION_MERGE_NODES = new Set([
			"TSEnumDeclaration",
			"TSModuleDeclaration",
		]);

		/**
		 * Iterate declarations of a given variable.
		 * @param {escope.variable} variable The variable object to iterate declarations.
		 * @returns {IterableIterator<{type:string,node:ASTNode,loc:SourceLocation}>} The declarations.
		 */
		function* iterateDeclarations(variable) {
			if (
				builtinGlobals &&
				(variable.eslintImplicitGlobalSetting === "readonly" ||
					variable.eslintImplicitGlobalSetting === "writable")
			) {
				yield { type: "builtin" };
			}

			const identifiers = variable.identifiers
				.map(id => ({
					identifier: id,
					parent: id.parent,
				}))
				// ignore function declarations because TS will treat them as an overload
				.filter(({ parent }) => parent.type !== "TSDeclareFunction");

			// Handle TypeScript declaration merging if enabled
			if (ignoreDeclarationMerge && identifiers.length > 1) {

				// class + interface/namespace merging
				if (
					identifiers.every(({ parent }) =>
						CLASS_DECLARATION_MERGE_NODES.has(parent.type),
					)
				) {
					const classDecls = identifiers.filter(
						({ parent }) => parent.type === "ClassDeclaration",
					);

					// there's more than one class declaration, which needs to be reported
					for (const { identifier } of classDecls) {
						yield {
							loc: identifier.loc,
							node: identifier,
							type: "syntax",
						};
					}
					return;
				}

				// function + namespace merging
				if (
					identifiers.every(({ parent }) =>
						FUNCTION_DECLARATION_MERGE_NODES.has(parent.type),
					)
				) {
					const functionDecls = identifiers.filter(
						({ parent }) => parent.type === "FunctionDeclaration",
					);

					// there's more than one function declaration, which needs to be reported
					for (const { identifier } of functionDecls) {
						yield {
							loc: identifier.loc,
							node: identifier,
							type: "syntax",
						};
					}
					return;
				}

				// enum + namespace merging
				if (
					identifiers.some(({ parent }) =>
						ENUM_DECLARATION_MERGE_NODES.has(parent.type),
					)
				) {
					const enumDecls = identifiers.filter(
						({ parent }) => parent.type === "TSEnumDeclaration",
					);

					// there's more than one enum declaration, which needs to be reported
					for (const { identifier } of enumDecls) {
						yield {
							loc: identifier.loc,
							node: identifier,
							type: "syntax",
						};
					}
					return;
				}
			}

			for (const { identifier } of identifiers) {
				yield { type: "syntax", node: identifier, loc: identifier.loc };
			}

			if (variable.eslintExplicitGlobalComments) {
				for (const comment of variable.eslintExplicitGlobalComments) {
					yield {
						type: "comment",
						node: comment,
						loc: astUtils.getNameLocationInGlobalDirectiveComment(
							sourceCode,
							comment,
							variable.name,
						),
					};
				}
			}
		}

		/**
		 * Find variables in a given scope and flag redeclared ones.
		 * @param {Scope} scope An eslint-scope scope object.
		 * @returns {void}
		 * @private
		 */
		function findVariablesInScope(scope) {
			for (const variable of scope.variables) {
				const [declaration, ...extraDeclarations] =
					iterateDeclarations(variable);

				if (extraDeclarations.length === 0) {
					continue;
				}

				/*
				 * If the type of a declaration is different from the type of
				 * the first declaration, it shows the location of the first
				 * declaration.
				 */
				const detailMessageId =
					declaration.type === "builtin"
						? "redeclaredAsBuiltin"
						: "redeclaredBySyntax";
				const data = { id: variable.name };

				// Report extra declarations.
				for (const { type, node, loc } of extraDeclarations) {
					const messageId =
						type === declaration.type
							? "redeclared"
							: detailMessageId;

					context.report({ node, loc, messageId, data });
				}
			}
		}

		/**
		 * Find variables in the current scope.
		 * @param {ASTNode} node The node of the current scope.
		 * @returns {void}
		 * @private
		 */
		function checkForBlock(node) {
			const scope = sourceCode.getScope(node);

			/*
			 * In ES5, some node type such as `BlockStatement` doesn't have that scope.
			 * `scope.block` is a different node in such a case.
			 */
			if (scope.block === node) {
				findVariablesInScope(scope);
			}
		}

		return {
			Program(node) {
				const scope = sourceCode.getScope(node);

				findVariablesInScope(scope);

				// Node.js or ES modules has a special scope.
				if (
					scope.type === "global" &&
					scope.childScopes[0] &&
					// The special scope's block is the Program node.
					scope.block === scope.childScopes[0].block
				) {
					findVariablesInScope(scope.childScopes[0]);
				}
			},

			FunctionDeclaration: checkForBlock,
			FunctionExpression: checkForBlock,
			ArrowFunctionExpression: checkForBlock,

			StaticBlock: checkForBlock,

			BlockStatement: checkForBlock,
			ForStatement: checkForBlock,
			ForInStatement: checkForBlock,
			ForOfStatement: checkForBlock,
			SwitchStatement: checkForBlock,
		};
	},
};
