/**
 * @fileoverview Test rule to flag invalid schemas
 * @author Brandon Mills
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    var config = context.options[0];

    return {
        "Program": function(node) {
            if (config) {
                context.report(node, "Expected nothing.");
            }
        }
    };
};

module.exports.schema = [
    {
        "enum": []
    }
];
