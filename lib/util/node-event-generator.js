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
            const typesForComponents = selector.selectors.map(getPossibleTypes);

            if (typesForComponents.every(typesForComponent => typesForComponent)) {
                return lodash.union.apply(null, typesForComponents);
            }
            return null;
        }

        case "compound": {
            const typesForComponents = selector.selectors.map(getPossibleTypes).filter(typesForComponent => typesForComponent);

            // If all of the components could match any type, then the compound could also match any type.
            if (!typesForComponents.length) {
                return null;
            }

            /*
             * If at least one of the components could only match a particular type, the compound could only match
             * the intersection of those types.
             */
            return lodash.intersection.apply(null, typesForComponents);
        }

        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return getPossibleTypes(selector.right);

        default:
            return null;

    }
}

/**
 * Counts the number of class, pseudo-class, and attribute queries in this selector
 * @param {Object} selector A parsed selector object
 * @returns {number} The number of class, pseudo-class, and attribute queries in this selector
 */
function countClassAttributes(selector) {
    switch (selector.type) {
        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return countClassAttributes(selector.left) + countClassAttributes(selector.right);

        case "compound":
        case "not":
        case "matches":
            return selector.selectors.reduce((sum, childSelector) => sum + countClassAttributes(childSelector), 0);

        case "attribute":
        case "field":
        case "nth-child":
        case "nth-last-child":
            return 1;

        default:
            return 0;
    }
}

/**
 * Counts the number of identifier queries in this selector
 * @param {Object} selector A parsed selector object
 * @returns {number} The number of type queries
 */
function countIdentifiers(selector) {
    switch (selector.type) {
        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return countIdentifiers(selector.left) + countIdentifiers(selector.right);

        case "compound":
        case "not":
        case "matches":
            return selector.selectors.reduce((sum, childSelector) => sum + countIdentifiers(childSelector), 0);

        case "identifier":
            return 1;

        default:
            return 0;
    }
}

/**
 * Compares the specificity of two selector objects, with CSS-like rules.
 * @param {Object} selectorA An object describing a selector (like the return value of parseSelector)
 * @param {Object} selectorB An object describing a selector (like the return value of parseSelector)
 * @returns {number}
 * a value less than 0 if selectorA is less specific than selectorB
 * a value greater than 0 if selectorA is more specific than selectorB
 * a value less than 0 if selectorA and selectorB have the same specificity, and selectorA <= selectorB alphabetically
 * a value greater than 0 if selectorA and selectorB have the same specificity, and selectorA > selectorB alphabetically
 */
function compareSpecificity(selectorA, selectorB) {
    return selectorA.attributeCount - selectorB.attributeCount ||
        selectorA.identifierCount - selectorB.identifierCount ||
        (selectorA.rawSelector <= selectorB.rawSelector ? -1 : 1);
}

/**
 * Parses a raw selector string, and returns the parsed selector along with specificity and type information.
 * @param {string} rawSelector A raw AST selector
 * @returns {Object} Information about the selector with the following properties:
 * rawSelector (string): The original raw selector that was passed in
 * isExit (boolean): true if the selector should be called when exiting the given node, rather than entering
 * parsedSelector (object): A parsed AST selector object
 * listenerTypes (string[]|null): The types of nodes that this selector could possibly fire on, or null if it could fire on any type
 * attributeCount (number): The total number of classe, pseudo-classe, and attribute queries in this selector
 * identifierCount (number): The total number of identifier queries in this selector
 */
const parseSelector = lodash.memoize(rawSelector => {
    const parsedSelector = esquery.parse(rawSelector.replace(/:exit$/, ""));

    return {
        rawSelector,
        isExit: rawSelector.endsWith(":exit"),
        parsedSelector,
        listenerTypes: getPossibleTypes(parsedSelector),
        attributeCount: countClassAttributes(parsedSelector),
        identifierCount: countIdentifiers(parsedSelector)
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
        this.enterSelectorsByNodeType = new Map();
        this.exitSelectorsByNodeType = new Map();
        this.anyTypeEnterSelectors = [];
        this.anyTypeExitSelectors = [];

        queries.forEach(rawSelector => {
            const selector = parseSelector(rawSelector);

            if (selector.listenerTypes) {
                selector.listenerTypes.forEach(nodeType => {
                    const typeMap = selector.isExit ? this.exitSelectorsByNodeType : this.enterSelectorsByNodeType;

                    if (!typeMap.has(nodeType)) {
                        typeMap.set(nodeType, []);
                    }
                    typeMap.get(nodeType).push(selector);
                });
            } else {
                (selector.isExit ? this.anyTypeExitSelectors : this.anyTypeEnterSelectors).push(selector);
            }
        });

        this.anyTypeEnterSelectors.sort(compareSpecificity);
        this.anyTypeExitSelectors.sort(compareSpecificity);
        this.enterSelectorsByNodeType.forEach(selectorList => selectorList.sort(compareSpecificity));
        this.exitSelectorsByNodeType.forEach(selectorList => selectorList.sort(compareSpecificity));
    }

    /**
     * Checks a selector against a node, and emits it if it matches
     * @param {ASTNode} node The node to check
     * @param {Object} selector An object with selector info (from `parseSelector`)
     * @returns {void}
     */
    applySelector(node, selector) {
        if (esquery.matches(node, selector.parsedSelector, this.currentAncestry)) {
            this.emitter.emit(selector.rawSelector, node);
        }
    }

    /**
     * Applies all appropriate selectors to a node, in specificity order
     * @param {ASTNode} node The node to check
     * @param {boolean} isExit `false` if the node is currently being entered, `true` if it's currently being exited
     * @returns {void}
     */
    applySelectors(node, isExit) {
        const selectorsByNodeType = (isExit ? this.exitSelectorsByNodeType : this.enterSelectorsByNodeType).get(node.type) || [];
        const anyTypeSelectors = isExit ? this.anyTypeExitSelectors : this.anyTypeEnterSelectors;

        /*
         * selectorsByNodeType and anyTypeSelectors were already sorted by specificity in the constructor.
         * Iterate through each of them, applying selectors in the right order.
         */
        let selectorsByTypeIndex = 0;
        let anyTypeSelectorsIndex = 0;

        while (selectorsByTypeIndex < selectorsByNodeType.length || anyTypeSelectorsIndex < anyTypeSelectors.length) {
            if (
                selectorsByTypeIndex >= selectorsByNodeType.length ||
                anyTypeSelectorsIndex < anyTypeSelectors.length &&
                compareSpecificity(anyTypeSelectors[anyTypeSelectorsIndex], selectorsByNodeType[selectorsByTypeIndex]) < 0
            ) {
                this.applySelector(node, anyTypeSelectors[anyTypeSelectorsIndex++]);
            } else {
                this.applySelector(node, selectorsByNodeType[selectorsByTypeIndex++]);
            }
        }
    }

    /**
     * Emits an event of entering AST node.
     * @param {ASTNode} node - A node which was entered.
     * @returns {void}
     */
    enterNode(node) {
        if (node.parent) {
            this.currentAncestry.unshift(node.parent);
        }
        this.applySelectors(node, false);
    }

    /**
     * Emits an event of leaving AST node.
     * @param {ASTNode} node - A node which was left.
     * @returns {void}
     */
    leaveNode(node) {
        this.applySelectors(node, true);
        this.currentAncestry.shift();
    }
}

module.exports = NodeEventGenerator;
