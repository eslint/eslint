/**
 * @fileoverview Rule to flag unescaped assignments to innerHTML
 * @author Frederik Braun, April King
 * @copyright 2015 Mozilla Corporation. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

    // valid operators to match against, such as X.innerHTML += foo
    var OPERATORS = ["=", "+="];

    // names of escaping functions that we acknowledge
    var VALID_ESCAPERS = ["Tagged.escapeHTML", "escapeHTML"];

    function allowedExpression(expression, parent) {
        /*
         expression = { right-hand side of innerHTML or 2nd param to insertAdjacentHTML
         parent is the parent node of the call or assignment. used to look into comments.

        */
        var allowed;
        /* check the stringish-part, which is either the right-hand-side of
         an inner/outerHTML assignment or the 2nd parameter to insertAdjacentTML
         */

        /*  surely, someone could have an evil literal in there, but that"s malice
         we can just check for unsafe coding practice, not outright malice
         example literal "<script>eval(location.hash.slice(1)</script>"
         (it"s the task of the tagger-function to be the gateway here.)
         */
        if (expression.type === "Literal") {
            // we just assign a literal (e.g. a string, a number, a bool)
            allowed = true;
        } else if (expression.type === "TemplateLiteral") {
            // check for ${..} expressions
            if (expression.expressions.length === 0) {
                allowed = true;
            } else {
                allowed = false;
            } // else: contains expressions, but no tagged function? not cool.
        } else if (expression.type === "TaggedTemplateExpression") {
            // context.getSource(expression.tag) is the function name
            if (VALID_ESCAPERS.indexOf(context.getSource(expression.tag)) !== -1) {
                allowed = true;
            } else {
                allowed = false;
            }
        } else {
            // everything that doesn't match is unsafe:
            allowed = false;
        }
        if (allowed === false) {
            // Check for comment that link to approval in bugzilla:
            var comments = context.getComments(parent).trailing;
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i];
                /* looking for comment directly after the semicolon
                   (same or next line), that matches /bug \d{7,}/.
                 */
                if (comment.value.match(/a=.*, bug \d{7,}/)) {
                    allowed = true;
                }
            }
        }
        return allowed;
    }

    return {
        "AssignmentExpression:exit": function (node) {
            // called when an identifier is found in the tree.
            // the "exit" prefix ensures we know all subnodes already.
            if ("property" in node.left) {
                if (OPERATORS.indexOf(node.operator) !== -1) {
                    if (node.left.property.name === ("innerHTML" || "outerHTML")) {
                        if (!allowedExpression(node.right, node.parent)) {
                            context.report(node, "Unsafe assignment to innerHTML"); // report error
                        }
                    }
                }
            }
        },

        CallExpression: function (node) {
            // this is for insertAdjacentHTML(position, markup)
            if ("property" in node.callee) {
                if (node.callee.property.name === "insertAdjacentHTML") {
                    if (!allowedExpression(node.arguments[1], node.parent)) {
                        context.report(node, "Unsafe call to insertAdjacentHTML"); // report error
                    }
                }
            }
        }
    };

};
