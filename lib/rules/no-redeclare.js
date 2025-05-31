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
		 * Get comment declarations for a variable
		 * @param {escope.variable} variable The variable object
		 * @returns {Generator} Generator of comment declarations
		 */
		function* getCommentDeclarations(variable) {
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
		 * Get duplicate declarations of the same primary type
		 * @param {Array} syntaxIdentifiers Array of syntax identifiers
		 * @param {string} primaryType The primary type for the merge
		 * @returns {Generator} Generator of duplicate declarations
		 */
		function* getDuplicateDeclarations(syntaxIdentifiers, primaryType) {
			if (!primaryType) {
				return;
			}

			// For interface and module declarations, no duplicates should be reported (they can merge)
			if (
				primaryType === "TSInterfaceDeclaration" ||
				primaryType === "TSModuleDeclaration"
			) {
				return;
			}

			// For other types, report duplicates of the same type
			const duplicates = syntaxIdentifiers
				.filter(({ parent }) => parent.type === primaryType)
				.slice(1); // Skip the first (representative) declaration

			for (const { identifier } of duplicates) {
				yield { type: "syntax", node: identifier, loc: identifier.loc };
			}
		}

		/**
		 * Check for valid mixed-type merges (class+interface, function+module, etc.)
		 * @param {Array} syntaxIdentifiers Array of syntax identifiers
		 * @returns {Object} Merge information
		 */
		function checkMixedTypeMerge(syntaxIdentifiers) {
			// Class + Interface/Module merge
			if (
				syntaxIdentifiers.every(({ parent }) =>
					CLASS_DECLARATION_MERGE_NODES.has(parent.type),
				)
			) {
				const classDecls = syntaxIdentifiers.filter(
					({ parent }) => parent.type === "ClassDeclaration",
				);
				return {
					canMerge: true,
					representativeNode:
						classDecls.length > 0
							? classDecls[0].identifier
							: syntaxIdentifiers[0].identifier,
					primaryType: "ClassDeclaration",
				};
			}

			// Function + Module merge
			if (
				syntaxIdentifiers.every(({ parent }) =>
					FUNCTION_DECLARATION_MERGE_NODES.has(parent.type),
				)
			) {
				const funcDecls = syntaxIdentifiers.filter(
					({ parent }) => parent.type === "FunctionDeclaration",
				);
				return {
					canMerge: true,
					representativeNode:
						funcDecls.length > 0
							? funcDecls[0].identifier
							: syntaxIdentifiers[0].identifier,
					primaryType: "FunctionDeclaration",
				};
			}

			// Enum + Module merge
			if (
				syntaxIdentifiers.every(({ parent }) =>
					ENUM_DECLARATION_MERGE_NODES.has(parent.type),
				)
			) {
				const enumDecls = syntaxIdentifiers.filter(
					({ parent }) => parent.type === "TSEnumDeclaration",
				);
				return {
					canMerge: true,
					representativeNode:
						enumDecls.length > 0
							? enumDecls[0].identifier
							: syntaxIdentifiers[0].identifier,
					primaryType: "TSEnumDeclaration",
				};
			}

			return { canMerge: false };
		}

		/**
		 * Determine if declarations can merge and get representative node
		 * @param {Array} syntaxIdentifiers Array of syntax identifiers
		 * @param {Set} parentTypes Set of parent types
		 * @returns {Object} Merge information
		 */
		function getMergeInfo(syntaxIdentifiers, parentTypes) {
			// Single type merges (interfaces, modules)
			if (parentTypes.size === 1) {
				const type = Array.from(parentTypes)[0];
				if (
					type === "TSModuleDeclaration" ||
					type === "TSInterfaceDeclaration"
				) {
					return {
						canMerge: true,
						representativeNode: syntaxIdentifiers[0].identifier,
						primaryType: type,
					};
				}
			}

			// Mixed type merges
			return checkMixedTypeMerge(syntaxIdentifiers);
		}

		/**
		 * Iterate declarations of a given variable.
		 * @param {escope.variable} variable The variable object to iterate declarations.
		 * @returns {IterableIterator<{type:string,node:ASTNode,loc:SourceLocation}>} The declarations.
		 */
		function* iterateDeclarations(variable) {
			const hasBuiltinGlobal =
				builtinGlobals &&
				(variable.eslintImplicitGlobalSetting === "readonly" ||
					variable.eslintImplicitGlobalSetting === "writable");

			const hasCommentDeclarations =
				variable.eslintExplicitGlobalComments &&
				variable.eslintExplicitGlobalComments.length > 0;

			if (hasBuiltinGlobal) {
				yield { type: "builtin" };
			}

			const syntaxIdentifiers = variable.identifiers
				.filter(id => id.parent.type !== "TSDeclareFunction")
				.map(id => ({
					identifier: id,
					parent: id.parent,
				}));

			/*
			 * Handle TypeScript declaration merging if enabled
			 * For namespace merging with comments: only report the comment conflict
			 * For namespace merging with builtins: report each namespace as conflicting with builtin
			 * For pure namespace merging: allow merging
			 */
			if (ignoreDeclarationMerge && syntaxIdentifiers.length > 1) {
				const parentTypes = new Set(
					syntaxIdentifiers.map(({ parent }) => parent.type),
				);

				// Special case: pure namespace merging with comments should only report comment conflict
				if (
					parentTypes.size === 1 &&
					parentTypes.has("TSModuleDeclaration") &&
					hasCommentDeclarations
				) {
					yield {
						type: "syntax",
						node: syntaxIdentifiers[0].identifier,
						loc: syntaxIdentifiers[0].identifier.loc,
					};
					yield* getCommentDeclarations(variable);
					return;
				}

				// Handle other merge scenarios only if no conflicts with builtins or comments
				if (!hasBuiltinGlobal && !hasCommentDeclarations) {
					const mergeInfo = getMergeInfo(
						syntaxIdentifiers,
						parentTypes,
					);

					if (mergeInfo.canMerge) {
						yield {
							type: "syntax",
							node: mergeInfo.representativeNode,
							loc: mergeInfo.representativeNode.loc,
						};

						// Yield any duplicate declarations of the same type
						yield* getDuplicateDeclarations(
							syntaxIdentifiers,
							mergeInfo.primaryType,
						);

						// Yield comment declarations
						yield* getCommentDeclarations(variable);
						return;
					}
				}
			}

			// Fallback: yield all syntax identifiers (no merging)
			for (const { identifier } of syntaxIdentifiers) {
				yield { type: "syntax", node: identifier, loc: identifier.loc };
			}

			// Yield comment declarations
			yield* getCommentDeclarations(variable);
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
