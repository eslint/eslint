/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/strict"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

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
        { code: "var fn = x => 1;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var fn = x => { return; };", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "foo();", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "function foo() { return; }", options: ["never"], parserOptions: { ecmaFeatures: { impliedStrict: true } } },

        // "global" mode
        { code: "// Intentionally empty", options: ["global"] },
        { code: "\"use strict\"; foo();", options: ["global"] },
        { code: "foo();", options: ["global"], parserOptions: { sourceType: "module" } },
        { code: "function foo() { return; }", options: ["global"], parserOptions: { ecmaFeatures: { impliedStrict: true } } },
        { code: "'use strict'; function foo() { return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { return; };", options: ["global"] },
        { code: "'use strict'; function foo() { bar(); 'use strict'; return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { bar(); 'use strict'; return; };", options: ["global"] },
        { code: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }", options: ["global"] },
        { code: "'use strict'; var foo = () => { return () => { bar(); 'use strict'; return; }; }", options: ["global"], parserOptions: { ecmaVersion: 6 } },

        // "function" mode
        { code: "function foo() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { return; }", options: ["function"], parserOptions: { sourceType: "module" } },
        { code: "function foo() { return; }", options: ["function"], parserOptions: { ecmaFeatures: { impliedStrict: true } } },
        { code: "var foo = function() { return; }", options: ["function"], parserOptions: { sourceType: "module" } },
        { code: "var foo = function() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };", options: ["function"] },
        { code: "var foo = function() { 'use strict'; function bar() { return; } bar(); };", options: ["function"] },
        { code: "var foo = () => { 'use strict'; var bar = () => 1; bar(); };", options: ["function"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { var bar = () => 1; bar(); };", options: ["function"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        {
            code: "class A { constructor() { } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { foo() { } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { foo() { function bar() { } } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { } }())",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 }
        },


        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        { code: "function foo() { 'use strict'; return; }", options: ["safe"] },
        { code: "'use strict'; function foo() { return; }", options: ["safe"], parserOptions: { ecmaFeatures: { globalReturn: true } } },
        { code: "function foo() { return; }", options: ["safe"], parserOptions: { sourceType: "module" } },
        { code: "function foo() { return; }", options: ["safe"], parserOptions: { ecmaFeatures: { impliedStrict: true } } },

        // defaults to "safe" mode
        "function foo() { 'use strict'; return; }",
        { code: "'use strict'; function foo() { return; }", parserOptions: { ecmaFeatures: { globalReturn: true } } },
        { code: "function foo() { return; }", parserOptions: { sourceType: "module" } },
        { code: "function foo() { return; }", parserOptions: { ecmaFeatures: { impliedStrict: true } } }

    ],
    invalid: [

        // "never" mode
        {
            code: "\"use strict\"; foo();",
            output: null,
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; };",
            output: null,
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            output: null,
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { \"use strict\"; return; }",
            output: null,
            options: ["never"],
            errors: [
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" },
                { message: "Strict mode is not permitted.", type: "ExpressionStatement" }
            ]
        }, {
            code: "\"use strict\"; foo();",
            output: " foo();",
            options: ["never"],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["never"],
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["never"],
            parserOptions: { sourceType: "module", ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        },

        // "global" mode
        {
            code: "foo();",
            output: null,
            options: ["global"],
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" },
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" },
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = () => { 'use strict'; return () => 1; }",
            output: null,
            options: ["global"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" },
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; var foo = function() { 'use strict'; return; };",
            output: null,
            options: ["global"],
            errors: [
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; 'use strict'; foo();",
            output: "'use strict';  foo();",
            options: ["global"],
            errors: [
                { message: "Multiple 'use strict' directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; foo();",
            output: " foo();",
            options: ["global"],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["global"],
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["global"],
            parserOptions: { sourceType: "module", ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        },

        // "function" mode
        {
            code: "'use strict'; foo();",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; (function() { 'use strict'; return true; }());",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { 'use strict'; function f() { 'use strict'; return } return true; }());",
            output: "(function() { 'use strict'; function f() {  return } return true; }());",
            options: ["function"],
            errors: [
                { message: "Unnecessary 'use strict' directive.", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { return true; }());",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionExpression" }
            ]
        }, {
            code: "(() => { return true; })();",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "(() => true)();",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "var foo = function() { foo(); 'use strict'; return; }; function bar() { foo(); 'use strict'; }",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionExpression" },
                { message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; 'use strict'; return; }",
            output: "function foo() { 'use strict';  return; }",
            options: ["function"],
            errors: [
                { message: "Multiple 'use strict' directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; 'use strict'; return; }",
            output: "var foo = function() { 'use strict';  return; }",
            options: ["function"],
            errors: [
                { message: "Multiple 'use strict' directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() {  'use strict'; return; }",
            output: "var foo = function() {   return; }",
            options: ["function"],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["function"],
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["function"],
            parserOptions: { sourceType: "module", ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "var foo = function() { function bar() { 'use strict'; return; } return; }",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionExpression" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; } var bar = function() { return; };",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionExpression" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }; function bar() { return; };",
            output: null,
            options: ["function"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; return function() { 'use strict'; 'use strict'; return; }; }",
            output: "function foo() { 'use strict'; return function() {   return; }; }",
            options: ["function"],
            errors: [
                { message: "Unnecessary 'use strict' directive.", type: "ExpressionStatement" },
                { message: "Multiple 'use strict' directives.", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; function bar() { 'use strict'; 'use strict'; return; } }",
            output: "var foo = function() { 'use strict'; function bar() {   return; } }",
            options: ["function"],
            errors: [
                { message: "Unnecessary 'use strict' directive.", type: "ExpressionStatement" },
                { message: "Multiple 'use strict' directives.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "var foo = () => { return; };",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Use the function form of 'use strict'.", type: "ArrowFunctionExpression" }]
        },

        // Classes
        {
            code: "class A { constructor() { \"use strict\"; } }",
            output: "class A { constructor() {  } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'use strict' is unnecessary inside of classes.", type: "ExpressionStatement" }]
        },
        {
            code: "class A { foo() { \"use strict\"; } }",
            output: "class A { foo() {  } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'use strict' is unnecessary inside of classes.", type: "ExpressionStatement" }]
        },
        {
            code: "class A { foo() { function bar() { \"use strict\"; } } }",
            output: "class A { foo() { function bar() {  } } }",
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'use strict' is unnecessary inside of classes.", type: "ExpressionStatement" }]
        },


        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        {
            code: "'use strict'; function foo() { return; }",
            output: null,
            options: ["safe"],
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ExpressionStatement" },
                { message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }
            ]
        },
        {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["safe"],
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" },
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["safe"],
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["safe"],
            parserOptions: { sourceType: "module", ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        },

        // Default to "safe" mode
        {
            code: "'use strict'; function foo() { return; }",
            output: null,
            errors: [
                { message: "Use the function form of 'use strict'.", type: "ExpressionStatement" },
                { message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }
            ]
        },
        {
            code: "function foo() { return; }",
            output: null,
            errors: [{ message: "Use the function form of 'use strict'.", type: "FunctionDeclaration" }]
        },
        {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Use the global form of 'use strict'.", type: "Program" },
                { message: "Use the global form of 'use strict'.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary when implied strict mode is enabled.", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            parserOptions: { sourceType: "module", ecmaFeatures: { impliedStrict: true } },
            errors: [
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" },
                { message: "'use strict' is unnecessary inside of modules.", type: "ExpressionStatement" }
            ]
        },

        // Reports deprecated syntax: https://github.com/eslint/eslint/issues/6405
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
            output: null,
            options: [],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Use the global form of 'use strict'.",
                "'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."
            ]
        },
        {
            code: "'use strict'; function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["global"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                "Use the global form of 'use strict'.",
                "'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."
            ]
        },
        {
            code: "'use strict'; function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["global"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["'use strict' directive inside a function with non-simple parameter list throws a syntax error since ES2016."]
        },
        {
            code: "function foo(a = 0) { }",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["Wrap function 'foo' in a function with 'use strict' directive."]
        },
        {
            code: "(function() { function foo(a = 0) { } }())",
            output: null,
            options: ["function"],
            parserOptions: { ecmaVersion: 6 },
            errors: ["Use the function form of 'use strict'."]
        }

    ]
});
