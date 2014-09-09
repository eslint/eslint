/**
 * @fileoverview Tests for no-extra-bind rule
 * @author Bence Dányi <bence@danyi.me>
 * @copyright 2014 Bence Dányi. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-extra-bind", {
    valid: [
        "var a = function(b) { return b }.bind(c, d)",
        "var a = function() { this.b }()",
        "var a = function() { this.b }.foo()",
        "var a = f.bind(a)",
        "var a = function() { return this.b }.bind(c)"
    ],
    invalid: [
        { code: "var a = function() { return 1; }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { (function(){ this.c }) }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { function c(){ this.d } }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] }
    ]
});
