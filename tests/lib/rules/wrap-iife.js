/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/wrap-iife"),
    { RuleTester } = require("../../../lib/rule-tester");

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
            code: "var a = ((function(){return 1;})());", // always allows existing extra parens (parens both inside and outside)
            options: ["any"]
        },
        {
            code: "var a = ((function(){return 1;})());", // always allows existing extra parens (parens both inside and outside)
            options: ["inside"]
        },
        {
            code: "var a = ((function(){return 1;})());", // always allows existing extra parens (parens both inside and outside)
            options: ["outside"]
        },
        {
            code: "if (function (){}()) {}",
            options: ["any"]
        },
        {
            code: "while (function (){}()) {}",
            options: ["any"]
        },
        {
            code: "do {} while (function (){}())",
            options: ["any"]
        },
        {
            code: "switch (function (){}()) {}",
            options: ["any"]
        },
        {
            code: "with (function (){}()) {}",
            options: ["any"]
        },
        {
            code: "foo(function (){}());",
            options: ["any"]
        },
        {
            code: "new foo(function (){}());",
            options: ["any"]
        },
        {
            code: "import(function (){}());",
            options: ["any"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if ((function (){})()) {}",
            options: ["any"]
        },
        {
            code: "while (((function (){})())) {}",
            options: ["any"]
        },
        {
            code: "if (function (){}()) {}",
            options: ["outside"]
        },
        {
            code: "while (function (){}()) {}",
            options: ["outside"]
        },
        {
            code: "do {} while (function (){}())",
            options: ["outside"]
        },
        {
            code: "switch (function (){}()) {}",
            options: ["outside"]
        },
        {
            code: "with (function (){}()) {}",
            options: ["outside"]
        },
        {
            code: "foo(function (){}());",
            options: ["outside"]
        },
        {
            code: "new foo(function (){}());",
            options: ["outside"]
        },
        {
            code: "import(function (){}());",
            options: ["outside"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if ((function (){})()) {}",
            options: ["outside"]
        },
        {
            code: "while (((function (){})())) {}",
            options: ["outside"]
        },
        {
            code: "if ((function (){})()) {}",
            options: ["inside"]
        },
        {
            code: "while ((function (){})()) {}",
            options: ["inside"]
        },
        {
            code: "do {} while ((function (){})())",
            options: ["inside"]
        },
        {
            code: "switch ((function (){})()) {}",
            options: ["inside"]
        },
        {
            code: "with ((function (){})()) {}",
            options: ["inside"]
        },
        {
            code: "foo((function (){})());",
            options: ["inside"]
        },
        {
            code: "new foo((function (){})());",
            options: ["inside"]
        },
        {
            code: "import((function (){})());",
            options: ["inside"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "while (((function (){})())) {}",
            options: ["inside"]
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
            options: ["inside", {}]
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
        },
        {
            code: "var a = ((function(){return 1;}).call());", // always allows existing extra parens (parens both inside and outside)
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "var a = ((function(){return 1;}).call());", // always allows existing extra parens (parens both inside and outside)
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "var a = ((function(){return 1;}).call());", // always allows existing extra parens (parens both inside and outside)
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "if (function (){}.call()) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "while (function (){}.call()) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "do {} while (function (){}.call())",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "switch (function (){}.call()) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "with (function (){}.call()) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "foo(function (){}.call())",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "new foo(function (){}.call())",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "import(function (){}.call())",
            options: ["any", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if ((function (){}).call()) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "while (((function (){}).call())) {}",
            options: ["any", { functionPrototypeMethods: true }]
        },
        {
            code: "if (function (){}.call()) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "while (function (){}.call()) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "do {} while (function (){}.call())",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "switch (function (){}.call()) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "with (function (){}.call()) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "foo(function (){}.call())",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "new foo(function (){}.call())",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "import(function (){}.call())",
            options: ["outside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if ((function (){}).call()) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "while (((function (){}).call())) {}",
            options: ["outside", { functionPrototypeMethods: true }]
        },
        {
            code: "if ((function (){}).call()) {}",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "while ((function (){}).call()) {}",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "do {} while ((function (){}).call())",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "switch ((function (){}).call()) {}",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "with ((function (){}).call()) {}",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "foo((function (){}).call())",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "new foo((function (){}).call())",
            options: ["inside", { functionPrototypeMethods: true }]
        },
        {
            code: "import((function (){}).call())",
            options: ["inside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (((function (){}).call())) {}",
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
            code: "new foo((function (){}()))",
            output: "new foo((function (){})())",
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "new (function (){}())",
            output: "new ((function (){})())", // wrap function expression, but don't remove necessary grouping parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "new (function (){}())()",
            output: "new ((function (){})())()", // wrap function expression, but don't remove necessary grouping parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "if (function (){}()) {}",
            output: "if ((function (){})()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "if ((function (){}())) {}",
            output: "if ((function (){})()) {}", // wrap function expression and remove unnecessary grouping parens aroung the call expression
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "while (function (){}()) {}",
            output: "while ((function (){})()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "do {} while (function (){}())",
            output: "do {} while ((function (){})())", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "switch (function (){}()) {}",
            output: "switch ((function (){})()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "with (function (){}()) {}",
            output: "with ((function (){})()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "foo(function (){}())",
            output: "foo((function (){})())", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "new foo(function (){}())",
            output: "new foo((function (){})())", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            errors: [wrapExpressionError]
        },
        {
            code: "import(function (){}())",
            output: "import((function (){})())", // wrap function expression, but don't remove mandatory parens
            options: ["inside"],
            parserOptions: { ecmaVersion: 2020 },
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
        },
        {
            code: "new (function (){}.call())",
            output: "new ((function (){}).call())", // wrap function expression, but don't remove necessary grouping parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "new (function (){}.call())()",
            output: "new ((function (){}).call())()", // wrap function expression, but don't remove necessary grouping parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "if (function (){}.call()) {}",
            output: "if ((function (){}).call()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "if ((function (){}.call())) {}",
            output: "if ((function (){}).call()) {}", // wrap function expression and remove unnecessary grouping parens aroung the call expression
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "while (function (){}.call()) {}",
            output: "while ((function (){}).call()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "do {} while (function (){}.call())",
            output: "do {} while ((function (){}).call())", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "switch (function (){}.call()) {}",
            output: "switch ((function (){}).call()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "with (function (){}.call()) {}",
            output: "with ((function (){}).call()) {}", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "foo(function (){}.call())",
            output: "foo((function (){}).call())", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "new foo(function (){}.call())",
            output: "new foo((function (){}).call())", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            errors: [wrapExpressionError]
        },
        {
            code: "import(function (){}.call())",
            output: "import((function (){}).call())", // wrap function expression, but don't remove mandatory parens
            options: ["inside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [wrapExpressionError]
        },

        // Optional chaining
        {
            code: "window.bar = function() { return 3; }.call?.(this, arg1);",
            output: "window.bar = (function() { return 3; }).call?.(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = function() { return 3; }?.call(this, arg1);",
            output: "window.bar = (function() { return 3; })?.call(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [wrapInvocationError]
        },
        {
            code: "window.bar = (function() { return 3; }?.call)(this, arg1);",
            output: "window.bar = ((function() { return 3; })?.call)(this, arg1);",
            options: ["inside", { functionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [wrapInvocationError]
        },
        {
            code: "new (function () {} ?.());",
            output: "new ((function () {}) ?.());",
            options: ["inside"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [wrapExpressionError]
        }
    ]
});
