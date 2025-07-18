/**
 * @fileoverview Rule to flag creation of function inside a loop
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const CONSTANT_BINDINGS = new Set(["const", "using", "await using"]);

/**
 * Identifies is a node is a FunctionExpression which is part of an IIFE
 * @param {ASTNode} node Node to test
 * @returns {boolean} True if it's an IIFE
 */
function isIIFE(node) {
	return (
		(node.type === "FunctionExpression" ||
			node.type === "ArrowFunctionExpression") &&
		node.parent &&
		node.parent.type === "CallExpression" &&
		node.parent.callee === node
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",
		dialects: ["typescript", "javascript"],
		language: "javascript",

		docs: {
			description:
				"Disallow function declarations that contain unsafe references inside loop statements",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-loop-func",
		},

		schema: [],

		messages: {
			unsafeRefs:
				"Function declared in a loop contains unsafe references to variable(s) {{ varNames }}.",
		},
	},

	create(context) {
		const SKIPPED_IIFE_NODES = new Set();
		const sourceCode = context.sourceCode;

		/**
		 * Gets the containing loop node of a specified node.
		 *
		 * We don't need to check nested functions, so this ignores those, with the exception of IIFE.
		 * `Scope.through` contains references of nested functions.
		 * @param {ASTNode} node An AST node to get.
		 * @returns {ASTNode|null} The containing loop node of the specified node, or
		 *      `null`.
		 */
		function getContainingLoopNode(node) {
			for (
				let currentNode = node;
				currentNode.parent;
				currentNode = currentNode.parent
			) {
				const parent = currentNode.parent;

				switch (parent.type) {
					case "WhileStatement":
					case "DoWhileStatement":
						return parent;

					case "ForStatement":
						// `init` is outside of the loop.
						if (parent.init !== currentNode) {
							return parent;
						}
						break;

					case "ForInStatement":
					case "ForOfStatement":
						// `right` is outside of the loop.
						if (parent.right !== currentNode) {
							return parent;
						}
						break;

					case "ArrowFunctionExpression":
					case "FunctionExpression":
					case "FunctionDeclaration":
						// We need to check nested functions only in case of IIFE.
						if (SKIPPED_IIFE_NODES.has(parent)) {
							break;
						}

						return null;
					default:
						break;
				}
			}

			return null;
		}

		/**
		 * Gets the containing loop node of a given node.
		 * If the loop was nested, this returns the most outer loop.
		 * @param {ASTNode} node A node to get. This is a loop node.
		 * @param {ASTNode|null} excludedNode A node that the result node should not
		 *      include.
		 * @returns {ASTNode} The most outer loop node.
		 */
		function getTopLoopNode(node, excludedNode) {
			const border = excludedNode ? excludedNode.range[1] : 0;
			let retv = node;
			let containingLoopNode = node;

			while (
				containingLoopNode &&
				containingLoopNode.range[0] >= border
			) {
				retv = containingLoopNode;
				containingLoopNode = getContainingLoopNode(containingLoopNode);
			}

			return retv;
		}

		/**
		 * Checks whether a given reference which refers to an upper scope's variable is
		 * safe or not.
		 * @param {ASTNode} loopNode A containing loop node.
		 * @param {eslint-scope.Reference} reference A reference to check.
		 * @returns {boolean} `true` if the reference is safe or not.
		 */
		function isSafe(loopNode, reference) {
			const variable = reference.resolved;
			const definition = variable && variable.defs[0];
			const declaration = definition && definition.parent;
			const kind =
				declaration && declaration.type === "VariableDeclaration"
					? declaration.kind
					: "";

			// Constant variables are safe.
			if (CONSTANT_BINDINGS.has(kind)) {
				return true;
			}

			/*
			 * Variables which are declared by `let` in the loop is safe.
			 * It's a different instance from the next loop step's.
			 */
			if (
				kind === "let" &&
				declaration.range[0] > loopNode.range[0] &&
				declaration.range[1] < loopNode.range[1]
			) {
				return true;
			}

			/*
			 * WriteReferences which exist after this border are unsafe because those
			 * can modify the variable.
			 */
			const border = getTopLoopNode(
				loopNode,
				kind === "let" ? declaration : null,
			).range[0];

			/**
			 * Checks whether a given reference is safe or not.
			 * The reference is every reference of the upper scope's variable we are
			 * looking now.
			 *
			 * It's safe if the reference matches one of the following condition.
			 * - is readonly.
			 * - doesn't exist inside a local function and after the border.
			 * @param {eslint-scope.Reference} upperRef A reference to check.
			 * @returns {boolean} `true` if the reference is safe.
			 */
			function isSafeReference(upperRef) {
				const id = upperRef.identifier;

				return (
					!upperRef.isWrite() ||
					(variable.scope.variableScope ===
						upperRef.from.variableScope &&
						id.range[0] < border)
				);
			}

			return (
				Boolean(variable) && variable.references.every(isSafeReference)
			);
		}

		/**
		 * Reports functions which match the following condition:
		 *
		 * - has a loop node in ancestors.
		 * - has any references which refers to an unsafe variable.
		 * @param {ASTNode} node The AST node to check.
		 * @returns {void}
		 */
		function checkForLoops(node) {
			const loopNode = getContainingLoopNode(node);

			if (!loopNode) {
				return;
			}

			const references = sourceCode.getScope(node).through;

			// Check if the function is not asynchronous or a generator function
			if (!(node.async || node.generator)) {
				if (isIIFE(node)) {
					const isFunctionExpression =
						node.type === "FunctionExpression";

					// Check if the function is referenced elsewhere in the code
					const isFunctionReferenced =
						isFunctionExpression && node.id
							? references.some(
									r => r.identifier.name === node.id.name,
								)
							: false;

					if (!isFunctionReferenced) {
						SKIPPED_IIFE_NODES.add(node);
						return;
					}
				}
			}

			const unsafeRefs = [
				...new Set(
					references
						.filter(r => r.resolved && !isSafe(loopNode, r))
						.map(r => r.identifier.name),
				),
			];

			if (unsafeRefs.length > 0) {
				context.report({
					node,
					messageId: "unsafeRefs",
					data: { varNames: `'${unsafeRefs.join("', '")}'` },
				});
			}
		}

		return {
			ArrowFunctionExpression: checkForLoops,
			FunctionExpression: checkForLoops,
			FunctionDeclaration: checkForLoops,
		};
	},
};
