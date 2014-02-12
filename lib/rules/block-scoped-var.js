/**
 * @fileoverview Rule to check for "block scoped" variables by binding context
 * @author Matt DuVall <http://www.mattduvall.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var stack = [{}]; // Start with the global block

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------
    function pushBlock() {
        stack.push({});
    }

    function popBlock() {
        stack.pop();
    }

    function hasAllowedAncestorsForCheck(ancestors) {
        var grandparent = ancestors[ancestors.length - 1],
            belongsToFunction = grandparent.type === "FunctionDeclaration";

        return belongsToFunction;
    }

    function addCommonDeclaration(node) {
        var type = node.type,
            topObject = stack.pop(),
            i,
            len,
            declarations;

        switch (type) {
        case "VariableDeclaration":
            declarations = node.declarations;
            for (i = 0, len = declarations.length; i < len; i++) {
                topObject[declarations[i].id.name] = 1;
            }
            break;

        case "FunctionDeclaration":
            declarations = node.params;
            topObject[node.id.name] = 1;
            for (i = 0, len = declarations.length; i < len; i++) {
                topObject[declarations[i].name] = 1;
            }
            break;

        case "CatchClause":
            declarations = [];
            topObject[node.param.name] = 1;

        // no default
        }

        stack.push(topObject);
    }

    function checkStackForIdentifier(node) {
        var i,
            len,
            ancestors = context.getAncestors();

        if (!hasAllowedAncestorsForCheck(ancestors)) {
            for (i = 0, len = stack.length; i < len; i++) {
                if (stack[i][node.name]) {
                    return;
                }
            }

            context.report(node, node.name + " used outside of binding context.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "BlockStatement": pushBlock,
        "BlockStatement:exit": popBlock,
        "CatchClause": addCommonDeclaration,
        "VariableDeclaration": addCommonDeclaration,
        "FunctionDeclaration": addCommonDeclaration,
        "Identifier": checkStackForIdentifier
    };

};
