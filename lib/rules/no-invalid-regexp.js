/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function isString(node) {
        return node && node.type === "Literal" && typeof node.value === "string";
    }

    function check(node) {
        if (node.callee.type === "Identifier" && node.callee.name === "RegExp" && isString(node.arguments[0])) {
            try {
                if (isString(node.arguments[1])) {
                    void new RegExp(node.arguments[0].value, node.arguments[1].value);
                } else {
                    void new RegExp(node.arguments[0].value);
                }
            } catch(e) {
                context.report(node, e.message);
            }
        }
    }

    return {
        "CallExpression": check,
        "NewExpression": check
    };

};
