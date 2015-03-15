/**
 * @fileoverview Rule to check empty newline after "var" statement
 * @author Gopal Venkatesan <http://g13n.me>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var mode = context.options[0],
        validator;              // regex to validate the rule

    if (mode === "always") {
        validator = /\S(?:\r?\n){2,}\S?/;
    } else if (mode === "never") {
        validator = /\S(?:\r?\n)?\S/;
    }

    return {
        "VariableDeclaration:exit": function(node) {
            var lastToken = context.getLastToken(node),
                nextToken = context.getTokenAfter(node),
                // peek few characters beyond the last token (typically the semi-colon)
                sourceLines = context.getSource(lastToken, 0, 3);

            // Some coding styles like Google uses multiple `var` statements.
            // So if the next token is a `var` statement don't do anything.
            if (nextToken && nextToken.type === "Keyword" && nextToken.value === "var") {
                return;
            }

            // Next statement is not a `var`
            if (sourceLines && !sourceLines.match(validator)) {
                context.report(node, "Newline is " + mode + " expected after a \"var\" statement.",
                               { identifier: node.name });
            }
        }
    };
};
