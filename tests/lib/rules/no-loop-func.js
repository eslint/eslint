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
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate),
    expectedErrorMessage = "Don't make functions within a loop";

eslintTester.addRuleTest("lib/rules/no-loop-func", {
    valid: [
        "string = 'function a() {}';",
        "for (var i=0; i<l; i++) { } var a = function() { };",
        "for (var i=0, a=function() { }; i<l; i++) { }",
        "for (var x in xs.filter(function(x) { return x != null; })) { }",
        {
            code: "for (var x of xs.filter(function(x) { return x != null; })) { }",
            ecmaFeatures: { forOf: true }
        }
    ],
    invalid: [
        {
            code: "for (var i=0; i<l; i++) { (function() {}) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i in {}) { (function() {}) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i of {}) { (function() {}) }",
            ecmaFeatures: { forOf: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { (() => {}) }",
            ecmaFeatures: { arrowFunctions: true },
            errors: [ { message: expectedErrorMessage, type: "ArrowFunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { var a = function() {} }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { function a() {}; a(); }",
            errors: [ { message: expectedErrorMessage, type: "FunctionDeclaration" } ]
        },
        {
            code: "for (var i=0; (function() {})(), i<l; i++) { }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i<l; (function() {})(), i++) { }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "while(i) { (function() {}) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "do { (function() {}) } while (i)",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        }
    ]
});
