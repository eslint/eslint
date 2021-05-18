/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/wrap-iife"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const wrapInvocationError = { messageId: "wrapInvocation", type: "CallExpression" };
const wrapExpressionError = { messageId: "wrapExpression", type: "CallExpression" };
const moveInvocationError = { messageId: "moveInvocation", type: "CallExpression" };

ruleTester.run("wrap-iife", rule, {
    valid: [
        {
            code: "(function(){ }());",
            options: ["any"]
        },
        {
            code: "(function(){ })();",
            options: ["any"]
        },
        {
            code: "(function a(){ }());",
            options: ["any"]
        },
        {
            code: "(function a(){ })();",
            options: ["any"]
        },
        {
            code: "(function(){ }())",
            options: ["any"]
        },
        {
            code: "(function(){ })()",
            options: ["any"]
        },
        {
            code: "(function a(){ }());",
            options: ["outside"]
        },
        {
            code: "(function a(){ })();",
            options: ["inside"]
        },
        {
            code: "foo.bar();",
            options: ["any"]
        },
        {
            code: "var a = function(){return 1;};",
            options: ["any"]
        },
        {
            code: "window.bar = (function() { return 3; }.call(this, arg1));",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = (function() { return 3; }).call(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = (function() { return 3; }.apply(this, arg1));",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = (function() { return 3; }).apply(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = function() { return 3; }.call(this, arg1);",
            options: ["inside"]
        },
        {
            code: "window.bar = function() { return 3; }.call(this, arg1);",
            options: ["inside", { functionPrototypeMethods: false }]
        },
        {
            code: "window.bar = function() { return 3; }[call](this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = function() { return 3; }[apply](this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "window.bar = function() { return 3; }[foo](this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "var a = function(){return 1;}.bind(this);",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "var a = function(){return 1;}.bind(this).apply(that);",
            options: ["inside", { functionPrototypeMethods: true }]
        }
    ],
    invalid: [
        {
            code: "0, function(){ }();",
            output: "0, (function(){ }());",
            errors: [wrapInvocationError]
        },
        {
            code: "[function(){ }()];",
            output: "[(function(){ }())];",
            errors: [wrapInvocationError]
        },
        {
            code: "var a = function(){ }();",
            output: "var a = (function(){ }());",
            errors: [wrapInvocationError]
        },
        {
            code: "(function(){ }(), 0);",
            output: "((function(){ }()), 0);",
            errors: [wrapInvocationError]
        },
        {
            code: "(function a(){ })();",
            output: "(function a(){ }());",
            options: ["outside"],
            errors: [moveInvocationError]
        },
        {
            code: "(function a(){ }());",
            output: "(function a(){ })();",
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {

            // Ensure all comments get preserved when autofixing.
            code: "( /* a */ function /* b */ foo /* c */ ( /* d */ bar /* e */ ) /* f */ { /* g */ return; /* h */ } /* i */ ( /* j */ baz /* k */) /* l */ ) /* m */ ;",
            output: "( /* a */ function /* b */ foo /* c */ ( /* d */ bar /* e */ ) /* f */ { /* g */ return; /* h */ }) /* i */ ( /* j */ baz /* k */) /* l */  /* m */ ;",
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "( /* a */ function /* b */ foo /* c */ ( /* d */ bar /* e */ ) /* f */ { /* g */ return; /* h */ } /* i */ ) /* j */ ( /* k */ baz /* l */) /* m */ ;",
            output: "( /* a */ function /* b */ foo /* c */ ( /* d */ bar /* e */ ) /* f */ { /* g */ return; /* h */ } /* i */  /* j */ ( /* k */ baz /* l */)) /* m */ ;",
            options: ["outside"],
            errors: [moveInvocationError]
        },
        {
            code: "+function(){return 1;}()",
            output: "+(function(){return 1;}())",
            options: ["outside"],
            errors: [wrapInvocationError]
        },
        {
            code: "+function(){return 1;}()",
            output: "+(function(){return 1;})()",
            options: ["inside"],
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = function() { return 3; }.call(this, arg1);",
            output: "window.bar = (function() { return 3; }).call(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = function() { return 3; }['call'](this, arg1);",
            output: "window.bar = (function() { return 3; })['call'](this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = function() { return 3; }.call(this, arg1);",
            output: "window.bar = (function() { return 3; }.call(this, arg1));",
            options: ["outside", { functionPrototypeMethods: true }],
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = (function() { return 3; }.call(this, arg1));",
            output: "window.bar = (function() { return 3; }).call(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "window.bar = (function() { return 3; }).call(this, arg1);",
            output: "window.bar = (function() { return 3; }.call(this, arg1));",
            options: ["outside", { functionPrototypeMethods: true }],
            errors: [moveInvocationError]
        }
    ]
});
