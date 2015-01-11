/**
 * @fileoverview Rule to check for the position of the * in your generator functions
 * @author Jamund Ferguson
 * @copyright 2014 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var position = context.options[0] || "end";

    /**
     * Check the position of the start compared to the expected position.
     * @param {Object} node - the entire function node
     * @param {Object} starToken - the star token
     * @returns {void}
     */
    function checkStarPosition(node, starToken) {

        if (!node.generator) {
            return;
        }

        // check for function *name() {}
        if (position === "end") {

            // * starts where the next identifier begins
            if (starToken.range[1] !== context.getTokenAfter(starToken).range[0]) {
                context.report(node, "Expected a space before *.");
            }
        }

        // check for function* name() {}
        if (position === "start") {

            // * ends where the previous identifier ends
            if (starToken.range[0] !== context.getTokenBefore(starToken).range[1]) {
                context.report(node, "Expected no space before *.");
            }
        }
    }

    return {

        "FunctionDeclaration": function (node) {
            var starToken = context.getTokenBefore(node.id);
            checkStarPosition(node, starToken);
        },

        "FunctionExpression": function (node) {

            // count back an extra token if you have a named anonymous function
            var starToken = context.getTokenBefore(node.body, node.id ? 3 : 2);
            checkStarPosition(node, starToken);
        }
    };

};
