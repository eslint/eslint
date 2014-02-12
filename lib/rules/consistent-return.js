/**
 * @fileoverview Rule to flag consistent return values
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var functions = [];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function enterFunction() {
        functions.push({});
    }

    function exitFunction() {
        functions.pop();
    }


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "FunctionDeclaration": enterFunction,
        "FunctionExpression": enterFunction,
        "FunctionDeclaration:exit": exitFunction,
        "FunctionExpression:exit": exitFunction,

        "ReturnStatement": function(node) {

            var returnInfo = functions[functions.length - 1],
                returnTypeDefined = "type" in returnInfo;

            if (returnTypeDefined) {

                if (returnInfo.type !== !!node.argument) {
                    context.report(node, "Expected " + (returnInfo.type ? "a" : "no") + " return value.");
                }

            } else {
                returnInfo.type = !!node.argument;
            }

        }
    };

};
