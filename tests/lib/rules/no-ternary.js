/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-ternary", {
    valid: [
        "\"x ? y\";"
    ],
    invalid: [
        { code: "var foo = true ? thing : stuff;", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "true ? thing() : stuff();", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "function foo(bar) { return bar ? baz : qux; }", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] }
    ]
});
