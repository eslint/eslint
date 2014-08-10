/**
 * @fileoverview Rule to dissallow reserved words being used as keys
 * @author Emil Bay
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var errorMessage = "Reserved word '{{key}}' used as key.";

    var reservedWords = ["break", "case", "class", "catch", "const", "continue",
                         "debugger", "default", "delete", "do", "else",
                         "export", "extends", "finally", "for", "function",
                         "if", "import", "in", "instanceof", "let", "new",
                         "return", "super", "switch", "this", "throw", "try",
                         "typeof", "var", "void", "while", "with", "yield",
                         "enum", "implements", "package", "protected", "static",
                         "interface", "private", "public", "true", "false",
                         "null"];

    function isDisguisedReservedWord(node) {
        return node.computed === true &&
               node.property.type === "Literal" &&
               reservedWords.indexOf(node.property.value) !== -1;
    }

    return {

        "ObjectExpression": function(node) {
            node.properties.forEach(function(property) {
                var keyName = property.key.name || property.key.value;

                if (reservedWords.indexOf("" + keyName) !== -1) {
                    context.report(node, errorMessage, { key: keyName });
                }
            });

        },
        "MemberExpression": function(node) {
            if (isDisguisedReservedWord(node)) {
                context.report(node, errorMessage, { key: node.property.value });
            }
        }
    };

};
