/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 * @copyright 2013-2014 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/strict"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("strict", rule, {
    valid: [

        // "never" mode
        { code: "foo();", options: ["never"] },
        { code: "function foo() { return; }", options: ["never"] },
        { code: "var foo = function() { return; };", options: ["never"] },
        { code: "foo(); 'use strict';", options: ["never"] },
        { code: "function foo() { bar(); 'use strict'; return; }", options: ["never"] },
        { code: "var foo = function() { { 'use strict'; } return; };", options: ["never"] },
        { code: "(function() { bar('use strict'); return; }());", options: ["never"] },
        { code: "var fn = x => 1;", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var fn = x => { return; };", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "foo();", parserOptions: { sourceType: "module" }, options: ["never"] },

        // "global" mode
        { code: "// Intentionally empty", options: ["global"] },
        { code: "\"use strict\"; foo();", options: ["global"] },
        { code: "foo();", parserOptions: { sourceType: "module" }, options: ["global"] },
        { code: "'use strict'; function foo() { return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { return; };", options: ["global"] },
        { code: "'use strict'; function foo() { bar(); 'use strict'; return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { bar(); 'use strict'; return; };", options: ["global"] },
        { code: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }", options: ["global"] },
        { code: "'use strict'; var foo = () => { return () => { bar(); 'use strict'; return; }; }", parserOptions: { ecmaVersion: 6 }, options: ["global"] },

        // "function" mode
        { code: "function foo() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { return; }", parserOptions: { sourceType: "module" }, options: ["function"] },
        { code: "var foo = function() { return; }", parserOptions: { sourceType: "module" }, options: ["function"] },
        { code: "var foo = function() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };", options: ["function"] },
        { code: "var foo = function() { 'use strict'; function bar() { return; } bar(); };", options: ["function"] },
        { code: "var foo = () => { 'use strict'; var bar = () => 1; bar(); };", parserOptions: { ecmaVersion: 6 }, options: ["function"] },
        { code: "var foo = () => { var bar = () => 1; bar(); };", parserOptions: { ecmaVersion: 6, sourceType: "module" }, options: ["function"] },
        {
            code: "class A { constructor() { } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"]
        },
        {
            code: "class A { foo() { } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"]
        },
        {
            code: "class A { foo() { function bar() { } } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"]
        },

        // defaults to "function" mode
        { code: "function foo() { 'use strict'; return; }" },

        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        { code: "function foo() { 'use strict'; return; }", options: ["safe"] },
        { code: "'use strict'; function foo() { return; }", parserOptions: { ecmaFeatures: { globalReturn: true } }, options: ["safe"] }

    ],
    invalid: [

        // "never" mode
        {
            code: "\"use strict\"; foo();",
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; };",
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { \"use strict\"; return; }",
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" },
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        },

        // "global" mode
        {
            code: "foo();",
            options: ["global"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "Program" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            options: ["global"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "Program" },
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }",
            options: ["global"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "Program" },
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = () => { 'use strict'; return () => 1; }",
            options: ["global"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the global form of \"use strict\".", type: "Program" },
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            options: ["global"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; var foo = function() { 'use strict'; return; };",
            options: ["global"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; 'use strict'; foo();",
            options: ["global"],
            errors: [
                { message: "Multiple \"use strict\" directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; foo();",
            options: ["global"],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "\"use strict\" is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        },

        // "function" mode
        {
            code: "'use strict'; foo();",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; (function() { 'use strict'; return true; }());",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { 'use strict'; function f() { 'use strict'; return } return true; }());",
            options: ["function"],
            errors: [
                { message: "Unnecessary \"use strict\" directive.", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { return true; }());",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionExpression" }
            ]
        }, {
            code: "(() => { return true; })();",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "(() => true)();",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "var foo = function() { foo(); 'use strict'; return; }; function bar() { foo(); 'use strict'; }",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionExpression" },
                { message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; 'use strict'; return; }",
            options: ["function"],
            errors: [
                { message: "Multiple \"use strict\" directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; 'use strict'; return; }",
            options: ["function"],
            errors: [
                { message: "Multiple \"use strict\" directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() {  'use strict'; return; }",
            options: ["function"],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "\"use strict\" is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }
            ]
        }, {
            code: "var foo = function() { function bar() { 'use strict'; return; } return; }",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionExpression" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; } var bar = function() { return; };",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionExpression" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }; function bar() { return; };",
            options: ["function"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; return function() { 'use strict'; 'use strict'; return; }; }",
            options: ["function"],
            errors: [
                { message: "Unnecessary \"use strict\" directive.", type: "ExpressionStatement" },
                { message: "Multiple \"use strict\" directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; function bar() { 'use strict'; 'use strict'; return; } }",
            options: ["function"],
            errors: [
                { message: "Unnecessary \"use strict\" directive.", type: "ExpressionStatement" },
                { message: "Multiple \"use strict\" directives.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "var foo = () => { return; };",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"],
            errors: [{ message: "Use the function form of \"use strict\".", type: "ArrowFunctionExpression"}]
        },
        // Classes
        {
            code: "class A { constructor() { \"use strict\"; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"],
            errors: [{ message: "\"use strict\" is unnecessary inside of classes.", type: "ExpressionStatement"}]
        },
        {
            code: "class A { foo() { \"use strict\"; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"],
            errors: [{ message: "\"use strict\" is unnecessary inside of classes.", type: "ExpressionStatement"}]
        },
        {
            code: "class A { foo() { function bar() { \"use strict\"; } } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["function"],
            errors: [{ message: "\"use strict\" is unnecessary inside of classes.", type: "ExpressionStatement"}]
        },


        // Default to "function" mode
        {
            code: "'use strict'; function foo() { return; }",
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ExpressionStatement" },
                { message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { return; }",
            errors: [{ message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }]
        },

        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        {
            code: "'use strict'; function foo() { return; }",
            options: ["safe"],
            errors: [
                { message: "Use the function form of \"use strict\".", type: "ExpressionStatement" },
                { message: "Use the function form of \"use strict\".", type: "FunctionDeclaration" }
            ]
        },
        {
            code: "function foo() { 'use strict'; return; }",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            options: ["safe"],
            errors: [
                { message: "Use the global form of \"use strict\".", type: "Program" },
                { message: "Use the global form of \"use strict\".", type: "ExpressionStatement" }
            ]
        }

    ]
});
