/**
 * @fileoverview Disallow shadowing of NaN, undefined, and Infinity (ES5 section 15.1.1)
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var RESTRICTED = ["undefined", "NaN", "Infinity", "arguments", "eval"];

    function checkForViolation(id) {
        if(RESTRICTED.indexOf(id.name) > -1) {
            context.report(id, "Shadowing of global property \"" + id.name + "\".");
        }
    }

    return {
        "VariableDeclarator": function(node) {
            checkForViolation(node.id);
        },
        "FunctionExpression": function(node) {
            if(node.id) { checkForViolation(node.id); }
            [].map.call(node.params, checkForViolation);
        },
        "FunctionDeclaration": function(node) {
            checkForViolation(node.id);
            [].map.call(node.params, checkForViolation);
        },
        "CatchClause": function(node) {
            checkForViolation(node.param);
        }
    };

};
