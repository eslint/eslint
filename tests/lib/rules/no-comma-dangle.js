/**
 * @fileoverview Tests for no-comma-dangle rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-comma-dangle", {
    valid: [
        "var foo = { bar: \"baz\" }",
        "var foo = [ \"baz\" ]"
    ],
    invalid: [
        { code: "var foo = { bar: \"baz\", }", errors: [{ message: "Trailing comma.", type: "ObjectExpression"}] },
        { code: "foo({ bar: \"baz\", qux: \"quux\", });", errors: [{ message: "Trailing comma.", type: "ObjectExpression"}] },
        { code: "var foo = [ \"baz\", ]", errors: [{ message: "Trailing comma.", type: "ArrayExpression"}] }
    ]
});
