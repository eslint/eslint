/**
 * @fileoverview Tests for no-empty-class rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-empty-class", {
    valid: [
        "var foo = /^abc[a-zA-Z]/;",
        "var regExp = new RegExp(\"^abc[]\");",
        "var foo = /^abc/;",
        "var foo = /[\\[]/;",
        "var foo = /[\\]]/;",
        "var foo = /[a-zA-Z\\[]/;",
        "var foo = /[[]/;",
        "var foo = /[\\[a-z[]]/;",
        "var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;",
        "var foo = /\\s*:\\s*/gim;"
    ],
    invalid: [
        { code: "var foo = /^abc[]/;", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "var foo = /foo[]bar/;", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "if (foo.match(/^abc[]/)) {}", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "if (/^abc[]/.test(foo)) {}", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "var foo = /[]]/;", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "var foo = /\\[[]/;", errors: [{ message: "Empty class.", type: "Literal"}] },
        { code: "var foo = /\\[\\[\\]a-z[]/;", errors: [{ message: "Empty class.", type: "Literal"}] }
    ]
});
