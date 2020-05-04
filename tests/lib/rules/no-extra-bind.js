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
const errors = [{ messageId: "unexpected", type: "CallExpression" }];

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
        {
            code: "var a = function() { return 1; }.bind(b)",
            output: "var a = function() { return 1; }",
            errors
        },
        {
            code: "var a = function() { return 1; }['bind'](b)",
            output: "var a = function() { return 1; }",
            errors
        },
        {
            code: "var a = function() { return 1; }[`bind`](b)",
            output: "var a = function() { return 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var a = (() => { return 1; }).bind(b)",
            output: "var a = (() => { return 1; })",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var a = (() => { return this; }).bind(b)",
            output: "var a = (() => { return this; })",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var a = function() { (function(){ this.c }) }.bind(b)",
            output: "var a = function() { (function(){ this.c }) }",
            errors
        },
        {
            code: "var a = function() { function c(){ this.d } }.bind(b)",
            output: "var a = function() { function c(){ this.d } }",
            errors
        },
        {
            code: "var a = function() { return 1; }.bind(this)",
            output: "var a = function() { return 1; }",
            errors
        },
        {
            code: "var a = function() { (function(){ (function(){ this.d }.bind(c)) }) }.bind(b)",
            output: "var a = function() { (function(){ (function(){ this.d }.bind(c)) }) }",
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 71 }]
        },

        // Should not autofix if bind expression args have side effects
        {
            code: "var a = function() {}.bind(b++)",
            output: null,
            errors
        },
        {
            code: "var a = function() {}.bind(b())",
            output: null,
            errors
        },
        {
            code: "var a = function() {}.bind(b.c)",
            output: null,
            errors
        }
    ]
});
