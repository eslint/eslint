/**
 * @fileoverview Tests for no-shadow rule.
 * @author Ilya Volodin
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
eslintTester.addRuleTest("lib/rules/no-shadow", {
    valid: [
        "var a=3; function b(a) { a++; return a; }; setTimeout(function() { b(a); }, 0);",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())"
    ],
    invalid: [
        { code: "var a=3; function b() { var a=10; }", errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}] },
        { code: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);", errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}] },
        { code: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);", errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}, { message: "b is already declared in the upper scope.", type: "Identifier"}] }
    ]
});
