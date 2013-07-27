/**
 * @fileoverview A rule to set the maximum number of statements in a function.
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

    function getStatementCount(node) {
        var count = 0;

        function countStatements(statement) {
            if (STATEMENT_TYPES.indexOf(statement.type) !== -1) {
                count += getStatementCount(statement);
            }
        }

        if (node.body && node.body.body) {
            count += node.body.body.length;
            node.body.body.forEach(countStatements);
        }

        if (node.consequent && node.consequent.body) {
            count += node.consequent.body.length;
            node.consequent.body.forEach(countStatements);
        }

        if (node.alternate && node.alternate.body) {
            count += node.alternate.body.length;
            node.alternate.body.forEach(countStatements);
        }

        return count;
    }

    function checkForMaxStatements(node) {
        var max = context.options[0],
            count = getStatementCount(node);

        if (count > max) {
            context.report(node, "Function contains " + count + " statements, maximum allowed is " + max + ".");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkForMaxStatements,
        "FunctionExpression": checkForMaxStatements
    };

};
