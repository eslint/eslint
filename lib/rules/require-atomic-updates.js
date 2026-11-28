/**
 * @fileoverview disallow assignments that can lead to race conditions due to usage of `await` or `yield`
 * @author Teddy Katz
 * @author Toru Nagashima
 */
"use strict";

/**
 * Make the map from identifiers to each reference.
 * @param {escope.Scope} scope The scope to get references.
 * @param {Map<Identifier, escope.Reference>} [outReferenceMap] The map from identifier nodes to each reference object.
 * @returns {Map<Identifier, escope.Reference>} `referenceMap`.
 */
function createReferenceMap(scope, outReferenceMap = new Map()) {
	for (const reference of scope.references) {
		if (reference.resolved === null) {
			continue;
		}

		outReferenceMap.set(reference.identifier, reference);
	}
	for (const childScope of scope.childScopes) {
		if (childScope.type !== "function") {
			createReferenceMap(childScope, outReferenceMap);
		}
	}

	return outReferenceMap;
}

/**
 * Get `reference.writeExpr` of a given reference.
 * If it's the read reference of MemberExpression in LHS, returns RHS in order to address `a.b = await a`
 * @param {escope.Reference} reference The reference to get.
 * @returns {Expression|null} The `reference.writeExpr`.
 */
function getWriteExpr(reference) {
	if (reference.writeExpr) {
		return reference.writeExpr;
	}
	let node = reference.identifier;

	while (node) {
		const t = node.parent.type;

		if (t === "AssignmentExpression" && node.parent.left === node) {
			return node.parent.right;
		}
		if (t === "MemberExpression" && node.parent.object === node) {
			node = node.parent;
			continue;
		}

		break;
	}

	return null;
}

/**
 * Checks if an expression is a variable that can only be observed within the given function.
 * @param {Variable|null} variable The variable to check
 * @param {boolean} isMemberAccess If `true` then this is a member access.
 * @returns {boolean} `true` if the variable is local to the given function, and is never referenced in a closure.
 */
function isLocalVariableWithoutEscape(variable, isMemberAccess) {
	if (!variable) {
		return false; // A global variable which was not defined.
	}

	// If the reference is a property access and the variable is a parameter, it handles the variable is not local.
	if (isMemberAccess && variable.defs.some(d => d.type === "Parameter")) {
		return false;
	}

	const functionScope = variable.scope.variableScope;

	return variable.references.every(
		reference => reference.from.variableScope === functionScope,
	);
}

const LOOP_TYPES = new Set([
	"WhileStatement",
	"DoWhileStatement",
	"ForStatement",
	"ForInStatement",
	"ForOfStatement",
]);

const BREAKABLE_TYPES = new Set([...LOOP_TYPES, "SwitchStatement"]);

/**
 * Collects exited scopes and async `for-of` loop exits along a jump path.
 * @param {ASTNode} jumpNode The jump statement node.
 * @param {ASTNode} functionNode The enclosing function node.
 * @returns {{ exitedScopes: ASTNode[], exitsAsyncForOf: boolean }} Exited scopes and async-iteration exit flag.
 */
function getJumpDisposalInfo(jumpNode, functionNode) {
	const exitedScopes = [];
	let exitsAsyncForOf = false;
	const jumpType = jumpNode.type;
	const labelName =
		(jumpType === "BreakStatement" || jumpType === "ContinueStatement") &&
		jumpNode.label
			? jumpNode.label.name
			: null;

	let child = jumpNode;
	let current = jumpNode.parent;

	while (current && current !== functionNode) {
		const { type } = current;

		if (jumpType === "ContinueStatement" && LOOP_TYPES.has(type)) {
			if (!labelName) {
				return { exitedScopes, exitsAsyncForOf };
			}
			let labelNode = current.parent;

			while (labelNode && labelNode.type === "LabeledStatement") {
				if (labelNode.label.name === labelName) {
					return { exitedScopes, exitsAsyncForOf };
				}
				labelNode = labelNode.parent;
			}
		}

		if (
			jumpType === "ReturnStatement" &&
			type === "TryStatement" &&
			current.finalizer &&
			(child === current.block || child === current.handler)
		) {
			return { exitedScopes, exitsAsyncForOf };
		}

		if (
			jumpType === "ThrowStatement" &&
			type === "TryStatement" &&
			((child === current.block &&
				(current.handler || current.finalizer)) ||
				(child === current.handler && current.finalizer))
		) {
			return { exitedScopes, exitsAsyncForOf };
		}

		if (
			type === "BlockStatement" ||
			type === "ForStatement" ||
			type === "ForOfStatement"
		) {
			exitedScopes.push(current);
		}

		if (type === "ForOfStatement" && current.await) {
			exitsAsyncForOf = true;
		}

		if (jumpType === "BreakStatement") {
			if (
				(!labelName && BREAKABLE_TYPES.has(type)) ||
				(labelName &&
					type === "LabeledStatement" &&
					current.label.name === labelName)
			) {
				return { exitedScopes, exitsAsyncForOf };
			}
		}

		child = current;
		current = current.parent;
	}

	if (jumpType === "ReturnStatement" || jumpType === "ThrowStatement") {
		return { exitedScopes: [], exitsAsyncForOf: false };
	}

	return { exitedScopes, exitsAsyncForOf };
}

/**
 * Represents segment information.
 */
class SegmentInfo {
	constructor() {
		this.info = new WeakMap();
	}

	/**
	 * Initialize the segment information.
	 * @param {PathSegment} segment The segment to initialize.
	 * @returns {void}
	 */
	initialize(segment) {
		const outdatedReadVariables = new Set();
		const freshReadVariables = new Set();
		const disposableScopes = new Set();

		for (const prevSegment of segment.prevSegments) {
			const info = this.info.get(prevSegment);

			if (info) {
				info.outdatedReadVariables.forEach(
					Set.prototype.add,
					outdatedReadVariables,
				);
				info.freshReadVariables.forEach(
					Set.prototype.add,
					freshReadVariables,
				);
				if (info.disposableScopes.size > 0) {
					info.disposableScopes.forEach(
						Set.prototype.add,
						disposableScopes,
					);
				}
			}
		}

		this.info.set(segment, {
			outdatedReadVariables,
			freshReadVariables,
			disposableScopes,
		});
	}

	/**
	 * Mark a given variable as read on given segments.
	 * @param {PathSegment[]} segments The segments that it read the variable on.
	 * @param {Variable} variable The variable to be read.
	 * @returns {void}
	 */
	markAsRead(segments, variable) {
		for (const segment of segments) {
			const info = this.info.get(segment);

			if (info) {
				info.freshReadVariables.add(variable);

				// If a variable is freshly read again, then it's no more out-dated.
				info.outdatedReadVariables.delete(variable);
			}
		}
	}

	/**
	 * Move `freshReadVariables` to `outdatedReadVariables`.
	 * @param {PathSegment[]} segments The segments to process.
	 * @returns {void}
	 */
	makeOutdated(segments) {
		for (const segment of segments) {
			const info = this.info.get(segment);

			if (info) {
				info.freshReadVariables.forEach(
					Set.prototype.add,
					info.outdatedReadVariables,
				);
				info.freshReadVariables.clear();
			}
		}
	}

	addDisposableScope(segments, scopeNode) {
		for (const segment of segments) {
			const info = this.info.get(segment);

			if (info) {
				info.disposableScopes.add(scopeNode);
			}
		}
	}

	disposeScopes(segments, scopeNodes) {
		for (const segment of segments) {
			const info = this.info.get(segment);

			if (!info || info.disposableScopes.size === 0) {
				continue;
			}

			let hasDisposedScope = false;

			for (const scopeNode of scopeNodes) {
				if (info.disposableScopes.delete(scopeNode)) {
					hasDisposedScope = true;
				}
			}

			if (hasDisposedScope) {
				info.freshReadVariables.forEach(
					Set.prototype.add,
					info.outdatedReadVariables,
				);
				info.freshReadVariables.clear();
			}
		}
	}

	inheritOutdated(targetSegments, sourceSegments) {
		const outdatedVariables = new Set();

		for (const sourceSegment of sourceSegments) {
			const sourceInfo = this.info.get(sourceSegment);

			if (sourceInfo) {
				sourceInfo.outdatedReadVariables.forEach(
					Set.prototype.add,
					outdatedVariables,
				);
			}
		}

		if (outdatedVariables.size === 0) {
			return;
		}

		for (const segment of targetSegments) {
			const info = this.info.get(segment);

			if (info) {
				for (const variable of outdatedVariables) {
					if (!info.freshReadVariables.has(variable)) {
						info.outdatedReadVariables.add(variable);
					}
				}
			}
		}
	}

	/**
	 * Check if a given variable is outdated on the current segments.
	 * @param {PathSegment[]} segments The current segments.
	 * @param {Variable} variable The variable to check.
	 * @returns {boolean} `true` if the variable is outdated on the segments.
	 */
	isOutdated(segments, variable) {
		for (const segment of segments) {
			const info = this.info.get(segment);

			if (info && info.outdatedReadVariables.has(variable)) {
				return true;
			}
		}
		return false;
	}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",

		defaultOptions: [
			{
				allowProperties: false,
			},
		],

		docs: {
			description:
				"Disallow assignments that can lead to race conditions due to usage of `await` or `yield`",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/require-atomic-updates",
		},

		fixable: null,

		schema: [
			{
				type: "object",
				properties: {
					allowProperties: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],

		messages: {
			nonAtomicUpdate:
				"Possible race condition: `{{value}}` might be reassigned based on an outdated value of `{{value}}`.",
			nonAtomicObjectUpdate:
				"Possible race condition: `{{value}}` might be assigned based on an outdated state of `{{object}}`.",
		},
	},

	create(context) {
		const [{ allowProperties }] = context.options;

		const sourceCode = context.sourceCode;
		const assignmentReferences = new Map();
		const forAwaitRightSegments = new Map();
		const segmentInfo = new SegmentInfo();
		let stack = null;

		/**
		 * Updates segments when a jump exits `await using` or async `for-of`.
		 * @param {ASTNode} jumpNode The jump statement node.
		 * @returns {void}
		 */
		function handleAbruptExit(jumpNode) {
			if (!stack.referenceMap) {
				return;
			}

			const { exitedScopes, exitsAsyncForOf } = getJumpDisposalInfo(
				jumpNode,
				stack.functionNode,
			);

			if (exitsAsyncForOf) {
				segmentInfo.makeOutdated(stack.currentSegments);
			}
			if (exitedScopes.length > 0) {
				segmentInfo.disposeScopes(stack.currentSegments, exitedScopes);
			}
		}

		return {
			onCodePathStart(codePath, node) {
				const scope = sourceCode.getScope(node);
				const shouldVerify =
					scope.type === "function" &&
					(scope.block.async || scope.block.generator);

				stack = {
					upper: stack,
					codePath,
					functionNode: node,
					referenceMap: shouldVerify
						? createReferenceMap(scope)
						: null,
					currentSegments: new Set(),
				};
			},
			onCodePathEnd(_, node) {
				stack = stack.upper;

				if (
					stack &&
					stack.referenceMap &&
					node.parent &&
					node.parent.type === "ForOfStatement" &&
					node.parent.await &&
					node.parent.right === node
				) {
					segmentInfo.makeOutdated(stack.currentSegments);
					forAwaitRightSegments.set(node.parent, [
						...stack.currentSegments,
					]);
				}
			},

			// Initialize the segment information.
			onCodePathSegmentStart(segment) {
				segmentInfo.initialize(segment);
				stack.currentSegments.add(segment);
			},

			onUnreachableCodePathSegmentStart(segment) {
				stack.currentSegments.add(segment);
			},

			onUnreachableCodePathSegmentEnd(segment) {
				stack.currentSegments.delete(segment);
			},

			onCodePathSegmentEnd(segment) {
				stack.currentSegments.delete(segment);
			},

			"VariableDeclaration[kind='await using']:exit"(node) {
				if (!stack.referenceMap) {
					return;
				}

				const { parent } = node;
				const owner =
					parent.type === "BlockStatement" ||
					(parent.type === "ForStatement" && parent.init === node) ||
					(parent.type === "ForOfStatement" && parent.left === node)
						? parent
						: null;

				if (owner) {
					segmentInfo.addDisposableScope(
						stack.currentSegments,
						owner,
					);
				}
			},

			"BlockStatement:exit"(node) {
				if (!stack.referenceMap) {
					return;
				}

				segmentInfo.disposeScopes(stack.currentSegments, [node]);
			},

			"ForStatement:exit"(node) {
				if (!stack.referenceMap) {
					return;
				}

				segmentInfo.disposeScopes(stack.currentSegments, [node]);
			},

			"ForOfStatement > .body"(node) {
				if (!stack.referenceMap || !node.parent.await) {
					return;
				}

				const rightSegments = forAwaitRightSegments.get(node.parent);

				if (rightSegments) {
					segmentInfo.inheritOutdated(
						stack.currentSegments,
						rightSegments,
					);
					forAwaitRightSegments.delete(node.parent);
				}
			},

			"ForOfStatement:exit"(node) {
				if (!stack.referenceMap) {
					return;
				}

				forAwaitRightSegments.delete(node);

				if (node.await) {
					segmentInfo.makeOutdated(stack.currentSegments);
				}
				segmentInfo.disposeScopes(stack.currentSegments, [node]);
			},

			BreakStatement(node) {
				handleAbruptExit(node);
			},

			ContinueStatement(node) {
				handleAbruptExit(node);
			},

			"ReturnStatement:exit"(node) {
				handleAbruptExit(node);
			},

			"ThrowStatement:exit"(node) {
				handleAbruptExit(node);
			},

			// Handle references to prepare verification.
			Identifier(node) {
				const { referenceMap } = stack;
				const reference = referenceMap && referenceMap.get(node);

				// Ignore if this is not a valid variable reference.
				if (!reference) {
					return;
				}
				const variable = reference.resolved;
				const writeExpr = getWriteExpr(reference);
				const isMemberAccess =
					reference.identifier.parent.type === "MemberExpression";

				// Add a fresh read variable.
				if (
					reference.isRead() &&
					!(writeExpr && writeExpr.parent.operator === "=")
				) {
					segmentInfo.markAsRead(stack.currentSegments, variable);
				}

				/*
				 * Register the variable to verify after ESLint traversed the `writeExpr` node
				 * if this reference is an assignment to a variable which is referred from other closure.
				 */
				if (
					writeExpr &&
					writeExpr.parent.right === writeExpr && // ← exclude variable declarations.
					!isLocalVariableWithoutEscape(variable, isMemberAccess)
				) {
					let refs = assignmentReferences.get(writeExpr);

					if (!refs) {
						refs = [];
						assignmentReferences.set(writeExpr, refs);
					}

					refs.push(reference);
				}
			},

			/*
			 * Verify assignments.
			 * If the reference exists in `outdatedReadVariables` list, report it.
			 */
			":expression:exit"(node) {
				// referenceMap exists if this is in a resumable function scope.
				if (!stack.referenceMap) {
					return;
				}

				// Mark the read variables on this code path as outdated.
				if (
					node.type === "AwaitExpression" ||
					node.type === "YieldExpression"
				) {
					segmentInfo.makeOutdated(stack.currentSegments);
				}

				// Verify.
				const references = assignmentReferences.get(node);

				if (references) {
					assignmentReferences.delete(node);

					for (const reference of references) {
						const variable = reference.resolved;

						if (
							segmentInfo.isOutdated(
								stack.currentSegments,
								variable,
							)
						) {
							if (node.parent.left === reference.identifier) {
								context.report({
									node: node.parent,
									messageId: "nonAtomicUpdate",
									data: {
										value: variable.name,
									},
								});
							} else if (!allowProperties) {
								context.report({
									node: node.parent,
									messageId: "nonAtomicObjectUpdate",
									data: {
										value: sourceCode.getText(
											node.parent.left,
										),
										object: variable.name,
									},
								});
							}
						}
					}
				}

				if (
					node.parent.type === "ForOfStatement" &&
					node.parent.await &&
					node.parent.right === node
				) {
					segmentInfo.makeOutdated(stack.currentSegments);
					forAwaitRightSegments.set(node.parent, [
						...stack.currentSegments,
					]);
				}
			},
		};
	},
};
