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
 * @returns {number} A negative number if `a` is more specific than `b`, a positive number if `b` is more specific than `a`, or zero if they are equally specific.
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
		this.currentAncestry = [];
		this.enterSelectorsByNodeType = new Map();
		this.exitSelectorsByNodeType = new Map();
		this.anyTypeEnterSelectors = [];
		this.anyTypeExitSelectors = [];

		emitter.eventNames().forEach(rawSelector => {
			const selector = parse(rawSelector);

			if (selector.listenerTypes) {
				const typeMap = selector.isExit
					? this.exitSelectorsByNodeType
					: this.enterSelectorsByNodeType;

				selector.listenerTypes.forEach(nodeType => {
					if (!typeMap.has(nodeType)) {
						typeMap.set(nodeType, []);
					}
					typeMap.get(nodeType).push(selector);
				});
				return;
			}
			const selectors = selector.isExit
				? this.anyTypeExitSelectors
				: this.anyTypeEnterSelectors;

			selectors.push(selector);
		});

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
		let selectorsByTypeIndex = 0;
		let anyTypeSelectorsIndex = 0;

		while (
			selectorsByTypeIndex < selectorsByNodeType.length ||
			anyTypeSelectorsIndex < anyTypeSelectors.length
		) {
			if (
				selectorsByTypeIndex >= selectorsByNodeType.length ||
				(anyTypeSelectorsIndex < anyTypeSelectors.length &&
					anyTypeSelectors[anyTypeSelectorsIndex].compare(
						selectorsByNodeType[selectorsByTypeIndex],
					) < 0)
			) {
				this.applySelector(
					node,
					anyTypeSelectors[anyTypeSelectorsIndex++],
				);
			} else {
				this.applySelector(
					node,
					selectorsByNodeType[selectorsByTypeIndex++],
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
