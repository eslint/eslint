/**
 * @fileoverview Rule to block usage of for-in statements
 * @author John Ford
 * @copyright 2015 John Ford
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "ForInStatement": function(node) {
            context.report(node, "The for-in statement should not be used");
        }

    };

};

module.exports.schema = [];
