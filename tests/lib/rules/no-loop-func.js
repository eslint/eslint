/**
 * @fileoverview Tests for no-loop-func rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-loop-func", {
    valid: [
        "string = 'function a() {}';",
        "for (var i=0; i<l; i++) { } var a = function() { };"
    ],
    invalid: [
        { code: "for (var i=0; i<l; i++) { (function() {}) }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "for (var i in {}) { (function() {}) }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "for (var i=0; i<l; i++) { (() => {}) }", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Don't make functions within a loop", type: "ArrowFunctionExpression"}] },
        { code: "for (var i=0; i<l; i++) { var a = function() {} }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "for (var i=0; i<l; i++) { function a() {}; a(); }", errors: [{ message: "Don't make functions within a loop", type: "FunctionDeclaration"}] },
        { code: "while(i) { (function() {}) }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "do { (function() {}) } while (i)", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] }
    ]
});
