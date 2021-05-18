/**
 * @fileoverview Rule to remove var statement
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";


    var sourceCode = context.getSourceCode();

    return {

        "VariableDeclaration": function(node) {
            if (node.kind === "var") {
                context.report({
                    node: node,
                    loc: sourceCode.getFirstToken(node).loc,
                    message: "Bad var.",
                    fix: function(fixer) {
                        return fixer.remove(sourceCode.getFirstToken(node));
                    }
                })
            }
        }
    };

};
