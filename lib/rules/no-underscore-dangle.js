/**
 * @fileoverview Rule to flag trailing underscores in variable declarations.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    //-------------------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------------------

    function hasTrailingUnderscore(identifier) {
        var len = identifier.length;

        return identifier[0] === "_" || identifier[len-1] === "_";
    }

    function isSpecialCaseIdentifier(identifier) {
        return identifier === "__proto__";
    }

    function checkForTrailingUnderscore(node) {
        var identifier = node.id.name;

        if (typeof identifier !== "undefined" && hasTrailingUnderscore(identifier)) {
            context.report(node, "Unexpected dangling '_' in '" + identifier + "'.");
        }
    }

    function checkForTrailingUnderscoreInMemberExpression(node) {
        var identifier = node.property.name;

        if (typeof identifier !== "undefined" && hasTrailingUnderscore(identifier) &&
            !isSpecialCaseIdentifier(identifier)) {
            context.report(node, "Unexpected dangling '_' in '" + identifier + "'.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkForTrailingUnderscore,
        "VariableDeclarator": checkForTrailingUnderscore,
        "MemberExpression": checkForTrailingUnderscoreInMemberExpression
    };

};
