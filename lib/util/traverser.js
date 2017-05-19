/**
 * @fileoverview Wrapper around estraverse
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const estraverse = require("estraverse");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const KEY_BLACKLIST = new Set([
    "parent",
    "leadingComments",
    "trailingComments"
]);

/**
 * Modify estraverse's visitor keys to traverse type annotations.
 */
estraverse.VisitorKeys.Identifier.push("typeAnnotation");
estraverse.VisitorKeys.FunctionDeclaration.push("returnType");
estraverse.VisitorKeys.FunctionExpression.push("returnType");
estraverse.VisitorKeys.ArrowFunctionExpression.push("returnType");
estraverse.VisitorKeys.MethodDefinition.push("returnType");
estraverse.VisitorKeys.ObjectPattern.push("typeAnnotation");
estraverse.VisitorKeys.ArrayPattern.push("typeAnnotation");
estraverse.VisitorKeys.RestElement.push("typeAnnotation");

/**
 * Wrapper around an estraverse controller that ensures the correct keys
 * are visited.
 * @constructor
 */
class Traverser extends estraverse.Controller {
    constructor(visitorKeys, visitorFallback) {
        super();

        this.visitorKeys = visitorKeys || estraverse.VisitorKeys;
        this.visitorFallback = visitorFallback || Traverser.getKeys;
    }

    traverse(node, visitor) {
        visitor.keys = this.visitorKeys;
        visitor.fallback = this.visitorFallback;
        return super.traverse(node, visitor);
    }

    getVisitorKeys() {
        return this.visitorKeys;
    }

    getVisitorFallback() {
        return this.visitorFallback;
    }

    /**
     * Calculates the keys to use for traversal.
     * @param {ASTNode} node The node to read keys from.
     * @returns {string[]} An array of keys to visit on the node.
     * @private
     */
    static getKeys(node) {
        return Object.keys(node).filter(key => !KEY_BLACKLIST.has(key));
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = Traverser;
