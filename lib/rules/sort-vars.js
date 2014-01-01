/**
 * @fileoverview Rule to require sorting of variables within a single Variable Declaration block
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "VariableDeclaration": function(node) {
            node.declarations.reduce(function(memo, decl) {
                if(decl.id.name < memo.id.name) {
                    context.report(decl, "Variables within the same declaration block should be sorted alphabetically");
                    return memo;
                } else {
                    return decl;
                }
            }, node.declarations[0]);
        }
    };
};
