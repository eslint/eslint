/**
 * @fileoverview A rule to choose between single and double quote marks
 * @author Matt DuVall <http://www.mattduvall.com/>, Brandon Payton
 */

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var QUOTE_SETTINGS = {
    "double": {
        quote: "\"",
        alternateQuote: "'",
        description: "doublequote"
    },
    "single": {
        quote: "'",
        alternateQuote: "\"",
        description: "singlequote"
    }
};

var AVOID_ESCAPE = "avoid-escape";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    /**
     * Validate that a string passed in is surrounded by the specified character
     * @param  {string} val
     * @param  {string} character
     * @return {bool}
     */
    function surroundedBy(val, character) {
        return val[0] === character && val[val.length - 1] === character;
    }

    return {

        "Literal": function(node) {
            var val = node.value,
                rawVal = node.raw,
                quoteOption = context.options[0],
                settings = QUOTE_SETTINGS[quoteOption],
                avoidEscape = context.options[1] === AVOID_ESCAPE,
                isValid;

            if (settings && typeof val === "string") {
                isValid = surroundedBy(rawVal, settings.quote);

                if (!isValid && avoidEscape) {
                    isValid = surroundedBy(rawVal, settings.alternateQuote) && rawVal.indexOf(settings.quote) >= 0;
                }

                if (!isValid){
                    context.report(node, "Strings must use " + settings.description + ".");
                }
            }
        }
    };

};
