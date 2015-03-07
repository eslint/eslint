/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 * @copyright 2013-2014 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/strict", {
    valid: [

        // "deprecated" mode (default)
        "\"use strict\"; function foo () {  return; }",
        "'use strict'; function foo () {  return; }",
        "function foo () { \"use strict\"; return; }",
        "function foo () { \"use strict\"; function bar() {}; }",
        "function foo () { 'use strict'; return; }",
        "'use strict'; var foo = function () { bar(); };",
        "var foo = function () { 'use strict'; bar(); return; };",
        { code: "a = () => { 'use strict'; return true; }", ecmaFeatures: { arrowFunctions: true } },

        // "never" mode
        { code: "foo();", options: ["never"] },
        { code: "function foo() { return; }", options: ["never"] },
        { code: "var foo = function() { return; };", options: ["never"] },
        { code: "foo(); 'use strict';", options: ["never"] },
        { code: "function foo() { bar(); 'use strict'; return; }", options: ["never"] },
        { code: "var foo = function() { { 'use strict'; } return; };", options: ["never"] },
        { code: "(function() { bar('use strict'); return; }());", options: ["never"] },
        { code: "var fn = x => 1;", ecmaFeatures: { arrowFunctions: true }, options: ["never"] },
        { code: "foo();", ecmaFeatures: { modules: true }, options: ["never"] },

        // "global" mode
        { code: "// Intentionally empty", options: ["global"] },
        { code: "\"use strict\"; foo();", options: ["global"] },
        { code: "foo();", ecmaFeatures: { modules: true }, options: ["global"] },
        { code: "'use strict'; function foo() { return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { return; };", options: ["global"] },
        { code: "'use strict'; function foo() { bar(); 'use strict'; return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { bar(); 'use strict'; return; };", options: ["global"] },
        { code: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }", options: ["global"] },

        // "function" mode
        { code: "function foo() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { return; }", ecmaFeatures: { modules: true }, options: ["function"] },
        { code: "var foo = function() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };", options: ["function"] },
        { code: "var foo = function() { 'use strict'; function bar() { return; } bar(); };", options: ["function"] }

    ],
    invalid: [

        // "deprecated" mode (default)
        {
            code: "function foo() \n { \n return; }",
            errors: [
                { message: "Missing \"use strict\" statement.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { function bar() { 'use strict'; } }",
            errors: [
                { message: "Missing \"use strict\" statement.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { function bar() {} }",
            errors: [
                { message: "Missing \"use strict\" statement.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "var foo = function () { return; };",
            errors: [
                { message: "Missing \"use strict\" statement.", type: "FunctionExpression" }
            ]
        },

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
            ecmaFeatures: { modules: true },
            errors: [
                { message: "Unnecessary \"use strict\" directive.", type: "ExpressionStatement" }
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
            ecmaFeatures: { modules: true },
            errors: [
                { message: "Unnecessary \"use strict\" directive.", type: "ExpressionStatement" }
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
            ecmaFeatures: { arrowFunctions: true },
            errors: [{ message: "Missing \"use strict\" statement.", type: "ArrowFunctionExpression"}]
        }

    ]
});
