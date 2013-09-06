/**
 * @fileoverview Rule to flag possible variable leaks in variable declarations
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "VariableDeclarator": function(node) {
            if (node.init && node.init.type === "AssignmentExpression" && node.init.left.type === "Identifier") {
                context.report(node.init,
                        "You might be leaking a variable ({{name}}) here.", { name: node.init.left.name });
            }
        }
    };

};
