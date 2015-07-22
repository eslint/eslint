/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-use-before-define", {
    valid: [
        "var a=10; alert(a);",
        "function b(a) { alert(a); }",
        "Object.hasOwnProperty.call(a);",
        "function a() { alert(arguments);}",
        { code: "a(); function a() { alert(arguments); }", options: [ "nofunc"] },
        { code: "(() => { var a = 42; alert(a); })();", ecmaFeatures: { arrowFunctions: true } }
    ],
    invalid: [
        { code: "a++; var a=19;", ecmaFeatures: { modules: true }, errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", ecmaFeatures: { globalReturn: true }, errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "alert(a[1]); var a=[1,3];", errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "a(); function a() { alert(b); var b=10; a(); }", errors: [{ message: "a was used before it was defined", type: "Identifier"}, { message: "b was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", options: [ "nofunc"], errors: [{ message: "a was used before it was defined", type: "Identifier"}] },
        { code: "(() => { alert(a); var a = 42; })();", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "a was used before it was defined", type: "Identifier" }] },
        { code: "(() => a())(); function a() { }", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "a was used before it was defined", type: "Identifier" }] }
    ]
});
