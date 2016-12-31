/**
 * @fileoverview The event generator for AST nodes.
 * @author Toru Nagashima
 */

"use strict";

const esquery = require("esquery");

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
    * @param {string[]} selectors A list of query selector strings to detect and emit
    * @returns {NodeEventGenerator} new instance
    */
    constructor(emitter, selectors) {
        this.emitter = emitter;
        this.currentAncestry = [];
        this.parsedQueryMap = (selectors || [])

            // Filter out selectors that only contain a node name, and treat them as a special case.
            // Although these selectors are valid, it's not necessary to check all of them on every node, because it's
            // always safe to just emit a node's type while entering it.
            .filter(query => !/^\w+(:exit)?$/.test(query))
            .reduce((parsedQueryMap, selector) => parsedQueryMap.set(selector, esquery.parse(selector)), new Map());
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

        this.parsedQueryMap.forEach((parsedQuery, rawQuery) => {
            if (esquery.matches(node, parsedQuery, this.currentAncestry)) {
                this.emitter.emit(rawQuery, node);
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
    }
}

module.exports = NodeEventGenerator;
