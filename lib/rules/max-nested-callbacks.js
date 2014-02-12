/**
 * @fileoverview Rule to enforce a maximum number of nested callbacks.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    //--------------------------------------------------------------------------
    // Constants
    //--------------------------------------------------------------------------

    var THRESHOLD = context.options[0];

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    var callbackStack = [];

    return {

        "FunctionExpression": function (node) {
            var parent = context.getAncestors().pop();

            if (parent.type === "CallExpression") {
                callbackStack.push(node);
            }

            if (callbackStack.length > THRESHOLD) {
                var opts = {num: callbackStack.length, max: THRESHOLD};
                context.report(node, "Too many nested callbacks ({{num}}). Maximum allowed is {{max}}.", opts);
            }
        },


        "FunctionExpression:exit": function() {
            callbackStack.pop();
        }

    };

};
