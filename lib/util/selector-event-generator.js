/**
 * @fileoverview The event generator for AST nodes.
 * @author Ilya Volodin
 * @copyright 2015 Ilya Volodin. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

var selectorParser = require("./selector-parser");

//------------------------------------------------------------------------------
// Private helpers
//------------------------------------------------------------------------------

/**
 * Compares selector part with current node and returns true if node matches
 * @param {Object} selector - Selector Part
 * @param {Object} node - Current node
 * @returns {bool} flag to indicate that node matches selector part
 */
function compareSelectorPart(selector, node) {
    if (selector.type && selector.type !== node.type) {
        return false;
    }
    if (selector.attributes) {
        for (var i = 0, l = selector.attributes.length; i < l; i++) {
            var attribute = selector.attributes[i];
            var branch = node;
            for (var j = 0, len = attribute.query.length; j < len; j++) {
                if (branch) {
                    branch = branch[attribute.query[j]];
                } else {
                    return false;
                }
            }
            if (branch !== attribute.value) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Compares selector with current node and returns true if node matches
 * @param {Object[]} selector - Selector
 * @param {Object} node - Current node
 * @returns {bool} flag to indicate that node matches selector
 */
function compareSelector(selector, node) {
    var currentNode = node,
        clonedSelector = selector.slice(),
        selectorPart = clonedSelector.pop(),
        match = compareSelectorPart(selectorPart, currentNode);
    if (!match) {
        return false;
    }
    while (selectorPart && currentNode.type !== "Program") {
        match = compareSelectorPart(selectorPart, currentNode);
        if (match) {
            selectorPart = clonedSelector.pop();
        } else {
            currentNode = currentNode.parent;
        }
    }
    return match;
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The event generator for AST node selectors.
 * This implements below interface.
 *
 * ```ts
 * interface EventGenerator {
 *     emitter: EventEmitter;
 *     enterNode(node: ASTNode): void;
 *     leaveNode(node: ASTNode): void;
 * }
 * ```
 *
 * @param {EventEmitter} eventGenerator - An event emitter which is the destination of events.
 * @returns {NodeEventGenerator} new instance.
 */
function SelectorEventGenerator(eventGenerator) {
    this.original = eventGenerator;
    this.selectors = null;
    this.emitter = eventGenerator.emitter;
}

SelectorEventGenerator.prototype = {
    constructor: SelectorEventGenerator,

    /**
     * Emits an event of entering AST node.
     * @param {ASTNode} node - A node which was entered.
     * @returns {void}
     */
    enterNode: function enterNode(node) {
        if (!this.selectors) {
            this.selectors = [];
            // poplulate all of the selectors on the first node
            Object.keys(this.emitter._events).filter(function(item) { // eslint-disable-line no-underscore-dangle
                return item.match(/[^a-zA-Z:]/) !== null; // filter out simple nodes and code path analysis events
            }).forEach(function(selector) {
                var parsedSelector = selectorParser.parse(selector);
                if (parsedSelector) {
                    this.selectors = this.selectors.concat(parsedSelector);
                }
            }, this);
        }
        this.selectors.forEach(function(selector) {
            if (compareSelector(selector.selectors, node)) {
                this.emitter.emit(selector.event, node);
            }
        }, this);
        this.original.enterNode(node);
    },
    leaveNode: function leaveNode(node) {
        this.original.leaveNode(node);
    }
};

module.exports = SelectorEventGenerator;
