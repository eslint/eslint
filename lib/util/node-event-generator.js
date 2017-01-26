/**
 * @fileoverview The event generator for AST nodes.
 * @author Toru Nagashima
 */

"use strict";

const esquery = require("esquery");
const lodash = require("lodash");
const scheduledExitMatches = new WeakMap();

/**
* Gets the possible types of a selector
* @param {Object} selector parsed selector
* @returns {string[]|null} return value (TODO)
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
    * @param {string[]} rawSelectors A list of query selector strings to detect and emit
    * @returns {NodeEventGenerator} new instance
    */
    constructor(emitter, rawSelectors) {
        this.emitter = emitter;
        this.currentAncestry = [];
        this.parsedQueryMap = (rawSelectors || [])

            // Filter out selectors that only contain a node name, and treat them as a special case.
            // Although these selectors are valid, it's not necessary to check all of them on every node, because it's
            // always safe to just emit a node's type while entering it.
            .filter(query => !/^\w+(:exit)?$/.test(query))
            .reduce((parsedQueryMap, rawSelector) => parsedQueryMap.set(esquery.parse(rawSelector.replace(/:exit$/, "")), rawSelector), new Map());

        this.selectorsByNodeType = new Map();
        this.anyTypeSelectors = [];
        this.parsedQueryMap.forEach((_, parsedSelector) => {
            const possibleTypes = getPossibleTypes(parsedSelector);

            if (possibleTypes) {
                possibleTypes.forEach(nodeType => {
                    if (!this.selectorsByNodeType.has(nodeType)) {
                        this.selectorsByNodeType.set(nodeType, []);
                    }
                    this.selectorsByNodeType.get(nodeType).push(parsedSelector);
                });
            } else {
                this.anyTypeSelectors.push(parsedSelector);
            }
        });
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

        const selectorsToAttempt = this.anyTypeSelectors.concat(this.selectorsByNodeType.get(node.type) || []);

        selectorsToAttempt
            .filter(selector => esquery.matches(node, selector, this.currentAncestry))
            .forEach(selector => {
                if (this.parsedQueryMap.get(selector).endsWith(":exit")) {
                    if (!scheduledExitMatches.has(node)) {
                        scheduledExitMatches.set(node, []);
                    }
                    scheduledExitMatches.get(node).push(selector);
                } else {
                    this.emitter.emit(this.parsedQueryMap.get(selector), node);
                }
            });
    }

    /**
     * Emits an event of leaving AST node.
     * @param {ASTNode} node - A node which was left.
     * @returns {void}
     */
    leaveNode(node) {
        this.currentAncestry.shift();
        this.emitter.emit(`${node.type}:exit`, node);

        if (scheduledExitMatches.has(node)) {
            scheduledExitMatches.get(node).forEach(selector => this.emitter.emit(selector, node));
        }
    }
}

module.exports = NodeEventGenerator;
