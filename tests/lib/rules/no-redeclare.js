/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
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
eslintTester.addRuleTest("lib/rules/no-redeclare", {
    valid: [
        "var a = 3; var b = function() { var a = 10; };",
        "var a = 3; a = 10;",
        {
            code: "if (true) {\n    let b = 2;\n} else {    \nlet b = 3;\n}",
            ecmaFeatures: {
                blockBindings: true
            }
        }
    ],
    invalid: [
        { code: "var a = 3; var a = 10;", ecmaFeatures: { globalReturn: true }, errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "switch(foo) { case a: let b = 3;\ncase b: let b = 4}", ecmaFeatures: { blockBindings: true }, errors: [{ message: "b is already defined", type: "Identifier"}] },
        { code: "var a = 3; var a = 10;", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = {}; var a = [];", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = function() { }; var a = function() { }", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = function() { }; var a = new Date();", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = 3; var a = 10; var a = 15;", errors: [{ message: "a is already defined", type: "Identifier"}, { message: "a is already defined", type: "Identifier"}] }
    ]
});
