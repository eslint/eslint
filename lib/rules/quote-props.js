/**
 * @fileoverview Rule to flag non-quoted property names in object literals.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var esprima = require("esprima");

module.exports = function(context) {

    "use strict";

    var MODE = context.options[0];

    switch (MODE) {

        case "as-needed":
            return {
                Property: function(node) {
                    var key = node.key;
                    // Ensure that any quoted property names required quoting
                    if (key.type === "Literal" && typeof key.value === "string") {
                        try {
                            var tokens = esprima.tokenize(key.value);
                            if (tokens.length !== 1) {
                                return;
                            }
                            var t = tokens[0];
                        } catch(e) {
                            return;
                        }
                        if (t.type === "Identifier" || t.type === "Null" || t.type === "Boolean" || t.type === "Numeric" && "" + +t.value === t.value) {
                            context.report(node, "Unnecessarily quoted property `{{name}}` found.", key);
                        }
                    }
                }
            };

        default:
            return {
                Property: function(node) {
                    var key = node.key;
                    // Ensure all property names are quoted
                    if (key.type !== "Literal" || typeof key.value !== "string") {
                        context.report(node, "Unquoted property `{{name}}` found.", key);
                    }
                }
            };

    }

};
