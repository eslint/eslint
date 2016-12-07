/**
 * @fileoverview disallow boolean traps
 * @author Morgan Roderick
 */
"use strict";

/**
 * Determines if the argument is a literal boolean, or an Array containing a literal boolean
 * @param  {Object}  argument [description]
 * @returns {boolean}          `true` is a literal boolean value, or an array containing a literal boolean value
 */
function isBooleanArgument(argument) {

    // when used with Function.prototype.apply
    if (argument.type === "ArrayExpression") {
        return argument.elements.some(isBooleanArgument);
    }

    return argument.type === "Literal" && typeof argument.value === "boolean";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow boolean traps",
            category: "Best Practices",
            recommended: false
        },
        schema: []
    },

    create(context) {
        return {
            CallExpression: node => {
                const badArguments = node.arguments.filter(isBooleanArgument);

                badArguments.forEach(argument => {
                    context.report({
                        node,
                        loc: argument.loc,
                        message: "Unexpected boolean trap"
                    });
                });
            }
        };
    }
};
