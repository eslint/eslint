/**
 * @fileoverview Rule to flag fall-through cases in switch statements.
 * @author Matt DuVall <http://mattduvall.com/>
 */
"use strict";


var FALLTHROUGH_COMMENT = /falls\sthrough/;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var switches = [];

    return {

        "SwitchCase": function(node) {

            var consequent = node.consequent,
                finalConsequentStatement = consequent[consequent.length - 1],
                switchData = switches[switches.length - 1],
                comments,
                comment;

            // checking on previous case
            if (!switchData.lastCaseClosed) {

                // a fall through comment will be a leading comment of the following case
                comments = context.getComments(node).leading;
                comment = comments[comments.length - 1];

                // check for comment
                if (!comment || !FALLTHROUGH_COMMENT.test(comment.value)) {
                    context.report(switchData.lastCase,
                        "Expected a \"break\" statement before \"{{code}}\".",
                        { code: node.test ? "case" : "default" });
                }
            }

            // now dealing with the current case
            switchData.lastCaseClosed = false;
            switchData.lastCase = node;

            // try to verify using statements
            if (!finalConsequentStatement || /(?:Break|Return|Throw)Statement/.test(finalConsequentStatement.type)) {
                switchData.lastCaseClosed = true;
            }

            /*
             * Any warnings are triggered when the next SwitchCase occurs.
             * There is no need to warn on the last SwitchCase, since it can't
             * fall through to anything.
             */
        },

        "SwitchStatement": function(node) {
            switches.push({
                node: node,
                lastCaseClosed: true,
                lastCase: null
            });
        },

        "SwitchStatement:after": function() {
            switches.pop();
        }
    };

};
