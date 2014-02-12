/**
 * @fileoverview Rule to ensure code is running in strict mode.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var scopes = [];

    /**
     * When you enter a scope, push the strict value from the previous scope
     * onto the stack.
     * @returns {void}
     * @private
     */
    function enterScope() {
        scopes.push(scopes[scopes.length - 1] || false);
    }

    /**
     * When you exit a scope, pop off the top scope and see if it's true or
     * false.
     * @param {ASTNode} node The AST node being checked.
     * @returns {void}
     * @private
     */
    function exitScope(node) {
        var isStrict = scopes.pop();

        if (!isStrict && node.type !== "Program") {
            context.report(node, "Missing \"use strict\" statement.");
        }
    }

    return {

        "Program": enterScope,
        "FunctionDeclaration": enterScope,
        "FunctionExpression": enterScope,

        "Program:exit": exitScope,
        "FunctionDeclaration:exit": exitScope,
        "FunctionExpression:exit": exitScope,

        "ExpressionStatement": function(node) {

            if (node.expression.value === "use strict") {
                scopes[scopes.length] = true;
            }

        }
    };

};
