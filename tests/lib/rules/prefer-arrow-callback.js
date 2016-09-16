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

const ruleTester = new RuleTester();

ruleTester.run("prefer-arrow-callback", rule, {
    valid: [
        {code: "foo(a => a);", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function*() {});", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function() { this; });"},
        {code: "foo(function bar() {});", options: [{ allowNamedFunctions: true }]},
        {code: "foo(function() { (() => this); });", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function() { this; }.bind(obj));"},
        {code: "foo(function() { this; }.call(this));"},
        {code: "foo(a => { (function() {}); });", parserOptions: { ecmaVersion: 6 }},
        {code: "var foo = function foo() {};"},
        {code: "(function foo() {})();"},
        {code: "foo(function bar() { bar; });"},
        {code: "foo(function bar() { arguments; });"},
        {code: "foo(function bar() { arguments; }.bind(this));"},
        {code: "foo(function bar() { super.a; });", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function bar() { super.a; }.bind(this));", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function bar() { new.target; });", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function bar() { new.target; }.bind(this));", parserOptions: { ecmaVersion: 6 }},
        {code: "foo(function bar() { this; }.bind(this, somethingElse));"}
    ],
    invalid: [
        {
            code: "foo(function bar() {});",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function() {});",
            parserOptions: { ecmaVersion: 6 },
            options: [{ allowNamedFunctions: true }],
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function bar() {});",
            parserOptions: { ecmaVersion: 6 },
            options: [{ allowNamedFunctions: false }],
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(function() {});",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(() => {});"
        },
        {
            code: "foo(nativeCb || function() {});",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(nativeCb || () => {});"
        },
        {
            code: "foo(bar ? function() {} : function() {});",
            parserOptions: { ecmaVersion: 6 },
            errors: [errors[0], errors[0]],
            output: "foo(bar ? () => {} : () => {});"
        },
        {
            code: "foo(function() { (function() { this; }); });",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(() => { (function() { this; }); });"
        },
        {
            code: "foo(function() { this; }.bind(this));",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(() => { this; });"
        },
        {
            code: "foo(function() { (() => this); }.bind(this));",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo(() => { (() => this); });"
        },
        {
            code: "foo(function bar(a) { a; });",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo((a) => { a; });"
        },
        {
            code: "foo(function(a) { a; });",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo((a) => { a; });"
        },
        {
            code: "foo(function(arguments) { arguments; });",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "foo((arguments) => { arguments; });"
        },
        {
            code: "foo(function() { this; });",
            parserOptions: { ecmaVersion: 6 },
            options: [{ allowUnboundThis: false }],
            errors,
            output: "foo(function() { this; });" // No fix applied
        },
        {
            code: "foo(function() { (() => this); });",
            parserOptions: { ecmaVersion: 6 },
            options: [{ allowUnboundThis: false }],
            errors,
            output: "foo(function() { (() => this); });" // No fix applied
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * 2; })",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux((foo, bar, baz) => { return foo * 2; })"
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * bar; }.bind(this))",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux((foo, bar, baz) => { return foo * bar; })"
        },
        {
            code: "qux(function(foo, bar, baz) { return foo * this.qux; }.bind(this))",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux((foo, bar, baz) => { return foo * this.qux; })"
        },
        {
            code: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux((foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) => { return foo + bar; });"
        },
        {
            code: "qux(function(baz, baz) { })",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux(function(baz, baz) { })" // Duplicate parameter names are a SyntaxError in arrow functions
        },
        {
            code: "qux(function( /* no params */ ) { })",
            parserOptions: { ecmaVersion: 6 },
            errors,
            output: "qux(( /* no params */ ) => { })"
        },
        {
            code: "qux(function( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) { return foo; })",
            parserOptions: { ecmaVersion: 6 },
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
            errors,
        }
    ]
});
