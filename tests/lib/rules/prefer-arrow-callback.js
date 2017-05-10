/**
 * @fileoverview Tests for prefer-arrow-callback rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-arrow-callback");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
    message: "Unexpected function expression.",
    type: "FunctionExpression"
}];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("prefer-arrow-callback", rule, {
    valid: [
        "foo(a => a);",
        "foo(function*() {});",
        "foo(function() { this; });",
        { code: "foo(function bar() {});", options: [{ allowNamedFunctions: true }] },
        "foo(function() { (() => this); });",
        "foo(function() { this; }.bind(obj));",
        "foo(function() { this; }.call(this));",
        "foo(a => { (function() {}); });",
        "var foo = function foo() {};",
        "(function foo() {})();",
        "foo(function bar() { bar; });",
        "foo(function bar() { arguments; });",
        "foo(function bar() { arguments; }.bind(this));",
        "foo(function bar() { super.a; });",
        "foo(function bar() { super.a; }.bind(this));",
        "foo(function bar() { new.target; });",
        "foo(function bar() { new.target; }.bind(this));",
        "foo(function bar() { this; }.bind(this, somethingElse));"
    ],
    invalid: [
        {
            code: "foo(function bar() {});",
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function() {});",
            options: [{ allowNamedFunctions: true }],
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function bar() {});",
            options: [{ allowNamedFunctions: false }],
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function() {});",
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(nativeCb || function() {});",
            errors,
            output: "foo(nativeCb || (() => {}));"
        },
        {
            code: "foo(bar ? function() {} : function() {});",
            errors: [errors[0], errors[0]],
            output: "foo(bar ? () => {} : () => {});"
        },
        {
            code: "foo(function() { (function() { this; }); });",
            errors,
            output: "foo(() => { (function() { this; }); });"
        },
        {
            code: "foo(function() { this; }.bind(this));",
            errors,
            output: "foo(() => { this; });"
        },
        {
            code: "foo(bar || function() { this; }.bind(this));",
            errors,
            output: "foo(bar || (() => { this; }));"
        },
        {
            code: "foo(function() { (() => this); }.bind(this));",
            errors,
            output: "foo(() => { (() => this); });"
        },
        {
            code: "foo(function bar(a) { a; });",
            errors,
            output: "foo((a) => { a; });"
        },
        {
            code: "foo(function(a) { a; });",
            errors,
            output: "foo((a) => { a; });"
        },
        {
            code: "foo(function(arguments) { arguments; });",
            errors,
            output: "foo((arguments) => { arguments; });"
        },
        {
            code: "foo(function() { this; });",
            options: [{ allowUnboundThis: false }],
            errors,
            output: null // No fix applied
        },
        {
            code: "foo(function() { (() => this); });",
            options: [{ allowUnboundThis: false }],
            errors,
            output: null // No fix applied
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * 2; })",
            errors,
            output: "qux((foo, bar, baz) => { return foo * 2; })"
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * bar; }.bind(this))",
            errors,
            output: "qux((foo, bar, baz) => { return foo * bar; })"
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * this.qux; }.bind(this))",
            errors,
            output: "qux((foo, bar, baz) => { return foo * this.qux; })"
        },
        {
            code: "foo(function() {}.bind(this, somethingElse))",
            errors,
            output: "foo((() => {}).bind(this, somethingElse))"
        },
        {
            code: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
            errors,
            output: "qux((foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) => { return foo + bar; });"
        },
        {
            code: "qux(function(baz, baz) { })",
            errors,
            output: null // Duplicate parameter names are a SyntaxError in arrow functions
        },
        {
            code: "qux(function( /* no params */ ) { })",
            errors,
            output: "qux(( /* no params */ ) => { })"
        },
        {
            code: "qux(function( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) { return foo; })",
            errors,
            output: "qux(( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) => { return foo; })"
        },
        {
            code: "qux(async function (foo = 1, bar = 2, baz = 3) { return baz; })",
            output: "qux(async (foo = 1, bar = 2, baz = 3) => { return baz; })",
            parserOptions: { ecmaVersion: 8 },
            errors
        },
        {
            code: "qux(async function (foo = 1, bar = 2, baz = 3) { return this; }.bind(this))",
            output: "qux(async (foo = 1, bar = 2, baz = 3) => { return this; })",
            parserOptions: { ecmaVersion: 8 },
            errors
        }
    ]
});
