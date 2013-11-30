/**
 * @fileoverview Require spaces following unary word operators and keywords that precede expressions
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function check(node) {
        var tokens;
        tokens = context.getTokens(node);
        if(tokens[0].range[1] >= tokens[1].range[0]) {
            switch(tokens[0].value) {
                case "delete":
                case "new":
                case "typeof":
                case "void":
                    context.report(node, "Unary word operator \"" + tokens[0].value + "\" must be followed by whitespace.");
                    break;
                case "case":
                case "return":
                case "throw":
                    context.report(node, "Keyword \"" + tokens[0].value + "\" must be followed by whitespace.");
            }
        }
    }

    return {
        "NewExpression": check,
        "ReturnStatement": function(node) { if(node.argument) { check(node); } },
        "SwitchCase": check,
        "ThrowStatement": check,
        "UnaryExpression": check
    };

};
