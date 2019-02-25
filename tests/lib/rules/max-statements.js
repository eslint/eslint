/**
 * @fileoverview Tests for max-statements rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-statements"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-statements", rule, {
    valid: [
        { code: "function foo() { var bar = 1; function qux () { var noCount = 2; } return 3; }", options: [3] },
        { code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }", options: [6] },
        { code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }", options: [5] },
        "function foo() { var a; var b; var c; var x; var y; var z; bar(); baz(); qux(); quxx(); }",
        { code: "(function() { var bar = 1; return function () { return 42; }; })()", options: [1, { ignoreTopLevelFunctions: true }] },
        { code: "function foo() { var bar = 1; var baz = 2; }", options: [1, { ignoreTopLevelFunctions: true }] },
        { code: "define(['foo', 'qux'], function(foo, qux) { var bar = 1; var baz = 2; })", options: [1, { ignoreTopLevelFunctions: true }] },

        // object property options
        { code: "var foo = { thing: function() { var bar = 1; var baz = 2; } }", options: [2] },
        { code: "var foo = { thing() { var bar = 1; var baz = 2; } }", options: [2], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = { ['thing']() { var bar = 1; var baz = 2; } }", options: [2], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = { thing: () => { var bar = 1; var baz = 2; } }", options: [2], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = { thing: function() { var bar = 1; var baz = 2; } }", options: [{ max: 2 }] }
    ],
    invalid: [
        {
            code: "function foo() { var bar = 1; var baz = 2; var qux = 3; }",
            options: [2],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "3", max: 2 } }]
        },
        {
            code: "var foo = () => { var bar = 1; var baz = 2; var qux = 3; };",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "exceed", data: { name: "Arrow function", count: "3", max: 2 } }]
        },
        {
            code: "var foo = function() { var bar = 1; var baz = 2; var qux = 3; };",
            options: [2],
            errors: [{ messageId: "exceed", data: { name: "Function", count: "3", max: 2 } }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { while (false) { var qux = null; } } return 3; }",
            options: [4],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "5", max: 4 } }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } return 3; }",
            options: [4],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "5", max: 4 } }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }",
            options: [5],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "6", max: 5 } }]
        },
        {
            code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",
            options: [3],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "5", max: 3 } }]
        },
        {
            code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",
            options: [4],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "5", max: 4 } }]
        },
        {
            code: ";(function() { var bar = 1; return function () { var z; return 42; }; })()",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [{ messageId: "exceed", data: { name: "Function", count: "2", max: 1 } }]
        },
        {
            code: ";(function() { var bar = 1; var baz = 2; })(); (function() { var bar = 1; var baz = 2; })()",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [
                { messageId: "exceed", data: { name: "Function", count: "2", max: 1 } },
                { messageId: "exceed", data: { name: "Function", count: "2", max: 1 } }
            ]
        },
        {
            code: "define(['foo', 'qux'], function(foo, qux) { var bar = 1; var baz = 2; return function () { var z; return 42; }; })",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [{ messageId: "exceed", data: { name: "Function", count: "2", max: 1 } }]
        },
        {
            code: "function foo() { var a; var b; var c; var x; var y; var z; bar(); baz(); qux(); quxx(); foo(); }",
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: "11", max: 10 } }]
        },

        // object property options
        {
            code: "var foo = { thing: function() { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            errors: [{ messageId: "exceed", data: { name: "Method 'thing'", count: "3", max: 2 } }]
        },
        {
            code: "var foo = { thing() { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "exceed", data: { name: "Method 'thing'", count: "3", max: 2 } }]
        },

        /*
         * TODO decide if we want this or not
         * {
         *     code: "var foo = { ['thing']() { var bar = 1; var baz = 2; var baz2; } }",
         *     options: [2],
         *     parserOptions: { ecmaVersion: 6 },
         *     errors: [{ messageId: "exceed", data: {name: "Method ''thing''", count: "3", max: 2} }]
         * },
         */

        {
            code: "var foo = { thing: () => { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "exceed", data: { name: "Arrow function 'thing'", count: "3", max: 2 } }]
        },
        {
            code: "var foo = { thing: function() { var bar = 1; var baz = 2; var baz2; } }",
            options: [{ max: 2 }],
            errors: [{ messageId: "exceed", data: { name: "Method 'thing'", count: "3", max: 2 } }]
        },
        {
            code: "function foo() { 1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 11; }",
            options: [{}],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: 11, max: 10 } }]
        },
        {
            code: "function foo() { 1; }",
            options: [{ max: 0 }],
            errors: [{ messageId: "exceed", data: { name: "Function 'foo'", count: 1, max: 0 } }]
        }
    ]
});
