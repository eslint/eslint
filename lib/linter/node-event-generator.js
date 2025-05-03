/**
 * @fileoverview The event generator for AST nodes.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parse, matches } = require("./esquery");

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/**
 * @import { ESQueryParsedSelector } from "./esquery.js";
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Compares two ESQuery selectors by specificity.
 * @param {ESQueryParsedSelector} a The first selector to compare.
 * @param {ESQueryParsedSelector} b The second selector to compare.
 * @returns {number} A negative number if `a` is less specific than `b` or they are equally specific and `a` <= `b` alphabetically, a positive number if `a` is more specific than `b`.
 */
function compareSpecificity(a, b) {
	return a.compare(b);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The event generator for AST nodes.
 * This implements below interface.
 *
 * ```ts
 * interface EventGenerator {
 *     emitter: SafeEmitter;
 *     enterNode(node: ASTNode): void;
 *     leaveNode(node: ASTNode): void;
 * }
 * ```
 */
class NodeEventGenerator {
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
	 * The ancestry of the currently visited node.
	 * @type {ASTNode[]}
	 */
	currentAncestry = [];

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
	 * @param {ESQueryParsedSelector} selector An AST selector descriptor
	 * @returns {void}
	 */
	applySelector(node, selector) {
		if (
			matches(
				node,
				selector.root,
				this.currentAncestry,
				this.esqueryOptions,
			)
		) {
			this.emitter.emit(selector.source, node);
		}
	}

	/**
	 * Applies all appropriate selectors to a node, in specificity order
	 * @param {ASTNode} node The node to check
	 * @param {boolean} isExit `false` if the node is currently being entered, `true` if it's currently being exited
	 * @returns {void}
	 */
	applySelectors(node, isExit) {
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
				this.applySelector(
					node,
					anyTypeSelectors[anyTypeSelectorsIndex++],
				);
			} else {
				// otherwise apply the node type selector
				this.applySelector(
					node,
					selectorsByNodeType[selectorsByNodeTypeIndex++],
				);
			}
		}
	}

	/**
	 * Emits an event of entering AST node.
	 * @param {ASTNode} node A node which was entered.
	 * @returns {void}
	 */
	enterNode(node) {
		this.applySelectors(node, false);
		this.currentAncestry.unshift(node);
	}

	/**
	 * Emits an event of leaving AST node.
	 * @param {ASTNode} node A node which was left.
	 * @returns {void}
	 */
	leaveNode(node) {
		this.currentAncestry.shift();
		this.applySelectors(node, true);
	}
}

module.exports = NodeEventGenerator;
