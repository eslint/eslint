/**
 * @fileoverview Traverser for SourceCode objects.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parse } = require("./esquery");
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
 * The selector lookup tables for a set of selectors.
 * @typedef {Object} SelectorLayout
 * @property {Map<string, ESQueryParsedSelector[]>} enterSelectorsByNodeType Selectors by node type for the enter phase.
 * @property {Map<string, ESQueryParsedSelector[]>} exitSelectorsByNodeType Selectors by node type for the exit phase.
 * @property {ESQueryParsedSelector[]} anyTypeEnterSelectors Selectors for any node type for the enter phase.
 * @property {ESQueryParsedSelector[]} anyTypeExitSelectors Selectors for any node type for the exit phase.
 * @property {Map<string, ESQueryParsedSelector[]>} enterCandidatesByNodeType All selectors to check per node type for the enter phase, filled on demand.
 * @property {Map<string, ESQueryParsedSelector[]>} exitCandidatesByNodeType All selectors to check per node type for the exit phase, filled on demand.
 */

/**
 * Selector lookup tables keyed by the list of raw selectors they were built
 * from. Files that are linted with the same rules almost always produce the
 * same list of selectors, so the tables can be shared between files.
 * @type {Map<string, SelectorLayout>}
 */
const selectorLayoutCache = new Map();
const MAX_SELECTOR_LAYOUTS = 64;

/**
 * Builds the selector lookup tables for a list of raw selectors.
 * @param {string[]} rawSelectors The raw selectors.
 * @returns {SelectorLayout} The lookup tables.
 */
function createSelectorLayout(rawSelectors) {
	const layout = {
		enterSelectorsByNodeType: new Map(),
		exitSelectorsByNodeType: new Map(),
		anyTypeEnterSelectors: [],
		anyTypeExitSelectors: [],
		enterCandidatesByNodeType: new Map(),
		exitCandidatesByNodeType: new Map(),
	};

	for (const rawSelector of rawSelectors) {
		const selector = parse(rawSelector);

		/*
		 * If this selector has identified specific node types,
		 * add it to the map for these node types for faster lookup.
		 */
		if (selector.nodeTypes) {
			const typeMap = selector.isExit
				? layout.exitSelectorsByNodeType
				: layout.enterSelectorsByNodeType;

			selector.nodeTypes.forEach(nodeType => {
				if (!typeMap.has(nodeType)) {
					typeMap.set(nodeType, []);
				}
				typeMap.get(nodeType).push(selector);
			});
			continue;
		}

		/*
		 * Remaining selectors are added to the "any type" selectors
		 * list for the appropriate phase of traversal. This ensures
		 * that all selectors will still be applied even if no
		 * specific node type is matched.
		 */
		const selectors = selector.isExit
			? layout.anyTypeExitSelectors
			: layout.anyTypeEnterSelectors;

		selectors.push(selector);
	}

	// sort all selectors by specificity for prioritizing call order
	layout.anyTypeEnterSelectors.sort(compareSpecificity);
	layout.anyTypeExitSelectors.sort(compareSpecificity);
	layout.enterSelectorsByNodeType.forEach(selectorList =>
		selectorList.sort(compareSpecificity),
	);
	layout.exitSelectorsByNodeType.forEach(selectorList =>
		selectorList.sort(compareSpecificity),
	);

	return layout;
}

/**
 * Gets the selector lookup tables for a list of raw selectors.
 * @param {string[]} rawSelectors The raw selectors.
 * @returns {SelectorLayout} The lookup tables. They are shared between files.
 */
function getSelectorLayout(rawSelectors) {
	const key = rawSelectors.join("\n");
	let layout = selectorLayoutCache.get(key);

	if (!layout) {
		layout = createSelectorLayout(rawSelectors);

		if (selectorLayoutCache.size >= MAX_SELECTOR_LAYOUTS) {
			selectorLayoutCache.clear();
		}
		selectorLayoutCache.set(key, layout);
	}

	return layout;
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
		 * The visitor to use during traversal.
		 * @type {SourceCodeVisitor}
		 */
		this.visitor = visitor;

		/**
		 * The options for `esquery` to use during matching.
		 * @type {ESQueryOptions}
		 */
		this.esqueryOptions = esqueryOptions;

		/**
		 * The property name to use to read a node's type.
		 * @type {string}
		 */
		this.nodeTypeKey = esqueryOptions?.nodeTypeKey || "type";

		/**
		 * A map of node type to selectors targeting that node type on the
		 * enter phase of traversal.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.enterSelectorsByNodeType = null;

		/**
		 * A map of node type to selectors targeting that node type on the
		 * exit phase of traversal.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.exitSelectorsByNodeType = null;

		/**
		 * An array of selectors that match any node type on the
		 * enter phase of traversal.
		 * @type {ESQueryParsedSelector[]}
		 */
		this.anyTypeEnterSelectors = null;

		/**
		 * An array of selectors that match any node type on the
		 * exit phase of traversal.
		 * @type {ESQueryParsedSelector[]}
		 */
		this.anyTypeExitSelectors = null;

		/**
		 * For each node type seen so far, all selectors that have to be
		 * checked for a node of that type on the enter phase of traversal,
		 * in the order in which they are applied.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.enterCandidatesByNodeType = null;

		/**
		 * For each node type seen so far, all selectors that have to be
		 * checked for a node of that type on the exit phase of traversal,
		 * in the order in which they are applied.
		 * @type {Map<string, ESQueryParsedSelector[]>}
		 */
		this.exitCandidatesByNodeType = null;

		const rawSelectors = [];

		visitor.forEachName(rawSelector => {
			rawSelectors.push(rawSelector);
		});

		const layout = getSelectorLayout(rawSelectors);

		this.enterSelectorsByNodeType = layout.enterSelectorsByNodeType;
		this.exitSelectorsByNodeType = layout.exitSelectorsByNodeType;
		this.anyTypeEnterSelectors = layout.anyTypeEnterSelectors;
		this.anyTypeExitSelectors = layout.anyTypeExitSelectors;
		this.enterCandidatesByNodeType = layout.enterCandidatesByNodeType;
		this.exitCandidatesByNodeType = layout.exitCandidatesByNodeType;
	}

	/**
	 * Gets all selectors that have to be checked for nodes of a given type,
	 * in specificity order.
	 * @param {string} nodeType The node type.
	 * @param {boolean} isExit `false` for the enter phase, `true` for the exit phase.
	 * @returns {ESQueryParsedSelector[]} The selectors to check.
	 */
	getCandidates(nodeType, isExit) {
		const candidatesByNodeType = isExit
			? this.exitCandidatesByNodeType
			: this.enterCandidatesByNodeType;
		let candidates = candidatesByNodeType.get(nodeType);

		if (!candidates) {
			const selectorsByNodeType = (
				isExit
					? this.exitSelectorsByNodeType
					: this.enterSelectorsByNodeType
			).get(nodeType);
			const anyTypeSelectors = isExit
				? this.anyTypeExitSelectors
				: this.anyTypeEnterSelectors;

			/*
			 * Both lists are sorted by specificity and no two selectors
			 * compare as equal, so sorting the combined list gives the same
			 * order as merging the two lists for every node.
			 */
			if (!selectorsByNodeType) {
				candidates = anyTypeSelectors;
			} else if (anyTypeSelectors.length === 0) {
				candidates = selectorsByNodeType;
			} else {
				candidates = [...selectorsByNodeType, ...anyTypeSelectors].sort(
					compareSpecificity,
				);
			}

			candidatesByNodeType.set(nodeType, candidates);
		}

		return candidates;
	}

	/**
	 * Calculates all appropriate selectors for a node, in specificity order
	 * @param {ASTNode} node The node to check
	 * @param {ASTNode[]} ancestry The ancestors of the node being checked, from the root down to its parent.
	 * @param {boolean} isExit `false` if the node is currently being entered, `true` if it's currently being exited
	 * @param {ESQueryParsedSelector[]} out An array to which matching selectors are appended.
	 * @returns {void}
	 */
	calculateSelectors(node, ancestry, isExit, out) {
		const candidates = this.getCandidates(node[this.nodeTypeKey], isExit);
		const esqueryOptions = this.esqueryOptions;

		for (let i = 0; i < candidates.length; i++) {
			const selector = candidates[i];

			/*
			 * Selectors that consist solely of node type identifiers or
			 * wildcards are guaranteed to match, so the matcher call
			 * can be skipped for them.
			 */
			if (
				selector.alwaysMatches ||
				selector.fastMatch(node, ancestry, esqueryOptions)
			) {
				out.push(selector);
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

		// The ancestors of the node being visited, from the root down to its parent.
		const currentAncestry = [];
		const matchedSelectors = [];

		/**
		 * Visits a node, calling the listeners of all matching selectors.
		 * @param {ASTNode} node The node to visit.
		 * @param {boolean} isExit `true` if the node is being exited.
		 * @param {Array<any>|undefined} args The arguments for the listeners. Defaults to the node.
		 * @returns {void}
		 * @throws {Error} If an error occurs in a listener.
		 */
		function visitNode(node, isExit, args) {
			try {
				if (isExit) {
					currentAncestry.pop();
				}

				matchedSelectors.length = 0;
				esquery.calculateSelectors(
					node,
					currentAncestry,
					isExit,
					matchedSelectors,
				);

				for (let i = 0; i < matchedSelectors.length; i++) {
					const source = matchedSelectors[i].source;

					if (!args) {
						visitor.callSync(source, node);
					} else if (args.length === 1) {
						visitor.callSync(source, args[0]);
					} else {
						visitor.callSync(source, ...args);
					}
				}

				if (!isExit) {
					currentAncestry.push(node);
				}
			} catch (err) {
				err.currentNode = node;
				throw err;
			}
		}

		/*
		 * When no steps were provided and the source code can report its
		 * traversal steps as they happen, dispatch directly from the walk.
		 * This avoids allocating a step object for every node visit.
		 */
		if (!steps && typeof sourceCode.traverseDirect === "function") {
			sourceCode.traverseDirect({
				enterNode(node) {
					visitNode(node, false, void 0);
				},
				leaveNode(node) {
					visitNode(node, true, void 0);
				},
				emit(eventName, args) {
					visitor.callSync(eventName, ...args);
				},
			});
			return;
		}

		const allSteps = steps ?? sourceCode.traverse();

		/**
		 * Applies a single traversal step.
		 * @param {Object} step The step to apply.
		 * @returns {void}
		 * @throws {Error} If an error occurs while applying the step.
		 */
		function applyStep(step) {
			switch (step.kind) {
				case STEP_KIND_VISIT: {
					visitNode(step.target, step.phase !== 1, step.args);
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

		/*
		 * Iterating an array by index avoids the overhead of the iterator
		 * protocol. Other iterables are iterated directly instead of being
		 * converted into an array first, because the conversion is slower than
		 * iterating them and would fully materialize a lazy iterable.
		 */
		if (Array.isArray(allSteps)) {
			for (let i = 0; i < allSteps.length; i++) {
				applyStep(allSteps[i]);
			}
		} else {
			for (const step of allSteps) {
				applyStep(step);
			}
		}
	}
}

module.exports = { SourceCodeTraverser };
