/**
 * @fileoverview Rule to check for block scoped variables
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";
    var stack = [{}]; // Start with the global block

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------
    function pushBlock() {
        stack.push({});
    }

    function popBlock() {
        if (!hasAllowedAncestorsForPop(context.getAncestors())) {
            stack.pop();
        }
    }

    function hasAllowedAncestorsForCheck(ancestors) {
        var grandparent = ancestors[ancestors.length-1],
            belongsToFunction = grandparent.type === "FunctionDeclaration",
            belongsToCatchClause = grandparent.type === "CatchClause";

        return belongsToFunction || belongsToCatchClause;
    }

    function hasAllowedAncestorsForPop(ancestors) {
        var grandparent = ancestors[ancestors.length-1],
            belongsToTryBlock = grandparent.type === "TryStatement";

        return belongsToTryBlock;
    }

    function addVariableDeclaration(node) {
        var topObject = stack.pop(),
            i,
            len,
            declarations = node.declarations;

        for (i = 0, len = declarations.length; i < len; i++) {
            topObject[declarations[i].id.name] = 1;
        }

        stack.push(topObject);
    }

    function addFunctionDeclaration(node) {
        var topObject = stack.pop();

        topObject[node.id.name] = 1;

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

            context.report(node, node.name + " used out of scope.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "BlockStatement": pushBlock,
        "BlockStatement:after": popBlock,
        "VariableDeclaration": addVariableDeclaration,
        "FunctionDeclaration": addFunctionDeclaration,
        "Identifier": checkStackForIdentifier,
    };

};
