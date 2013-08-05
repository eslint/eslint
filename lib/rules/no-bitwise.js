/**
 * @fileoverview Rule to flag bitwise identifiers
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function report(node) {
        context.report(node, "Unexpected use of '{{operator}}'.", { operator: node.operator });
    }

    return {
        "BinaryExpression": function(node) {

            // warn for ^ | & ~ << >> >>>
            if (node.operator.match(/^(?:[\^&\|~]|<<|>>>?)$/)) {
                report(node);
            }

        },

        "UnaryExpression": function(node) {

            // warn for ~
            if (node.operator === "~") {
                report(node);
            }

        }
    };

};
