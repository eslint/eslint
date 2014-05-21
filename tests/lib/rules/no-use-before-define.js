/**
 * @fileoverview Tests for no-use-before-define rule.
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
eslintTester.addRuleTest("lib/rules/no-use-before-define", {
    valid: [
        "var a=10; alert(a);",
        "function b(a) { alert(a); }",
        "Object.hasOwnProperty.call(a);",
        "function a() { alert(arguments);}",
        { code: "a(); function a() { alert(arguments); }", args: [1, "nofunc"] }
    ],
    invalid: [
        { code: "a++; var a=19;", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "alert(a[1]); var a=[1,3];", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a(); function a() { alert(b); var b=10; a(); }", errors: [{ message: "a was used before it was defined", type: "Identifier"}, { message: "b was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", args: [1, "nofunc"], errors: [{ message: "a was used before it was defined", type: "Identifier"}] }
    ]
});
