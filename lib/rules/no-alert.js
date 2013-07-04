/**
 * @fileoverview Rule to flag use of alert, confirm, prompt
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function matchProhibited(name) {
    return name.match(/^(alert|confirm|prompt)$/);
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "CallExpression": function(node) {

            var result;

            // without window.
            if (node.callee.type === "Identifier") {

                result = matchProhibited(node.callee.name);

                if (result) {
                    context.report(node, "Unexpected " + result[1] + ".");
                }

            } else if (node.callee.type === "MemberExpression") {

                result = matchProhibited(node.callee.property.name);

                if (result && node.callee.object.name === "window") {
                    context.report(node, "Unexpected " + result[1] + ".");
                }

            }

        }
    };

};
