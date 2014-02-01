/**
 * @fileoverview Tests for no-comma-dangle rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-comma-dangle", {
    valid: [
        "var foo = { bar: \"baz\" }",
        "var foo = [ \"baz\" ]",
        "[,,]",
        "[,]",
        "[]"
    ],
    invalid: [
        { code: "var foo = { bar: \"baz\", }", errors: [{ message: "Trailing comma.", type: "Property"}] },
        { code: "foo({ bar: \"baz\", qux: \"quux\", });", errors: [{ message: "Trailing comma.", type: "Property"}] },
        { code: "var foo = [ \"baz\", ]", errors: [{ message: "Trailing comma.", type: "Literal"}] }
    ]
});
