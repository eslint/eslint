/**
 * @fileoverview Rule to warn about using dot notation instead of square bracket notation when possible.
 * @author Josh Perez
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
var keywords = [
    "this",
    "function",
    "if",
    "return",
    "var",
    "else",
    "for",
    "new",
    "arguments",
    "in",
    "typeof",
    "while",
    "case",
    "break",
    "try",
    "catch",
    "delete",
    "throw",
    "switch",
    "continue",
    "default",
    "instanceof",
    "do",
    "void",
    "finally",
    "with",
    "debugger",
    "eval",
    "implements",
    "interface",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield",
    "let",
    "class",
    "enum",
    "export",
    "extends",
    "import",
    "super"
];

function canBeWrittenInDotNotation(node) {
    return node.computed === true &&
        node.property.type === "Literal" &&
        validIdentifier.test(node.property.value) &&
        keywords.indexOf(node.property.value) === -1;
}

module.exports = function(context) {
    return {
        "MemberExpression": function(node) {
            if (canBeWrittenInDotNotation(node)) {
                context.report(node, "['" + node.property.value + "'] is better written in dot notation.");
            }
        }
    };
};
