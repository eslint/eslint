/**
 * @fileoverview A rule to ensure the use of a single variable declaration.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    //--------------------------------------------------------------------------
    // Constants
    //--------------------------------------------------------------------------

    var STATEMENT_TYPES = ["IfStatement", "WhileStatement", "SwitchStatement",
            "TryStatement", "DoWhileStatement", "ForStatement", "WithStatement",
            "ForInStatement"];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var declarationFound;

    function findInBlockStatement(nodes) {
        nodes.forEach(function (node) {
            var type = node.type;

            // We've already found a variable declaration, report warning.
            if (type === "VariableDeclaration" && declarationFound) {
                context.report(node, "Combine this with the previous 'var' statement.");

            // This is the first variable declaration we've found.
            } else if (type === "VariableDeclaration") {
                declarationFound = true;

            // Traverse block statements to find variable declarations.
            } else if (STATEMENT_TYPES.indexOf(node.type) > -1) {
                checkDeclarations(node);
            }
        });
    }

    function checkDeclarations(node) {
        if (node.body && node.body.body) {
            findInBlockStatement(node.body.body);
        }

        if (node.consequent && node.consequent.body) {
            findInBlockStatement(node.consequent.body);
        }

        if (node.alternate && node.alternate.body) {
            findInBlockStatement(node.alternate.body);
        }
    }

    function checkForMultipleDeclarations(node) {
        declarationFound = false;
        checkDeclarations(node);
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkForMultipleDeclarations,
        "FunctionExpression": checkForMultipleDeclarations
    };

};
