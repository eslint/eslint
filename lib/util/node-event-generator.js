/**
 * @fileoverview The event generator for AST nodes.
 * @author Toru Nagashima
 */

"use strict";

const esquery = require("esquery");
const lodash = require("lodash");

/**
* Gets the possible types of a selector
* @param {Object} selector parsed selector
* @returns {string[]|null} The node types that could possibly trigger this selector, or `null` if all node types could trigger it
*/
function getPossibleTypes(selector) {
    switch (selector.type) {
        case "identifier":
            return [selector.value];

        case "matches": {
            const typesPerCase = selector.selectors.map(getPossibleTypes);

            if (typesPerCase.every(typeList => typeList)) {
                return lodash.union.apply(null, typesPerCase);
            }
            return null;
        }

        case "compound":
            return lodash.intersection.apply(null, selector.selectors.map(getPossibleTypes).filter(Boolean));

        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return getPossibleTypes(selector.right);

        default:
            return null;

    }
}

const parseSelector = lodash.memoize(query => {
    const parsedSelector = esquery.parse(query.replace(/:exit$/, ""));

    return {
        query,
        isExit: query.endsWith(":exit"),
        parsedSelector,
        listenerTypes: getPossibleTypes(parsedSelector)
    };
});

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The event generator for AST nodes.
 * This implements below interface.
 *
 * ```ts
 * interface EventGenerator {
 *     emitter: EventEmitter;
 *     enterNode(node: ASTNode): void;
 *     leaveNode(node: ASTNode): void;
 * }
 * ```
 */
class NodeEventGenerator {

    /**
    * @param {EventEmitter} emitter - An event emitter which is the destination of events.
    * @param {Set<string>} queries A list of query selector strings to detect and emit
    * @returns {NodeEventGenerator} new instance
    */
    constructor(emitter, queries) {
        this.emitter = emitter;
        this.currentAncestry = [];
        this.scheduledExitMatches = new WeakMap();
        this.selectors = [];
        this.selectorsByNodeType = new Map();
        this.anyTypeSelectors = [];

        if (queries) {
            queries.forEach(query => {

                // Filter out selectors that only contain a node name, and treat them as a special case.
                // Although these selectors are valid, it's not necessary to check all of them on every node, because it's
                // always safe to just emit a node's type while entering it.
                if (!/^\w+(:exit)?$/.test(query)) {
                    this.selectors.push(parseSelector(query));
                }
            });
        }

        this.selectors.forEach(selector => {
            if (selector.listenerTypes) {
                selector.listenerTypes.forEach(nodeType => {
                    if (!this.selectorsByNodeType.has(nodeType)) {
                        this.selectorsByNodeType.set(nodeType, []);
                    }
                    this.selectorsByNodeType.get(nodeType).push(selector);
                });
            } else {
                this.anyTypeSelectors.push(selector);
            }
        });
    }

    applySelector(node, selector) {
        if (esquery.matches(node, selector.parsedSelector, this.currentAncestry)) {
            if (selector.isExit) {
                if (!this.scheduledExitMatches.has(node)) {
                    this.scheduledExitMatches.set(node, []);
                }
                this.scheduledExitMatches.get(node).push(selector);
            } else {
                this.emitter.emit(selector.query, node);
            }
        }
    }

    /**
     * Emits an event of entering AST node.
     * @param {ASTNode} node - A node which was entered.
     * @returns {void}
     */
    enterNode(node) {
        this.emitter.emit(node.type, node);

        if (node.parent) {
            this.currentAncestry.unshift(node.parent);
        }

        this.anyTypeSelectors.forEach(selector => this.applySelector(node, selector));

        if (this.selectorsByNodeType.has(node.type)) {
            this.selectorsByNodeType.get(node.type).forEach(selector => this.applySelector(node, selector));
        }
    }

    /**
     * Emits an event of leaving AST node.
     * @param {ASTNode} node - A node which was left.
     * @returns {void}
     */
    leaveNode(node) {
        this.currentAncestry.shift();
        this.emitter.emit(`${node.type}:exit`, node);

        if (this.scheduledExitMatches.has(node)) {
            this.scheduledExitMatches.get(node).forEach(selector => this.emitter.emit(selector.parsedSelector, node));
        }
    }
}

module.exports = NodeEventGenerator;
