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
        {code: "foo(a => a);", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function*() {});", ecmaFeatures: {generators: true}},
        {code: "foo(function() { this; });"},
        {code: "foo(function() { (() => this); });", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function() { this; }.bind(obj));"},
        {code: "foo(function() { this; }.call(this));"},
        {code: "foo(a => { (function() {}); });", ecmaFeatures: {arrowFunctions: true}},
        {code: "var foo = function foo() {};"},
        {code: "(function foo() {})();"},
        {code: "foo(function bar() { bar; });"},
        {code: "foo(function bar() { arguments; });"},
        {code: "foo(function bar() { arguments; }.bind(this));"},
        {code: "foo(function bar() { super.a; });", ecmaFeatures: {classes: true}},
        {code: "foo(function bar() { super.a; }.bind(this));", ecmaFeatures: {classes: true}},
        {code: "foo(function bar() { new.target; });", ecmaFeatures: {newTarget: true}},
        {code: "foo(function bar() { new.target; }.bind(this));", ecmaFeatures: {newTarget: true}}
    ],
    invalid: [
        {code: "foo(function() {});", errors: errors},
        {code: "foo(nativeCb || function() {});", errors: errors},
        {code: "foo(bar ? function() {} : function() {});", errors: [errors[0], errors[0]]},
        {code: "foo(function() { (function() { this; }); });", errors: errors},
        {code: "foo(function() { this; }.bind(this));", errors: errors},
        {code: "foo(function() { (() => this); }.bind(this));", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(function bar(a) { a; });", errors: errors},
        {code: "foo(function(a) { a; });", errors: errors},
        {code: "foo(function(arguments) { arguments; });", errors: errors}
    ]
});
