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
 * @import { ESQueryParsedSelector } from "./esquery.js";
 * @import { Language } from "@eslint/core";
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
 *
 */
class ESQueryHelper {
	/**
	 * The emitter to use during traversal.
	 * @type {SafeEmitter}
	 */
	emitter;

	/**
	 * The options for `esquery` to use during matching.
	 * @type {ESQueryOptions}
	 */
	esqueryOptions;

	/**
	 * A map of node type to selectors targeting that node type on the
	 * enter phase of traversal.
	 * @type {Map<string, ESQueryParsedSelector[]>}
	 */
	enterSelectorsByNodeType = new Map();

	/**
	 * A map of node type to selectors targeting that node type on the
	 * exit phase of traversal.
	 * @type {Map<string, ESQueryParsedSelector[]>}
	 */
	exitSelectorsByNodeType = new Map();

	/**
	 * An array of selectors that match any node type on the
	 * enter phase of traversal.
	 * @type {ESQueryParsedSelector[]}
	 */
	anyTypeEnterSelectors = [];

	/**
	 * An array of selectors that match any node type on the
	 * exit phase of traversal.
	 * @type {ESQueryParsedSelector[]}
	 */
	anyTypeExitSelectors = [];

	/**
	 * @param {SafeEmitter} emitter
	 * An SafeEmitter which is the destination of events. This emitter must already
	 * have registered listeners for all of the events that it needs to listen for.
	 * (See lib/linter/safe-emitter.js for more details on `SafeEmitter`.)
	 * @param {ESQueryOptions} esqueryOptions `esquery` options for traversing custom nodes.
	 * @returns {NodeEventGenerator} new instance
	 */
	constructor(emitter, esqueryOptions) {
		this.emitter = emitter;
		this.esqueryOptions = esqueryOptions;

		emitter.eventNames().forEach(rawSelector => {
			const selector = parse(rawSelector);

			/*
			 * If this selector has identified specific node types,
			 * add it to the map for these node types for faster lookup.
			 */
			if (selector.nodeTypes) {
				const typeMap = selector.isExit
					? this.exitSelectorsByNodeType
					: this.enterSelectorsByNodeType;

				selector.nodeTypes.forEach(nodeType => {
					if (!typeMap.has(nodeType)) {
						typeMap.set(nodeType, []);
					}
					typeMap.get(nodeType).push(selector);
				});
				return;
			}

			/*
			 * Remaining selectors are added to the "any type" selectors
			 * list for the appropriate phase of traversal. This ensures
			 * that all selectors will still be applied even if no
			 * specific node type is matched.
			 */
			const selectors = selector.isExit
				? this.anyTypeExitSelectors
				: this.anyTypeEnterSelectors;

			selectors.push(selector);
		});

		// sort all selectors by specificity for prioritizing call order
		this.anyTypeEnterSelectors.sort(compareSpecificity);
		this.anyTypeExitSelectors.sort(compareSpecificity);
		this.enterSelectorsByNodeType.forEach(selectorList =>
			selectorList.sort(compareSpecificity),
		);
		this.exitSelectorsByNodeType.forEach(selectorList =>
			selectorList.sort(compareSpecificity),
		);
	}

	/**
	 * Checks a selector against a node, and emits it if it matches
	 * @param {ASTNode} node The node to check
	 * @param {ASTNode[]} ancestry The ancestry of the node being checked.
	 * @param {ESQueryParsedSelector} selector An AST selector descriptor
	 * @returns {void}
	 */
	#applySelector(node, ancestry, selector) {
		if (matches(node, selector.root, ancestry, this.esqueryOptions)) {
			this.emitter.emit(selector.source, node);
		}
	}

	/**
	 * Applies all appropriate selectors to a node, in specificity order
	 * @param {ASTNode} node The node to check
	 * @param {ASTNode[]} ancestry The ancestry of the node being checked.
	 * @param {boolean} isExit `false` if the node is currently being entered, `true` if it's currently being exited
	 * @returns {void}
	 */
	applySelectors(node, ancestry, isExit) {
		const nodeTypeKey = this.esqueryOptions?.nodeTypeKey || "type";

		/*
		 * Get the selectors that may match this node. First, check
		 * to see if the node type has specific selectors,
		 * then gather the "any type" selectors.
		 */
		const selectorsByNodeType =
			(isExit
				? this.exitSelectorsByNodeType
				: this.enterSelectorsByNodeType
			).get(node[nodeTypeKey]) || [];
		const anyTypeSelectors = isExit
			? this.anyTypeExitSelectors
			: this.anyTypeEnterSelectors;

		/*
		 * selectorsByNodeType and anyTypeSelectors were already sorted by specificity in the constructor.
		 * Iterate through each of them, applying selectors in the right order.
		 */
		let selectorsByNodeTypeIndex = 0;
		let anyTypeSelectorsIndex = 0;

		while (
			selectorsByNodeTypeIndex < selectorsByNodeType.length ||
			anyTypeSelectorsIndex < anyTypeSelectors.length
		) {
			/*
			 * If we've already exhausted the selectors for this node type,
			 * or if the next any type selector is more specific than the
			 * next selector for this node type, apply the any type selector.
			 */
			if (
				selectorsByNodeTypeIndex >= selectorsByNodeType.length ||
				(anyTypeSelectorsIndex < anyTypeSelectors.length &&
					anyTypeSelectors[anyTypeSelectorsIndex].compare(
						selectorsByNodeType[selectorsByNodeTypeIndex],
					) < 0)
			) {
				this.#applySelector(
					node,
					ancestry,
					anyTypeSelectors[anyTypeSelectorsIndex++],
				);
			} else {
				// otherwise apply the node type selector
				this.#applySelector(
					node,
					ancestry,
					selectorsByNodeType[selectorsByNodeTypeIndex++],
				);
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
	 * The ancestry of the current node being traversed.
	 * This is used to provide context for the current node, such as
	 * its parent nodes.
	 * @type {ASTNode[]}
	 */
	currentAncestry = [];

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
	 * @param {SafeEmitter} emitter The emitter to use for events.
	 * @returns {void}
	 * @throws {Error} If an error occurs during traversal.
	 */
	traverseSync(sourceCode, emitter) {
		const esquery = new ESQueryHelper(emitter, {
			visitorKeys: sourceCode.visitorKeys ?? this.#language.visitorKeys,
			fallback: vk,
			// fallback: Traverser.getKeys,
			matchClass: this.#language.matchesSelectorClass ?? (() => false),
			nodeTypeKey: this.#language.nodeTypeKey,
		});

		for (const step of sourceCode.traverse()) {
			switch (step.kind) {
				case STEP_KIND_VISIT: {
					try {
						if (step.phase === 1) {
							esquery.applySelectors(
								step.target,
								this.currentAncestry,
								false,
							);
							this.currentAncestry.unshift(step.target);
						} else {
							this.currentAncestry.shift();
							esquery.applySelectors(
								step.target,
								this.currentAncestry,
								true,
							);
						}
					} catch (err) {
						err.currentNode = step.target;
						throw err;
					}
					break;
				}

				case STEP_KIND_CALL: {
					emitter.emit(step.target, ...step.args);
					break;
				}

				default:
					throw new Error(
						`Invalid traversal step found: "${step.type}".`,
					);
			}
		}
	}
}

module.exports = { SourceCodeTraverser };
