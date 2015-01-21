/**
 * @fileoverview Tests for no-comma-dangle rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
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
        { code: "var foo = [ \"baz\", ]", errors: [{ message: "Trailing comma.", type: "Literal"}] },
        { code: "var foo = { bar: \"bar\"\n\n, }", errors: [{ message: "Trailing comma.", line: 3}] }
    ]
});
