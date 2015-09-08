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
        {code: "foo(function() { this; });", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function() { (() => this); });", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function() { this; }.bind(obj));", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function() { this; }.call(this));", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(a => { (function() {}); });", ecmaFeatures: {arrowFunctions: true}},
        {code: "var foo = function foo() {};", ecmaFeatures: {arrowFunctions: true}},
        {code: "(function foo() {})();", ecmaFeatures: {arrowFunctions: true}},
        {code: "foo(function bar() { bar; });", ecmaFeatures: {arrowFunctions: true}},

        // noop when rule is used in wrong environment
        {code: "foo(function() { this; }.bind(this));", ecmaFeatures: {arrowFunctions: false}}
    ],
    invalid: [
        {code: "foo(function() {});", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(nativeCb || function() {});", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(bar ? function() {} : function() {});", ecmaFeatures: {arrowFunctions: true}, errors: [errors[0], errors[0]]},
        {code: "foo(function() { (function() { this; }); });", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(function() { this; }.bind(this));", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(function() { (() => this); }.bind(this));", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(function bar(a) { a; });", ecmaFeatures: {arrowFunctions: true}, errors: errors},
        {code: "foo(function(a) { a; });", ecmaFeatures: {arrowFunctions: true}, errors: errors}
    ]
});
