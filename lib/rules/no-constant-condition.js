/**
 * @fileoverview Rule to flag use constant conditions
 * @author Christian
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    // array of types that should always trigger this rule if used inside a condition
    var alwaysSimpleConstantCondition = ["Literal", "FunctionExpression", "ObjectExpression", "ArrayExpression"],
        // map of functions that should be called to determine if it is a constant condition
        sometimesSimpleConstantCondition = {
            /**
             * Checks assignment expression for literal argument.
             * @example returns true for: if (t = 2) { doSomething() }
             * @param {ASTNode} field The AST node to check.
             * @returns {Boolean} true if assignment has right side literal or identifier.
             */
            "AssignmentExpression": function(field) {
                return (field.right.type === "Literal" || field.right.type === "Identifier");
            },
            /**
             * Checks unary expression for literal argument.
             * @example returns true for: if (+2) { doSomething(); }
             * @param {ASTNode} field The AST node to check.
             * @returns {Boolean} true if field has literal argument type.
             */
            "UnaryExpression": function(field) {
                return (field.argument.type === "Literal");
            }
        };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Creates a function that checks if a node contains a constant condition on a specified field.
     * @param {String} where Field that needs to be checked.
     * @returns {Function} Function that checks if a node contains a constant condition.
     * @private
     */
    function checkConstantCondition(where) {
        return function(node){
            var field = node[where];
            // check if type exists in simpleConditions array
            if (alwaysSimpleConstantCondition.indexOf(field.type) !== -1 ||
                // check if type exists in sometimes simple conditions
                (sometimesSimpleConstantCondition.hasOwnProperty(field.type) &&
                    // check if type is a simple condition
                    sometimesSimpleConstantCondition[field.type](field))) {

                context.report(node, "Unexpected constant condition.");
            }
        };
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "ConditionalExpression": checkConstantCondition("test"),
        "IfStatement": checkConstantCondition("test"),
        "WhileStatement": checkConstantCondition("test"),
        "SwitchStatement": checkConstantCondition("discriminant")
    };

};
