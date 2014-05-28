/**
 * @fileoverview Rule to flag use of constructors without capital letters
 * @author Nicholas C. Zakas
 */

 var CAPS_ALLOWED = [
     "Number",
     "String",
     "Boolean",
     "Date",
     "Array",
     "Symbol",
     "RegExp"
 ];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var config = context.options[0] || {};
    config.newIsCap = config.newIsCap === false ? false : true;
    config.capIsNew = config.capIsNew === false ? false : true;

    var listeners = {};

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Get exact callee name from expression
     * @param {ASTNode} node CallExpression or NewExpression node
     * @returns {String} name
     */
    function extractNameFromExpression(node) {

        var name = "";

        if (node.callee.type === "MemberExpression") {
            if (node.callee.property.type === "Literal") {
                name = node.callee.property.value;
            } else if (node.callee.property.type === "Identifier" && !node.callee.computed) {
                name = node.callee.property.name;
            }
        } else {
            name = node.callee.name;
        }
        return name;
    }

    /**
     * Check if first letter of string can be upper-case
     * @param {String} str String
     * @returns {Boolean} Can be upper-case
     */
    function canCap(str) {
        var firstChar = str.charAt(0);
        return firstChar.toLowerCase() !== firstChar.toUpperCase();
    }

    /**
     * Check if first letter of string is upper-case
     * @param {String} str String
     * @returns {Boolean} Is upper-case
     */
    function isCap(str) {
        var firstChar = str.charAt(0);
        return firstChar === firstChar.toUpperCase();
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    if (config.newIsCap) {
        listeners.NewExpression = function(node) {

            var constructorName = extractNameFromExpression(node);
            if (constructorName && canCap(constructorName) && !isCap(constructorName)) {
                context.report(node, "A constructor name should start with an uppercase letter.");
            }
        };
    }

    if (config.capIsNew) {
        listeners.CallExpression = function(node) {

            var calleeName = extractNameFromExpression(node);
            if (calleeName && canCap(calleeName) && CAPS_ALLOWED.indexOf(calleeName) < 0 && isCap(calleeName)) {
                context.report(node, "Function with uppercase-started name should be used as a constructor only.");
            }
        };
    }

    return listeners;
};
