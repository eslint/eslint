/**
 * @fileoverview Traverser for SourceCode objects.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parse, matches } = require("./esquery");
const vk = require("eslint-visitor-keys");

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/**
 * @import { Language, SourceCode } from "@eslint/core";
 * @import { ESQueryOptions } from "esquery";
 * @import { ESQueryParsedSelector } from "./esquery.js";
 * @import { SourceCodeVisitor } from "./source-code-visitor.js";
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const STEP_KIND_VISIT = 1;
const STEP_KIND_CALL = 2;

/**
 * Compares two ESQuery selectors by specificity.
 * @param {ESQueryParsedSelector} a The first selector to compare.
 * @param {ESQueryParsedSelector} b The second selector to compare.
 * @returns {number} A negative number if `a` is less specific than `b` or they are equally specific and `a` <= `b` alphabetically, a positive number if `a` is more specific than `b`.
 */
function compareSpecificity(a, b) {
	return a.compare(b);
}

/**
 * Merges two already-sorted selector arrays into a single sorted array.
 * @param {ESQueryParsedSelector[]} a First sorted array.
 * @param {ESQueryParsedSelector[]} b Second sorted array.
 * @returns {ESQueryParsedSelector[]} Merged sorted array.
 */
function mergeSorted(a, b) {
	const result = new Array(a.length + b.length);
	let i = 0,
		j = 0,
		k = 0;

	while (i < a.length && j < b.length) {
		if (a[i].compare(b[j]) <= 0) {
			result[k++] = a[i++];
		} else {
			result[k++] = b[j++];
		}
	}
	while (i < a.length) {
		result[k++] = a[i++];
	}
	while (j < b.length) {
		result[k++] = b[j++];
	}
	return result;
}

/**
 * Helper to wrap ESQuery operations.
 */
class ESQueryHelper {
	/**
	 * Creates a new instance.
	 * @param {SourceCodeVisitor} visitor The visitor containing the functions to call.
	 * @param {ESQueryOptions} esqueryOptions `esquery` options for traversing custom nodes.
	 */
	constructor(visitor, esqueryOptions) {
		/**
		 * The options for `esquery` to use during matching.
		 * @type {ESQueryOptions}
		 */
		this.esqueryOptions = esqueryOptions;

		/**
		 * Cached node type key for fast property access.
		 * @type {string}
		 */
		this.nodeTypeKey = esqueryOptions?.nodeTypeKey || "type";

		const enterSelectorsByNodeType = new Map();
		const exitSelectorsByNodeType = new Map();
		const anyTypeEnterSelectors = [];
		const anyTypeExitSelectors = [];

		visitor.forEachName(rawSelector => {
			const selector = parse(rawSelector);

			if (selector.nodeTypes) {
				const typeMap = selector.isExit
					? exitSelectorsByNodeType
					: enterSelectorsByNodeType;

				selector.nodeTypes.forEach(nodeType => {
					if (!typeMap.has(nodeType)) {
						typeMap.set(nodeType, []);
					}
					typeMap.get(nodeType).push(selector);
				});
				return;
			}

			const selectors = selector.isExit
				? anyTypeExitSelectors
				: anyTypeEnterSelectors;

			selectors.push(selector);
		});

		// Sort all selectors by specificity
		anyTypeEnterSelectors.sort(compareSpecificity);
		anyTypeExitSelectors.sort(compareSpecificity);
		enterSelectorsByNodeType.forEach(selectorList =>
			selectorList.sort(compareSpecificity),
		);
		exitSelectorsByNodeType.forEach(selectorList =>
			selectorList.sort(compareSpecificity),
		);

		/**
		 * Pre-merged enter selectors per node type (type-specific + any-type,
		 * already sorted by specificity). Eliminates per-node merge work.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.preMergedEnterSelectors = new Map();
		for (const [nodeType, typeSelectors] of enterSelectorsByNodeType) {
			this.preMergedEnterSelectors.set(
				nodeType,
				mergeSorted(typeSelectors, anyTypeEnterSelectors),
			);
		}

		/**
		 * Pre-merged exit selectors per node type.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.preMergedExitSelectors = new Map();
		for (const [nodeType, typeSelectors] of exitSelectorsByNodeType) {
			this.preMergedExitSelectors.set(
				nodeType,
				mergeSorted(typeSelectors, anyTypeExitSelectors),
			);
		}

		/**
		 * Fallback selectors for node types not in the pre-merged maps.
		 * @type {ESQueryParsedSelector[]}
		 */
		this.anyTypeEnterSelectors = anyTypeEnterSelectors;

		/**
		 * Fallback exit selectors for node types not in the pre-merged maps.
		 * @type {ESQueryParsedSelector[]}
		 */
		this.anyTypeExitSelectors = anyTypeExitSelectors;
	}

	/**
	 * Dispatches matching selectors directly to the visitor for a given node,
	 * avoiding intermediate array allocation.
	 * @param {ASTNode} node The node to check.
	 * @param {ASTNode[]} ancestry The ancestry of the node.
	 * @param {boolean} isExit Whether we are in the exit phase.
	 * @param {SourceCodeVisitor} visitor The visitor to dispatch to.
	 * @param {any[]} [stepArgs] Explicit args from the traversal step, if any.
	 * @param {ASTNode} stepTarget The step target node (used as default arg).
	 * @returns {void}
	 */
	dispatchSelectors(node, ancestry, isExit, visitor, stepArgs, stepTarget) {
		const nodeType = node[this.nodeTypeKey];
		const preMergedMap = isExit
			? this.preMergedExitSelectors
			: this.preMergedEnterSelectors;

		const selectorList =
			preMergedMap.get(nodeType) ||
			(isExit ? this.anyTypeExitSelectors : this.anyTypeEnterSelectors);

		for (let i = 0; i < selectorList.length; i++) {
			const selector = selectorList[i];

			/*
			 * Simple identifier selectors (e.g. "FunctionDeclaration") that
			 * are in the type-specific map are guaranteed to match any node
			 * of this type -- skip the expensive esquery.matches() call.
			 * For all other selectors, run the full match.
			 */
			if (
				selector.root.type === "identifier" ||
				matches(node, selector.root, ancestry, this.esqueryOptions)
			) {
				if (stepArgs) {
					visitor.callSync(selector.source, ...stepArgs);
				} else {
					visitor.callSyncSingle(selector.source, stepTarget);
				}
			}
		}
	}
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Traverses source code and ensures that visitor methods are called when
 * entering and leaving each node.
 */
class SourceCodeTraverser {
	/**
	 * The language of the source code being traversed.
	 * @type {Language}
	 */
	#language;

	/**
	 * Map of languages to instances of this class.
	 * @type {WeakMap<Language, SourceCodeTraverser>}
	 */
	static instances = new WeakMap();

	/**
	 * Creates a new instance.
	 * @param {Language} language The language of the source code being traversed.
	 */
	constructor(language) {
		this.#language = language;
	}

	static getInstance(language) {
		if (!this.instances.has(language)) {
			this.instances.set(language, new this(language));
		}

		return this.instances.get(language);
	}

	/**
	 * Traverses the given source code synchronously.
	 * @param {SourceCode} sourceCode The source code to traverse.
	 * @param {SourceCodeVisitor} visitor The emitter to use for events.
	 * @param {Object} options Options for traversal.
	 * @param {ReturnType<SourceCode["traverse"]>} options.steps The steps to take during traversal.
	 * @returns {void}
	 * @throws {Error} If an error occurs during traversal.
	 */
	traverseSync(sourceCode, visitor, { steps } = {}) {
		const esquery = new ESQueryHelper(visitor, {
			visitorKeys: sourceCode.visitorKeys ?? this.#language.visitorKeys,
			fallback: vk.getKeys,
			matchClass: this.#language.matchesSelectorClass ?? (() => false),
			nodeTypeKey: this.#language.nodeTypeKey,
		});

		const allSteps = steps ?? sourceCode.traverse();
		const {
			stepTypes,
			stepTargets,
			stepArgs,
			length: stepCount,
		} = allSteps;

		/*
		 * Fast path: if the steps are encoded as parallel typed arrays
		 * (from the optimized traverse()), iterate them directly.
		 * stepTypes values: 1 = visit-enter, 2 = visit-exit, 3 = call-method.
		 */
		if (stepTypes) {
			const currentAncestry = [];

			for (let i = 0; i < stepCount; i++) {
				const kind = stepTypes[i];

				if (kind === 1) {
					const node = stepTargets[i];

					/*
					 * Leaf optimisation: if the next step is the matching
					 * exit for the same node, dispatch both without ancestry
					 * push/pop.
					 */
					if (
						i + 1 < stepCount &&
						stepTypes[i + 1] === 2 &&
						stepTargets[i + 1] === node
					) {
						try {
							esquery.dispatchSelectors(
								node,
								currentAncestry,
								false,
								visitor,
								null,
								node,
							);
							esquery.dispatchSelectors(
								node,
								currentAncestry,
								true,
								visitor,
								null,
								node,
							);
						} catch (err) {
							err.currentNode = node;
							throw err;
						}
						i++;
					} else {
						try {
							esquery.dispatchSelectors(
								node,
								currentAncestry,
								false,
								visitor,
								null,
								node,
							);
							currentAncestry.unshift(node);
						} catch (err) {
							err.currentNode = node;
							throw err;
						}
					}
				} else if (kind === 2) {
					const node = stepTargets[i];

					currentAncestry.shift();
					try {
						esquery.dispatchSelectors(
							node,
							currentAncestry,
							true,
							visitor,
							null,
							node,
						);
					} catch (err) {
						err.currentNode = node;
						throw err;
					}
				} else {
					visitor.callSync(stepTargets[i], ...stepArgs[i]);
				}
			}

			return;
		}

		/* Legacy path for old-style step arrays (non-JS languages). */
		const currentAncestry = [];

		for (const step of allSteps) {
			switch (step.kind) {
				case STEP_KIND_VISIT: {
					try {
						if (step.phase === 1) {
							esquery.dispatchSelectors(
								step.target,
								currentAncestry,
								false,
								visitor,
								step.args,
								step.target,
							);
							currentAncestry.unshift(step.target);
						} else {
							currentAncestry.shift();
							esquery.dispatchSelectors(
								step.target,
								currentAncestry,
								true,
								visitor,
								step.args,
								step.target,
							);
						}
					} catch (err) {
						err.currentNode = step.target;
						throw err;
					}
					break;
				}

				case STEP_KIND_CALL: {
					visitor.callSync(step.target, ...step.args);
					break;
				}

				default:
					throw new Error(
						`Invalid traversal step found: "${step.kind}".`,
					);
			}
		}
	}
}

module.exports = { SourceCodeTraverser };
