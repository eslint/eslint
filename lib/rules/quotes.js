/**
 * @fileoverview A rule to choose between single and double quote marks
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var DOUBLE_QUOTES = "double",
    SINGLE_QUOTES = "single";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    /**
     * Validate that a string passed in is surrounded by double quotes
     * @param  {string} val
     * @return {bool}
     */
    function validDoubleQuotes(val) {
        return val[0] === "\"" && val[val.length-1] === "\"";
    }

    /**
     * Validate that a string passed in is surrounded by single quotes
     * @param  {string} val
     * @return {bool}
     */
    function validSingleQuotes(val) {
        return val[0] === "'" && val[val.length-1] === "'";
    }

    return {

        "Literal": function(node) {
            var val = node.value,
                rawVal = node.raw,
                quoteOptions = context.options[0];

            if (typeof val === "string") {

                switch (quoteOptions) {
                case DOUBLE_QUOTES:
                    if (!validDoubleQuotes(rawVal)) {
                        context.report(node, "Use double quotes for string literals.");
                    }
                    break;
                case SINGLE_QUOTES:
                    if (!validSingleQuotes(rawVal)) {
                        context.report(node, "Use single quotes for string literals.");
                    }
                    break;

                // no default
                }
            }
        }
    };

};
