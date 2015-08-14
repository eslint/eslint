/**
 * @fileoverview Rule to disallow a duplicate case label.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Strips source code position informations from the node
     * @param {ASTNode} node The node.
     * @returns {ASTNode} a copy of the node with the position stripped away
     * @private
     */
    function stripsPosition(node) {
        var result = {};
        for (var prop in node) {
            if (!~["loc", "start", "end", "range"].indexOf(prop)) {
                result[prop] = node[prop];
                if (typeof result[prop] === "object") {
                    result[prop] = stripsPosition(result[prop]);
                }
            }
        }
        return result;
    }
    /**
     * Get a hash value for the node
     * @param {ASTNode} node The node.
     * @returns {string} A hash value for the node.
     * @private
     */
    function getHash(node) {
        return JSON.stringify(stripsPosition(node));
    }

    var switchStatement = [];

    return {

        "SwitchStatement": function(/* node */) {
            switchStatement.push({});
        },

        "SwitchStatement:exit": function(/* node */) {
            switchStatement.pop();
        },

        "SwitchCase": function(node) {
            var currentSwitch = switchStatement[switchStatement.length - 1],
                hashValue;

            if (node.test) {
                hashValue = getHash(node.test);
                if (typeof hashValue !== "undefined" && currentSwitch.hasOwnProperty(hashValue)) {
                    context.report(node, "Duplicate case label.");
                } else {
                    currentSwitch[hashValue] = true;
                }
            }
        }

    };

};

module.exports.schema = [];
