/**
 * @fileoverview Require spaces following unary word operators
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function check(node) {
        var tokens;
        tokens = context.getFirstTokens(node, 2);
        if(tokens[0].range[1] >= tokens[1].range[0]) {
            switch(tokens[0].value) {
                case "delete":
                case "new":
                case "typeof":
                case "void":
                    context.report(node, "Unary word operator \"" + tokens[0].value + "\" must be followed by whitespace.");
                    break;
            }
        }
    }

    return {
        "NewExpression": check,
        "UnaryExpression": check
    };

};
