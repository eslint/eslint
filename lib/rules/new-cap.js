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
     * Returns the capitalization state of the string -
     * Whether the first character is uppercase, lowercase, or non-alphabetic
     * @param {String} str String
     * @returns {String} capitalization state: "non-alpha", "lower", or "upper"
     */
    function getCap(str) {
        var firstChar = String(str).charAt(0);

        var firstCharLower = firstChar.toLowerCase();
        var firstCharUpper = firstChar.toUpperCase();

        if (firstCharLower === firstCharUpper) {
            // char has no uppercase variant, so it's non-alphabetic
            return "non-alpha";
        } else if (firstChar === firstCharLower) {
            return "lower";
        } else {
            return "upper";
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    if (config.newIsCap) {
        listeners.NewExpression = function(node) {

            var constructorName = extractNameFromExpression(node);
            if (constructorName && getCap(constructorName) === "lower") {
                context.report(node, "A constructor name should not start with a lowercase letter.");
            }
        };
    }

    if (config.capIsNew) {
        listeners.CallExpression = function(node) {

            var calleeName = extractNameFromExpression(node);
            if (calleeName && CAPS_ALLOWED.indexOf(calleeName) < 0 && getCap(calleeName) === "upper") {
                context.report(node, "A function with a name starting with an uppercase letter should only be used as a constructor.");
            }
        };
    }

    return listeners;
};
