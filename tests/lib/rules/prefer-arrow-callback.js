/**
 * @fileoverview Tests for prefer-arrow-callback rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-arrow-callback");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{
    message: "Unexpected function expression.",
    type: "FunctionExpression"
}];

var ruleTester = new RuleTester();

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
        {code: "foo(function bar() {});", errors: errors},
        {code: "foo(function() {});", options: [{ allowNamedFunctions: true }], errors: errors},
        {code: "foo(function bar() {});", options: [{ allowNamedFunctions: false }], errors: errors},
        {code: "foo(function() {});", errors: errors},
        {code: "foo(nativeCb || function() {});", errors: errors},
        {code: "foo(bar ? function() {} : function() {});", errors: [errors[0], errors[0]]},
        {code: "foo(function() { (function() { this; }); });", errors: errors},
        {code: "foo(function() { this; }.bind(this));", errors: errors},
        {code: "foo(function() { (() => this); }.bind(this));", parserOptions: { ecmaVersion: 6 }, errors: errors},
        {code: "foo(function bar(a) { a; });", errors: errors},
        {code: "foo(function(a) { a; });", errors: errors},
        {code: "foo(function(arguments) { arguments; });", errors: errors}
    ]
});
