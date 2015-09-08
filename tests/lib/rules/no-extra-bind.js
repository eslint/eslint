/**
 * @fileoverview Tests for no-extra-bind rule
 * @author Bence Dányi <bence@danyi.me>
 * @copyright 2014 Bence Dányi. All rights reserved.
 * See LICENSE in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-extra-bind"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-extra-bind", rule, {
    valid: [
        "var a = function(b) { return b }.bind(c, d)",
        "var a = function() { this.b }()",
        "var a = function() { this.b }.foo()",
        "var a = f.bind(a)",
        "var a = function() { return this.b }.bind(c)",
        { code: "var a = (() => { return b }).bind(c, d)", ecmaFeatures: { arrowFunctions: true } }
    ],
    invalid: [
        { code: "var a = function() { return 1; }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = (() => { return 1; }).bind(b)", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = (() => { return this; }).bind(b)", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { (function(){ this.c }) }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { function c(){ this.d } }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] }
    ]
});
