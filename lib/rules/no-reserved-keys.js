/**
 * @fileoverview Rule to dissallow reserved words being used object keys
 * @author Emil Bay
 * @copyright 2014 Emil Bay. All rights reserved.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var errorMessage = "Reserved word '{{prop}}' used as property name.";

    var reservedWords = ["break", "case", "class", "catch", "const", "continue",
                         "debugger", "default", "delete", "do", "else",
                         "export", "extends", "finally", "for", "function",
                         "if", "import", "in", "instanceof", "let", "new",
                         "return", "super", "switch", "this", "throw", "try",
                         "typeof", "var", "void", "while", "with", "yield",
                         "enum", "implements", "package", "protected", "static",
                         "interface", "private", "public", "true", "false",
                         "null", "abstract", "boolean", "byte", "char",
                         "double", "final", "float", "goto", "int", "long",
                         "native", "short", "synchronized", "throws",
                         "transient", "volatile"];

    return {

        "ObjectExpression": function(node) {
            node.properties.forEach(function(property) {
                var propName = property.key.name || property.key.value;

                if (reservedWords.indexOf("" + propName) !== -1) {
                    context.report(node, errorMessage, { prop: propName });
                }
            });

        }
    };

};
