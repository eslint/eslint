/**
 * @fileoverview Rule that warns when identifier names are shorter or longer
 *               than the values provided in configuration.
 * @author Burak Yigit Kaya aka BYK
 * @copyright 2015 Burak Yigit Kaya. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = context.options[0] || {};
    var minLength = typeof options.min !== "undefined" ? options.min : 2;
    var maxLength = typeof options.max !== "undefined" ? options.max : Infinity;
    var exceptions = (options.exceptions ? options.exceptions : [])
        .reduce(function(obj, item) {
        obj[item] = true;

        return obj;
    }, {});

    var SUPPORTED_EXPRESSIONS = {
        "AssignmentExpression": function(parent, node) {
            return parent.left.type === "MemberExpression" &&
                !parent.left.computed && parent.left.property === node;
        },
        "VariableDeclarator": function(parent, node) {
            return parent.id === node;
        },
        "ObjectExpression": function(parent, node) {
            return node.parent.key === node;
        },
        "FunctionExpression": true,
        "ArrowFunctionExpression": true,
        "FunctionDeclaration": true,
        "CatchClause": true
    };

    return {
        Identifier: function(node) {
            var name = node.name;
            var effectiveParent = (node.parent.type === "MemberExpression" || node.parent.type === "Property") ?
                                  node.parent.parent : node.parent;

            var isShort = name.length < minLength;
            var isLong = name.length > maxLength;
            if (!(isShort || isLong) || exceptions[name]) {
                return;  // Nothing to report
            }

            var isValidExpression = SUPPORTED_EXPRESSIONS[effectiveParent.type];

            if (isValidExpression && (isValidExpression === true || isValidExpression(effectiveParent, node))) {
                context.report(
                    node,
                    isShort ?
                        "Identifier name '{{name}}' is too short. (< {{min}})" :
                        "Identifier name '{{name}}' is too long. (> {{max}})",
                    { name: name, min: minLength, max: maxLength }
                );
            }
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "min": {
                "type": "number"
            },
            "max": {
                "type": "number"
            },
            "exceptions": {
                "type": "array",
                "uniqueItems": true,
                "items": {
                    "type": "string"
                }
            }
        },
        "additionalProperties": false
    }
];
