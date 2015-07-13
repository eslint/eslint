/**
 * @fileoverview No undocumented unnamed functions
 * @author Andreas Marschke
 * @copyright 2015 Andreas Marschke All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

/**
   Rule Definition
   @param {ASTContext} context for the code
   @returns {Object} schema with identifiers
*/
module.exports = function(context) {
    // Record found errors
    var found = {};

    /**
     * Check if we have seen this error before
     * @param {Integer} line The line it is reported on
     * @param {Integer} column The character it is reported on
     * @returns {boolean} true if found already false if not
     */
    function checkIfFound(line, column) {
        return found[line] && found[line][column] === true;
    }

    /**
     * Record found errors in the found variable
     * @param {Integer} line The line it is reported on
     * @param {Integer} column The character it is reported on
     * @returns {void}
     */
    function recordFound(line, column) {
        if (!found[line]) {
            found[line] = {};
        }
        found[line][column] = true;
    }

    /**
     * Report Errors on nodes name
     * @param {String} name The name of the function to be reported
     * @param {ASTNode} node The node to report on
     * @returns {void}
     */
    function reportMissingFunction(name, node) {
        if (!checkIfFound(node.loc.start.line, node.loc.start.column)) {
            context.report(node, "Function " + name + " was not documented");
            recordFound(node.loc.start.line, node.loc.start.column);
        }
    }

    /**
     * Validate the JSDoc node and output warnings if anything is wrong.
     * @param {ASTNode} node The AST node to check.
     * @returns {void}
     * @private
     */
    function checkJSDoc(node) {
        var jsdocNode = context.getJSDocComment(node);

        if (!jsdocNode) {
            switch (node.type) {
            case "FunctionExpression": {
                if (node.parent && node.parent.id && node.parent.id.name && node.parent.type === "VariableDeclarator") {
                    reportMissingFunction(node.parent.id.name, node);
                    return;
                } else if (node.parent && node.parent.key && node.parent.key.name && node.parent.type === "Property") {
                    reportMissingFunction(node.parent.key.name, node);
                    return;
                } else if (node.parent && node.parent.operator === "=" && node.parent.type === "AssignmentExpression" ) {
                    reportMissingFunction(node.parent.left.property.name, node);
                    return;
                }
                break;
            }
            case "FunctionDeclaration": {
                if (node.id && node.id.name) {
                    reportMissingFunction(node.id.name, node);
                    return;
                }
                break;
            }
            default:
                break;
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "ArrowFunctionExpression": checkJSDoc,
        "FunctionExpression": checkJSDoc,
        "FunctionDeclaration": checkJSDoc,
        "ArrowFunctionExpression:exit": checkJSDoc,
        "FunctionExpression:exit": checkJSDoc,
        "FunctionDeclaration:exit": checkJSDoc
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {},
        "additionalProperties": false
    }
];
