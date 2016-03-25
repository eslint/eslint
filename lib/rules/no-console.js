/**
 * @fileoverview Rule to flag use of console object
 * @author Nicholas C. Zakas
 * @copyright 2016 Eric Correia. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var consoleFunction = ["log", "warn", "error", "info"],
        allowedProperties = context.options && context.options[0] ? context.options[0].allow : [],
        flaggedProperties = consoleFunction.filter(function(item) {
            return allowedProperties.indexOf(item) < 0;
        }),
        events = {};

    /**
     * Report errors
     * @param {Object} node - Current node
     * @returns {void}
     */
    function report(node) {
        context.report(node, "Unexpected console statement.");
    }

    flaggedProperties.forEach(function(property) {
        events["MemberExpression[object.name=\"console\"][property.name=\"" + property + "\"]"] = report;
    });

    return events;
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "allow": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "minItems": 1,
                "uniqueItems": true
            }
        },
        "additionalProperties": false
    }
];
