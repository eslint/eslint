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
				yield { type: "syntax", node: id, loc: id.loc };
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
		 * Determines if a definition node is of a specific type.
		 * @param {ASTNode} node The AST node to check.
		 * @param {string} nodeType The node type to check against.
		 * @returns {boolean} True if the node is of the specified type.
		 */
		function isNodeType(node, nodeType) {
			return node && node.type === nodeType;
		}

		/**
		 * Checks if a combination of TypeScript declarations is valid.
		 * Valid combinations:
		 * - multiple interfaces (interface merging)
		 * - interface + class
		 * - class + namespace
		 * - interface + class + namespace
		 * - function + namespace
		 * - multiple namespaces
		 * @param {Array} nodes Array of declaration nodes.
		 * @returns {boolean} True if the combination is valid in TypeScript.
		 */
		function isValidTSDeclarationCombination(nodes) {
			if (nodes.length < 2) {
				return false;
			}

			const counts = {
				interfaces: nodes.filter(node =>
					isNodeType(node, "TSInterfaceDeclaration"),
				).length,
				classes: nodes.filter(node =>
					isNodeType(node, "ClassDeclaration"),
				).length,
				namespaces: nodes.filter(node =>
					isNodeType(node, "TSModuleDeclaration"),
				).length,
				functions: nodes.filter(node =>
					isNodeType(node, "FunctionDeclaration"),
				).length,
				others: nodes.filter(
					node =>
						!isNodeType(node, "TSInterfaceDeclaration") &&
						!isNodeType(node, "ClassDeclaration") &&
						!isNodeType(node, "TSModuleDeclaration") &&
						!isNodeType(node, "FunctionDeclaration"),
				).length,
			};

			// If there are non-TS declarations mixed in, not valid
			if (counts.others > 0) {
				return false;
			}

			// Check valid combinations
			const { interfaces, classes, namespaces, functions } = counts;

			// Multiple interfaces only (interface merging)
			if (
				interfaces > 1 &&
				classes === 0 &&
				namespaces === 0 &&
				functions === 0
			) {
				return true;
			}

			// Multiple namespaces only
			if (
				namespaces > 1 &&
				interfaces === 0 &&
				classes === 0 &&
				functions === 0
			) {
				return true;
			}

			// Interface + class (+ optional namespace)
			if (interfaces === 1 && classes === 1 && functions === 0) {
				return true;
			}

			// Class + namespace (no interface or function)
			if (
				classes === 1 &&
				namespaces >= 1 &&
				interfaces === 0 &&
				functions === 0
			) {
				return true;
			}

			// Function + namespace (no interface or class)
			if (
				functions === 1 &&
				namespaces >= 1 &&
				interfaces === 0 &&
				classes === 0
			) {
				return true;
			}

			return false;
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
				const [declaration, ...extraDeclarations] =
					iterateDeclarations(variable);

				if (extraDeclarations.length === 0) {
					continue;
				}

				/*
				 * For TypeScript, check if this is a valid declaration combination.
				 */
				const allNodes = [declaration, ...extraDeclarations]
					.map(getDeclarationNode)
					.filter(node => node !== null);

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
