/**
 * @fileoverview Rule to require variables declared without whitespace before the lines semicolon
 * @author Jonathan Kingston
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var semicolonWhitespace = /\s;$/;

    return {
        "VariableDeclaration": function(node) {
            var source = context.getSource(node);
            if (semicolonWhitespace.test(source)) {
                context.report(node, "Variable declared with trailing whitespace before semicolon");
            }
        },
        "ExpressionStatement": function(node) {
            var source = context.getSource(node);
            if (semicolonWhitespace.test(source)) {
                context.report(node, "Expression called with trailing whitespace before semicolon");
            }
        }
    };
};
