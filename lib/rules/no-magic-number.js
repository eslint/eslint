/**
 * @fileoverview Rule to flag statements that use magic numbers (adapted from https://github.com/danielstjules/buddy.js)
 * @author Vincent Lemeunier
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var config = context.options[0] || {},
        ignore = config.ignore || [0, 1, 2],
        detectObjects = !!config.detectObjects,
        enforceConst = !!config.enforceConst;

    /**
     * Returns whether the node is number literal
     * @param {Node} node - the node literal being evaluated
     * @returns {boolean} true if the node is a number literal
     */
    function isNumber(node) {
        return typeof node.value === "number";
    }

    /**
     * Returns whether the number should be ignored
     * @param {number} num - the number
     * @returns {boolean} true if the number should be ignored
     */
    function shouldIgnoreNumber(num) {
        return ignore.indexOf(num) !== -1;
    }


    return {
        "Literal": function(node) {
            var parent = node.parent,
                okTypes = detectObjects ? [] : ["ObjectExpression", "Property", "AssignmentExpression"];

            if (!isNumber(node)) {
                return;
            } else if (shouldIgnoreNumber(node.value)) {
                return;
            }

            if (parent.type === "VariableDeclarator") {
                if (enforceConst && parent.parent.kind !== "const") {
                    context.report({
                        node: node,
                        message: "Number constants declarations must use 'const'"
                    });
                }
            } else if (okTypes.indexOf(parent.type) === -1) {
                context.report({
                    node: node,
                    message: "No magic number: " + node.raw
                });
            }
        }
    };
};

module.exports.schema = [{
    "type": "object",
    "properties": {
        "detectObjects": {
            "type": "boolean"
        },
        "enforceConst": {
            "type": "boolean"
        },
        "ignore": {
            "type": "array",
            "items": {
                "type": "number"
            },
            "uniqueItems": true
        }
    },
    "additionalProperties": false
}];
