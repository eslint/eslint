/**
 * @fileoverview Rule to flag unnecessary strict directives.
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "Literal": function(node) {
            if (node.value === "use strict") {
                var scope = context.getScope();

                if (scope.upper && scope.upper.isStrict) {
                    context.report(node, "Unnecessary 'use strict'.");
                }
            }
        }

    };

};
