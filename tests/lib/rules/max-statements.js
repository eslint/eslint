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
            errors: [{ message: "Function 'foo' has too many statements (3). Maximum allowed is 2." }]
        },
        {
            code: "var foo = () => { var bar = 1; var baz = 2; var qux = 3; };",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Arrow function has too many statements (3). Maximum allowed is 2." }]
        },
        {
            code: "var foo = function() { var bar = 1; var baz = 2; var qux = 3; };",
            options: [2],
            errors: [{ message: "Function has too many statements (3). Maximum allowed is 2." }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { while (false) { var qux = null; } } return 3; }",
            options: [4],
            errors: [{ message: "Function 'foo' has too many statements (5). Maximum allowed is 4." }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } return 3; }",
            options: [4],
            errors: [{ message: "Function 'foo' has too many statements (5). Maximum allowed is 4." }]
        },
        {
            code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }",
            options: [5],
            errors: [{ message: "Function 'foo' has too many statements (6). Maximum allowed is 5." }]
        },
        {
            code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",
            options: [3],
            errors: [{ message: "Function 'foo' has too many statements (5). Maximum allowed is 3." }]
        },
        {
            code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }",
            options: [4],
            errors: [{ message: "Function 'foo' has too many statements (5). Maximum allowed is 4." }]
        },
        {
            code: ";(function() { var bar = 1; return function () { var z; return 42; }; })()",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [{ message: "Function has too many statements (2). Maximum allowed is 1." }]
        },
        {
            code: ";(function() { var bar = 1; var baz = 2; })(); (function() { var bar = 1; var baz = 2; })()",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [
                { message: "Function has too many statements (2). Maximum allowed is 1." },
                { message: "Function has too many statements (2). Maximum allowed is 1." }
            ]
        },
        {
            code: "define(['foo', 'qux'], function(foo, qux) { var bar = 1; var baz = 2; return function () { var z; return 42; }; })",
            options: [1, { ignoreTopLevelFunctions: true }],
            errors: [{ message: "Function has too many statements (2). Maximum allowed is 1." }]
        },
        {
            code: "function foo() { var a; var b; var c; var x; var y; var z; bar(); baz(); qux(); quxx(); foo(); }",
            errors: [{ message: "Function 'foo' has too many statements (11). Maximum allowed is 10." }]
        },

        // object property options
        {
            code: "var foo = { thing: function() { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            errors: [{ message: "Method 'thing' has too many statements (3). Maximum allowed is 2." }]
        },
        {
            code: "var foo = { thing() { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Method 'thing' has too many statements (3). Maximum allowed is 2." }]
        },

        /*
         * TODO decide if we want this or not
         * {
         *     code: "var foo = { ['thing']() { var bar = 1; var baz = 2; var baz2; } }",
         *     options: [2],
         *     parserOptions: { ecmaVersion: 6 },
         *     errors: [{ message: "Method ''thing'' has too many statements (3). Maximum allowed is 2." }]
         * },
         */

        {
            code: "var foo = { thing: () => { var bar = 1; var baz = 2; var baz2; } }",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Arrow function 'thing' has too many statements (3). Maximum allowed is 2." }]
        },
        {
            code: "var foo = { thing: function() { var bar = 1; var baz = 2; var baz2; } }",
            options: [{ max: 2 }],
            errors: [{ message: "Method 'thing' has too many statements (3). Maximum allowed is 2." }]
        }
    ]
});
