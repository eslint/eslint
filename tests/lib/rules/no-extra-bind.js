/**
 * @fileoverview Tests for no-extra-bind rule
 * @author Bence Dányi <bence@danyi.me>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-bind"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-extra-bind", rule, {
    valid: [
        "var a = function(b) { return b }.bind(c, d)",
        "var a = function() { this.b }()",
        "var a = function() { this.b }.foo()",
        "var a = f.bind(a)",
        "var a = function() { return this.b }.bind(c)",
        { code: "var a = (() => { return b }).bind(c, d)", parserOptions: { ecmaVersion: 6 } },
        "(function() { (function() { this.b }.bind(this)) }.bind(c))",
        "var a = function() { return 1; }[bind](b)",
        { code: "var a = function() { return 1; }[`bi${n}d`](b)", parserOptions: { ecmaVersion: 6 } },
        { code: "var a = function() { return () => this; }.bind(b)", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "var a = function() { return 1; }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { return 1; }['bind'](b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { return 1; }[`bind`](b)", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = (() => { return 1; }).bind(b)", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = (() => { return this; }).bind(b)", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { (function(){ this.c }) }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { function c(){ this.d } }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression"}] },
        { code: "var a = function() { (function(){ (function(){ this.d }.bind(c)) }) }.bind(b)", errors: [{ message: "The function binding is unnecessary.", type: "CallExpression", column: 71}] }
    ]
});
