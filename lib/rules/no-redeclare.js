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
		 * Determines if a definition node is of a specific type.
		 * @param {ASTNode} node The AST node to check.
		 * @param {string} nodeType The node type to check against.
		 * @returns {boolean} True if the node is of the specified type.
		 */
		function isNodeType(node, nodeType) {
			return node && node.type === nodeType;
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

				// Unwrap ExportNamedDeclaration
				if (
					decl.type === "ExportNamedDeclaration" &&
					decl.declaration
				) {
					decl = decl.declaration;
				}

				// Value declarations make the namespace instantiated
				if (
					decl.type === "VariableDeclaration" ||
					decl.type === "FunctionDeclaration" ||
					decl.type === "ClassDeclaration" ||
					decl.type === "TSEnumDeclaration"
				) {
					return true;
				}

				// Nested instantiated namespace makes the parent instantiated
				if (
					decl.type === "TSModuleDeclaration" &&
					isNamespaceInstantiated(decl)
				) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Checks if a combination of TypeScript declarations is valid.
		 * TypeScript allows declaration merging for interfaces, classes,
		 * namespaces, enums, and functions. This function returns false
		 * only for invalid combinations.
		 * @param {Array} nodes Array of declaration nodes.
		 * @returns {boolean} True if the combination is valid in TypeScript.
		 */
		function isValidTSDeclarationCombination(nodes) {
			if (nodes.length < 2) {
				return false;
			}

			/**
			 * Mergeable declaration types in TypeScript.
			 */
			const mergeableTypes = new Set([
				"ClassDeclaration",
				"TSModuleDeclaration",
				"FunctionDeclaration",
				"TSDeclareFunction",
				"TSEnumDeclaration",
				"VariableDeclarator",
			]);

			/**
			 * Value-only declarations (exist only in value namespace).
			 */
			const valueOnlyDeclarations = new Set([
				"VariableDeclarator",
				"FunctionDeclaration",
				"TSDeclareFunction",
			]);

			// Filter out null nodes (from builtins/comments) and check if all are mergeable
			const validNodes = nodes.filter(node => node !== null);

			/*
			 * If there are null nodes (builtins/comments), only allow if all
			 * remaining nodes are type-only (interfaces, type aliases, or
			 * non-instantiated namespaces) since they don't conflict with values.
			 */
			if (validNodes.length !== nodes.length) {
				return (
					validNodes.length > 0 &&
					validNodes.every(
						node =>
							node.type === "TSModuleDeclaration" &&
							!isNamespaceInstantiated(node),
					)
				);
			}

			const hasNonMergeable = validNodes.some(
				node => !mergeableTypes.has(node.type),
			);

			// If there are non-mergeable declarations, not valid
			if (hasNonMergeable) {
				return false;
			}

			// Multiple FunctionDeclarations are not allowed (JS semantics)
			const functionCount = validNodes.filter(node =>
				isNodeType(node, "FunctionDeclaration"),
			).length;

			if (functionCount > 1) {
				return false;
			}

			// Multiple VariableDeclarators are not allowed
			const variableCount = validNodes.filter(node =>
				isNodeType(node, "VariableDeclarator"),
			).length;

			if (variableCount > 1) {
				return false;
			}

			/*
			 * Multiple TSEnumDeclarations are reported, even though enums do
			 * merge with each other, to match typescript-eslint's behavior.
			 */
			const enumCount = validNodes.filter(node =>
				isNodeType(node, "TSEnumDeclaration"),
			).length;

			if (enumCount > 1) {
				return false;
			}

			// Separate nodes by namespace, treating non-instantiated namespaces as type-only
			const typeOnlyNodes = validNodes.filter(
				node =>
					node.type === "TSModuleDeclaration" &&
					!isNamespaceInstantiated(node),
			);
			const valueOnlyNodes = validNodes.filter(node =>
				valueOnlyDeclarations.has(node.type),
			);
			const bothNamespaceNodes = validNodes.filter(
				node =>
					node.type === "TSModuleDeclaration" &&
					isNamespaceInstantiated(node),
			);

			// If all nodes are type-only, it's valid (interfaces merge, type aliases already checked above)
			if (typeOnlyNodes.length === validNodes.length) {
				return true;
			}

			/*
			 * If we only have type-only and value-only nodes (no both-namespace nodes),
			 * check that value-only nodes don't conflict with each other
			 */
			if (bothNamespaceNodes.length === 0) {
				return valueOnlyNodes.length <= 1;
			}

			/*
			 * If we have both-namespace nodes (class, enum, namespace), they can merge with each other
			 * and with compatible value/type declarations
			 * But value-only declarations conflict with both-namespace declarations (except function + namespace)
			 */
			if (valueOnlyNodes.length > 0) {
				// Check if it's a valid function + namespace pattern
				const hasOnlyFunctionsAsValueOnly = valueOnlyNodes.every(
					node =>
						isNodeType(node, "FunctionDeclaration") ||
						isNodeType(node, "TSDeclareFunction"),
				);
				const hasOnlyNamespacesAsBoth = bothNamespaceNodes.every(node =>
					isNodeType(node, "TSModuleDeclaration"),
				);

				if (hasOnlyFunctionsAsValueOnly && hasOnlyNamespacesAsBoth) {
					return true;
				}

				// VariableDeclarator conflicts with both-namespace nodes
				if (variableCount > 0) {
					return false;
				}
			}

			// All other combinations of mergeable types are valid in TypeScript
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
