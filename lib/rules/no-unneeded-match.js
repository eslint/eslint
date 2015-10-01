/**
 * @fileoverview Rule to spot scenarios where `String.prototype.match` is used where only `RegExp.prototype.test` is needed.
 * @author Dany Shaanan
 * @copyright 2015 Dany Shaanan
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

    /**
     * Reports on node if Check to see if a CallExpression node is a match call on a regex
     * @param {ASTNode} node The node to report on.
     * @param {Boolean} bool A boolean which indicates if to report or not.
     * @returns {void}
     * @private
     */
    function reportOn(node, bool) {
        if (bool) {
            context.report(node, "Use `Regex.test() instead`");
        }
    }

    /**
     * Check to see if a CallExpression node is a match call on a regex
     * @param {ASTNode} node The node to check.
     * @returns {Boolean} result
     * @private
     */
    function isNodeMatchCall(node) {
        return node &&
            node.callee &&
            node.callee.type === "MemberExpression" &&
            node.callee.computed === false &&
            node.callee.property &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "match" &&
            node.arguments &&
            node.arguments.length === 1 &&
            node.arguments[0].type === "Literal" &&
            node.arguments[0].regex;
    }

    /**
     * Reports on node if it has a `test` that is a match call on a regex
     * @param {ASTNode} node The node to report on.
     * @returns {void}
     * @private
     */
    function checkTestNode(node) {
        try {
            reportOn(node, node.test && node.test.type === "CallExpression" && isNodeMatchCall(node.test));
        } catch (e) {
            /* istanbul ignore next */
            context.report(node, e.toString() + " " + e.stack);
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------
    return {
        IfStatement: checkTestNode,
        WhileStatement: checkTestNode,
        ForStatement: checkTestNode,
        ConditionalExpression: checkTestNode,
        UnaryExpression: function(node) {
            try {
                reportOn(node, node.operator === "!" && isNodeMatchCall(node.argument));
            } catch (e) {
                /* istanbul ignore next */
                context.report(node, e.toString() + " " + e.stack);
            }
        },
        CallExpression: function(node) {
            try {
                reportOn(node,
                    node.callee &&
                    node.callee.type === "Identifier" &&
                    node.callee.name === "Boolean" &&
                    node.arguments &&
                    node.arguments.length &&
                    isNodeMatchCall(node.arguments[0])
                );
            } catch (e) {
                /* istanbul ignore next */
                context.report(node, e.toString() + " " + e.stack);
            }
        }
    };
};

module.exports.schema = [];
