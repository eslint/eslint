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

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",
		dialects: ["typescript", "javascript"],
		language: "javascript",

		defaultOptions: [{ builtinGlobals: true }],

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
				},
				additionalProperties: false,
			},
		],
	},

	create(context) {
		const [{ builtinGlobals }] = context.options;
		const sourceCode = context.sourceCode;

		/**
		 * Checks whether a declaration uses the `declare` keyword. Ambient
		 * declarations don't emit anything, so they can't be redeclarations.
		 * @param {ASTNode} node The declaration node that owns the identifier.
		 * @returns {boolean} `true` if the declaration is ambient.
		 */
		function isAmbientDeclaration(node) {
			/*
			 * For variables the keyword is on the `VariableDeclaration`, not on
			 * the `VariableDeclarator` that owns the identifier.
			 */
			if (node.type === "VariableDeclarator") {
				return Boolean(node.parent.declare);
			}

			return Boolean(node.declare);
		}

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

			for (const id of variable.identifiers) {
				/*
				 * Intentionally omit class declarations and import declarations because they can't
				 * be redeclared in JavaScript, and they are handled by the compiler in TypeScript.
				 */
				if (
					[
						"ArrayPattern",
						"ArrowFunctionExpression",
						"AssignmentPattern",
						"FunctionDeclaration",
						"FunctionExpression",
						"Property",
						"RestElement",
						"TSEnumDeclaration",
						"TSModuleDeclaration",
						"VariableDeclarator",
					].includes(id.parent.type) &&
					!isAmbientDeclaration(id.parent)
				) {
					yield { type: "syntax", node: id, loc: id.loc };
				}
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
		 * Checks if a TSModuleDeclaration (namespace) is instantiated,
		 * meaning it contains value declarations (variables, functions,
		 * classes, enums) either directly or in nested namespaces.
		 * A non-instantiated namespace only contributes to the type namespace.
		 * @param {ASTNode} node The TSModuleDeclaration node to check.
		 * @returns {boolean} True if the namespace is instantiated.
		 */
		function isNamespaceInstantiated(node) {
			const { body } = node;

			if (!body) {
				return false;
			}

			// For dotted names (namespace A.B { }), the body is another TSModuleDeclaration
			if (body.type === "TSModuleDeclaration") {
				return isNamespaceInstantiated(body);
			}

			// TSModuleBlock
			if (!body.body) {
				return false;
			}

			for (const statement of body.body) {
				let decl = statement;

				// Non-exported import aliases are non-instantiating
				if (decl.type === "TSImportEqualsDeclaration") {
					continue;
				}

				// Unwrap ExportNamedDeclaration
				if (
					decl.type === "ExportNamedDeclaration" &&
					decl.declaration
				) {
					decl = decl.declaration;
				}

				// Nested namespaces are instantiating only when they emit values
				if (decl.type === "TSModuleDeclaration") {
					if (isNamespaceInstantiated(decl)) {
						return true;
					}
					continue;
				}
				// Type-only declarations never make the namespace instantiated
				if (
					decl.type === "TSInterfaceDeclaration" ||
					decl.type === "TSTypeAliasDeclaration" ||
					decl.declare
				) {
					continue;
				}

				return true;
			}

			return false;
		}

		/**
		 * Checks whether a set of declarations is a valid TypeScript merge.
		 * Classes/interfaces/imports are omitted upstream, so this only needs
		 * to handle functions, variables, enums, and namespaces.
		 * @param {Array<ASTNode|null>} nodes Declaration nodes; `null` marks
		 * builtins or global directive comments.
		 * @returns {boolean} `true` if the combination should not be reported.
		 */
		function isValidTSDeclarationCombination(nodes) {
			if (nodes.length < 2) {
				return false;
			}

			const syntaxNodes = nodes.filter(node => node !== null);

			/*
			 * Builtins / global comments only coexist with type-only
			 * (non-instantiated) namespaces, which don't emit values.
			 */
			if (syntaxNodes.length !== nodes.length) {
				return (
					syntaxNodes.length > 0 &&
					syntaxNodes.every(
						node =>
							node.type === "TSModuleDeclaration" &&
							!isNamespaceInstantiated(node),
					)
				);
			}

			let functionCount = 0;
			let variableCount = 0;
			let enumCount = 0;
			let instantiatedNamespaceCount = 0;

			for (const node of syntaxNodes) {
				switch (node.type) {
					case "FunctionDeclaration":
						functionCount++;
						break;
					case "VariableDeclarator":
						variableCount++;
						break;
					case "TSEnumDeclaration":
						enumCount++;
						break;
					case "TSModuleDeclaration":
						if (isNamespaceInstantiated(node)) {
							instantiatedNamespaceCount++;
						}
						break;
					default:
						// Destructured bindings and other non-mergeable parents
						return false;
				}
			}

			/*
			 * Duplicates of the same kind are always reported. Enums do merge
			 * in TypeScript, but we still report them to match typescript-eslint.
			 */
			if (functionCount > 1 || variableCount > 1 || enumCount > 1) {
				return false;
			}

			/*
			 * Variables collide with instantiated namespaces. Functions and
			 * enums may merge with namespaces.
			 */
			if (variableCount > 0 && instantiatedNamespaceCount > 0) {
				return false;
			}

			// Enums merge only with namespaces (and other enums, handled above).
			if (enumCount > 0 && functionCount + variableCount > 0) {
				return false;
			}

			/*
			 * Without an instantiated namespace there is nothing to merge into,
			 * so at most one value declaration (function, variable, or enum) is
			 * allowed.
			 */
			if (instantiatedNamespaceCount === 0) {
				return functionCount + variableCount + enumCount <= 1;
			}

			return true;
		}

		/**
		 * Gets the declaration node from a variable definition.
		 * @param {any} def The variable definition.
		 * @returns {ASTNode|null} The declaration node.
		 */
		function getDeclarationNode(def) {
			if (def.type !== "syntax" || !def.node) {
				return null;
			}

			// For identifiers, we need to get the parent declaration
			if (def.node.type === "Identifier") {
				return def.node.parent;
			}

			return def.node;
		}

		/**
		 * Find variables in a given scope and flag redeclared ones.
		 * @param {Scope} scope An eslint-scope scope object.
		 * @returns {void}
		 * @private
		 */
		function findVariablesInScope(scope) {
			for (const variable of scope.variables) {
				const allDeclarations = [...iterateDeclarations(variable)];
				const [declaration, ...extraDeclarations] = allDeclarations;

				if (extraDeclarations.length === 0) {
					continue;
				}

				/*
				 * For TypeScript, check if this is a valid declaration combination.
				 */
				const allNodes = allDeclarations.map(getDeclarationNode);

				if (isValidTSDeclarationCombination(allNodes)) {
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
