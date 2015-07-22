/**
 * @fileoverview Tests for no-label-var rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-label-var", {
    valid: [
        "function bar() { q: for(;;) { break q; } } function foo () { var q = t; }",
        "function bar() { var x = foo; q: for(;;) { break q; } }"
    ],
    invalid: [
        { code: "var x = foo; function bar() { x: for(;;) { break x; } }", errors: [{ message: "Found identifier with same name as label.", type: "LabeledStatement"}] },
        { code: "function bar() { var x = foo; x: for(;;) { break x; } }", errors: [{ message: "Found identifier with same name as label.", type: "LabeledStatement"}] },
        { code: "function bar(x) { x: for(;;) { break x; } }", errors: [{ message: "Found identifier with same name as label.", type: "LabeledStatement"}] }
    ]
});
