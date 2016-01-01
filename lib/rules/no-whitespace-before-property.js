/**
 * @fileoverview Rule to disallow whitespace before properties
 * @author Kai Cataldo
 * @copyright 2015 Kai Cataldo. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode();

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        MemberExpression: function(node) {
            var obj = node.object;
            var prop = node.property;

            if (astUtils.isTokenOnSameLine(obj, prop)) {
                if (sourceCode.isSpaceBetweenTokens(obj, prop)) {
                    context.report({
                        node: node,
                        message: "Unexpected whitespace before property '{{ propName }}'.",
                        data: {
                            propName: prop.name
                        }
                    });
                }
            }
        }
    };
};

module.exports.schema = [];

