/**
 * @fileoverview Tests for prefer-arrow-callback rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/prefer-arrow-callback");
let RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let errors = [{
    message: "Unexpected function expression.",
    type: "FunctionExpression"
}];

let ruleTester = new RuleTester();

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
        {code: "foo(function bar() { new.target; }.bind(this));", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {code: "foo(function bar() {});", errors},
        {code: "foo(function() {});", options: [{ allowNamedFunctions: true }], errors},
        {code: "foo(function bar() {});", options: [{ allowNamedFunctions: false }], errors},
        {code: "foo(function() {});", errors},
        {code: "foo(nativeCb || function() {});", errors},
        {code: "foo(bar ? function() {} : function() {});", errors: [errors[0], errors[0]]},
        {code: "foo(function() { (function() { this; }); });", errors},
        {code: "foo(function() { this; }.bind(this));", errors},
        {code: "foo(function() { (() => this); }.bind(this));", parserOptions: { ecmaVersion: 6 }, errors},
        {code: "foo(function bar(a) { a; });", errors},
        {code: "foo(function(a) { a; });", errors},
        {code: "foo(function(arguments) { arguments; });", errors},
        {code: "foo(function() { this; });", options: [{ allowUnboundThis: false }], errors},
        {code: "foo(function() { (() => this); });", parserOptions: { ecmaVersion: 6 }, options: [{ allowUnboundThis: false }], errors}
    ]
});
