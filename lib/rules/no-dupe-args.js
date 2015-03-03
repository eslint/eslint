/**
 * @fileoverview Rule to flag duplicate arguments
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines if a given node has duplicate parameters.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkParams(node) {
        var dups = {};

        // loop through and find each duplicate param
        node.params.map(function(param) {
            return param.name;
        }).forEach(function(param, i, params) {
            var lastPos = params.lastIndexOf(param);
            if (i !== lastPos) {
                dups[param] = [i, lastPos];
            }
        });

        // log an error for each duplicate (not 2 for each)
        Object.keys(dups).forEach(function(currentParam) {
            context.report(node, "Duplicate param '{{key}}'.", { key: currentParam });
        });
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkParams,
        "FunctionExpression": checkParams
    };

};
