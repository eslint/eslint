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
     * Get a hash value for the test
     * @param {ASTNode} test The "test" node.
     * @returns {string} A hash value for the test.
     * @private
     */
    function getHash(test) {
        if (test.type === "Literal") {
            return test.type + typeof test.value + test.value;
        } else if (test.type === "Identifier") {
            return test.type + typeof test.name + test.name;
        }
    }

    var switchStatement = [];

    return {

        "SwitchStatement": function(/*node*/) {
            switchStatement.push({});
        },

        "SwitchStatement:exit": function(/*node*/) {
            switchStatement.pop();
        },

        "SwitchCase": function(node) {
            var currentSwitch = switchStatement[switchStatement.length - 1],
                hashValue;

            if (node.test) {
                hashValue = getHash(node.test);
                if (currentSwitch.hasOwnProperty(hashValue)) {
                    context.report(node, "Duplicate case label.");
                } else {
                    currentSwitch[hashValue] = true;
                }
            }
        }

    };

};
