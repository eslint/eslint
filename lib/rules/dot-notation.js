/**
 * @fileoverview Rule to warn about using dot notation instead of square bracket notation when possible.
 * @author Josh Perez
 */

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

module.exports = function(context) {
    return {
        "MemberExpression": function(node) {
            if (node.computed === true &&
                node.property.type === "Literal" &&
                validIdentifier.test(node.property.value) &&
                keywords.indexOf(node.property.value) === -1) {
                context.report(node, "It is preferrable to use dot notation.");
            }
        }
    };
};
