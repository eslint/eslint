/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-ternary", {
    valid: [
        "\"x ? y\";"
    ],
    invalid: [
        { code: "var foo = true ? thing : stuff;", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "true ? thing() : stuff();", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "function foo(bar) { return bar ? baz : qux; }", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] }
    ]
});
