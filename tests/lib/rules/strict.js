/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/strict"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

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
        { code: "var fn = x => 1;", options: ["never"], languageOptions: { ecmaVersion: 6 } },
        { code: "var fn = x => { return; };", options: ["never"], languageOptions: { ecmaVersion: 6 } },
        { code: "foo();", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { return; }", options: ["never"], languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },

        // "global" mode
        { code: "// Intentionally empty", options: ["global"] },
        { code: "\"use strict\"; foo();", options: ["global"] },
        { code: "foo();", options: ["global"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { return; }", options: ["global"], languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },
        { code: "'use strict'; function foo() { return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { return; };", options: ["global"] },
        { code: "'use strict'; function foo() { bar(); 'use strict'; return; }", options: ["global"] },
        { code: "'use strict'; var foo = function() { bar(); 'use strict'; return; };", options: ["global"] },
        { code: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }", options: ["global"] },
        { code: "'use strict'; var foo = () => { return () => { bar(); 'use strict'; return; }; }", options: ["global"], languageOptions: { ecmaVersion: 6 } },

        // "function" mode
        { code: "function foo() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { return; }", options: ["function"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { return; }", options: ["function"], languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },
        { code: "var foo = function() { return; }", options: ["function"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var foo = function() { 'use strict'; return; }", options: ["function"] },
        { code: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };", options: ["function"] },
        { code: "var foo = function() { 'use strict'; function bar() { return; } bar(); };", options: ["function"] },
        { code: "var foo = () => { 'use strict'; var bar = () => 1; bar(); };", options: ["function"], languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { var bar = () => 1; bar(); };", options: ["function"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        {
            code: "class A { constructor() { } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { foo() { } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { foo() { function bar() { } } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { } }())",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 }
        },


        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        { code: "function foo() { 'use strict'; return; }", options: ["safe"] },
        { code: "'use strict'; function foo() { return; }", options: ["safe"], languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } } },
        { code: "function foo() { return; }", options: ["safe"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { return; }", options: ["safe"], languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },

        // defaults to "safe" mode
        "function foo() { 'use strict'; return; }",
        { code: "'use strict'; function foo() { return; }", languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } } },
        { code: "function foo() { return; }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { return; }", languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },

        // class static blocks do not have directive prologues, therefore this rule should never require od disallow "use strict" statement in them.
        { code: "'use strict'; class C { static { foo; } }", options: ["global"], languageOptions: { ecmaVersion: 2022 } },
        { code: "'use strict'; class C { static { 'use strict'; } }", options: ["global"], languageOptions: { ecmaVersion: 2022 } },
        { code: "'use strict'; class C { static { 'use strict'; 'use strict'; } }", options: ["global"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo; } }", options: ["function"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { 'use strict'; } }", options: ["function"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { 'use strict'; 'use strict'; } }", options: ["function"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo; } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { 'use strict'; } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { 'use strict'; 'use strict'; } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { 'use strict'; } }", options: ["safe"], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "class C { static { 'use strict'; } }", options: ["safe"], languageOptions: { ecmaVersion: 2022, parserOptions: { ecmaFeatures: { impliedStrict: true } } } },
        {
            code: "'use strict'; module.exports = function identity (value) { return value; }",
            languageOptions: {
                sourceType: "commonjs"
            }
        },
        {
            code: "'use strict'; module.exports = function identity (value) { return value; }",
            options: ["safe"],
            languageOptions: {
                sourceType: "commonjs"
            }
        }

    ],
    invalid: [

        // "never" mode
        {
            code: "\"use strict\"; foo();",
            output: null,
            options: ["never"],
            errors: [
                { messageId: "never", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["never"],
            errors: [
                { messageId: "never", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; };",
            output: null,
            options: ["never"],
            errors: [
                { messageId: "never", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            output: null,
            options: ["never"],
            errors: [
                { messageId: "never", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { \"use strict\"; return; }",
            output: null,
            options: ["never"],
            errors: [
                { messageId: "never", type: "ExpressionStatement" },
                { messageId: "never", type: "ExpressionStatement" }
            ]
        }, {
            code: "\"use strict\"; foo();",
            output: " foo();",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "module", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["never"],
            languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "implied", type: "ExpressionStatement" },
                { messageId: "implied", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "module", type: "ExpressionStatement" },
                { messageId: "module", type: "ExpressionStatement" }
            ]
        },

        // "global" mode
        {
            code: "foo();",
            output: null,
            options: ["global"],
            errors: [
                { messageId: "global", type: "Program" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { messageId: "global", type: "Program" },
                { messageId: "global", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { messageId: "global", type: "Program" },
                { messageId: "global", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = () => { 'use strict'; return () => 1; }",
            output: null,
            options: ["global"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "global", type: "Program" },
                { messageId: "global", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: null,
            options: ["global"],
            errors: [
                { messageId: "global", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; var foo = function() { 'use strict'; return; };",
            output: null,
            options: ["global"],
            errors: [
                { messageId: "global", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; 'use strict'; foo();",
            output: "'use strict';  foo();",
            options: ["global"],
            errors: [
                { messageId: "multiple", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; foo();",
            output: " foo();",
            options: ["global"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "module", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["global"],
            languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "implied", type: "ExpressionStatement" },
                { messageId: "implied", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["global"],
            languageOptions: { ecmaVersion: 6, sourceType: "module", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "module", type: "ExpressionStatement" },
                { messageId: "module", type: "ExpressionStatement" }
            ]
        },

        // "function" mode
        {
            code: "'use strict'; foo();",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; (function() { 'use strict'; return true; }());",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { 'use strict'; function f() { 'use strict'; return } return true; }());",
            output: "(function() { 'use strict'; function f() {  return } return true; }());",
            options: ["function"],
            errors: [
                { messageId: "unnecessary", type: "ExpressionStatement" }
            ]
        }, {
            code: "(function() { return true; }());",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionExpression" }
            ]
        }, {
            code: "(() => { return true; })();",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "function", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "(() => true)();",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "function", type: "ArrowFunctionExpression" }
            ]
        }, {
            code: "var foo = function() { foo(); 'use strict'; return; }; function bar() { foo(); 'use strict'; }",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionExpression" },
                { messageId: "function", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; 'use strict'; return; }",
            output: "function foo() { 'use strict';  return; }",
            options: ["function"],
            errors: [
                { messageId: "multiple", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; 'use strict'; return; }",
            output: "var foo = function() { 'use strict';  return; }",
            options: ["function"],
            errors: [
                { messageId: "multiple", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() {  'use strict'; return; }",
            output: "var foo = function() {   return; }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "module", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["function"],
            languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "implied", type: "ExpressionStatement" },
                { messageId: "implied", type: "ExpressionStatement" }
            ]
        }, {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6, sourceType: "module", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "module", type: "ExpressionStatement" },
                { messageId: "module", type: "ExpressionStatement" }
            ]
        }, {
            code: "function foo() { return function() { 'use strict'; return; }; }",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionDeclaration" }
            ]
        }, {
            code: "var foo = function() { function bar() { 'use strict'; return; } return; }",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionExpression" }
            ]
        }, {
            code: "function foo() { 'use strict'; return; } var bar = function() { return; };",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionExpression" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; return; }; function bar() { return; };",
            output: null,
            options: ["function"],
            errors: [
                { messageId: "function", type: "FunctionDeclaration" }
            ]
        }, {
            code: "function foo() { 'use strict'; return function() { 'use strict'; 'use strict'; return; }; }",
            output: "function foo() { 'use strict'; return function() {   return; }; }",
            options: ["function"],
            errors: [
                { messageId: "unnecessary", type: "ExpressionStatement" },
                { messageId: "multiple", type: "ExpressionStatement" }
            ]
        }, {
            code: "var foo = function() { 'use strict'; function bar() { 'use strict'; 'use strict'; return; } }",
            output: "var foo = function() { 'use strict'; function bar() {   return; } }",
            options: ["function"],
            errors: [
                { messageId: "unnecessary", type: "ExpressionStatement" },
                { messageId: "multiple", type: "ExpressionStatement" }
            ]
        },
        {
            code: "var foo = () => { return; };",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "function", type: "ArrowFunctionExpression" }]
        },

        // Classes
        {
            code: "class A { constructor() { \"use strict\"; } }",
            output: "class A { constructor() {  } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryInClasses", type: "ExpressionStatement" }]
        },
        {
            code: "class A { foo() { \"use strict\"; } }",
            output: "class A { foo() {  } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryInClasses", type: "ExpressionStatement" }]
        },
        {
            code: "class A { foo() { function bar() { \"use strict\"; } } }",
            output: "class A { foo() { function bar() {  } } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryInClasses", type: "ExpressionStatement" }]
        },
        {
            code: "class A { field = () => { \"use strict\"; } }",
            output: "class A { field = () => {  } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessaryInClasses", type: "ExpressionStatement" }]
        },
        {
            code: "class A { field = function() { \"use strict\"; } }",
            output: "class A { field = function() {  } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessaryInClasses", type: "ExpressionStatement" }]
        },

        // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
        {
            code: "'use strict'; function foo() { return; }",
            output: null,
            options: ["safe"],
            errors: [
                { messageId: "function", type: "ExpressionStatement" },
                { messageId: "function", type: "FunctionDeclaration" }
            ]
        },
        {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            options: ["safe"],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "global", type: "Program" },
                { messageId: "global", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["safe"],
            languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "implied", type: "ExpressionStatement" },
                { messageId: "implied", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            options: ["safe"],
            languageOptions: { ecmaVersion: 6, sourceType: "module", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "module", type: "ExpressionStatement" },
                { messageId: "module", type: "ExpressionStatement" }
            ]
        },

        // Default to "safe" mode
        {
            code: "'use strict'; function foo() { return; }",
            output: null,
            errors: [
                { messageId: "function", type: "ExpressionStatement" },
                { messageId: "function", type: "FunctionDeclaration" }
            ]
        },
        {
            code: "function foo() { return; }",
            output: null,
            errors: [{ messageId: "function", type: "FunctionDeclaration" }]
        },
        {
            code: "function foo() { 'use strict'; return; }",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "global", type: "Program" },
                { messageId: "global", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "implied", type: "ExpressionStatement" },
                { messageId: "implied", type: "ExpressionStatement" }
            ]
        },
        {
            code: "'use strict'; function foo() { 'use strict'; return; }",
            output: " function foo() {  return; }",
            languageOptions: { ecmaVersion: 6, sourceType: "module", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [
                { messageId: "module", type: "ExpressionStatement" },
                { messageId: "module", type: "ExpressionStatement" }
            ]
        },

        // Reports deprecated syntax: https://github.com/eslint/eslint/issues/6405
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
            output: null,
            options: [],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                "Use the global form of 'use strict'.",
                { messageId: "nonSimpleParameterList" }
            ]
        },
        {
            code: "'use strict'; function foo(a = 0) { 'use strict' }",
            output: null,
            options: [],
            languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["never"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["global"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                "Use the global form of 'use strict'.",
                { messageId: "nonSimpleParameterList" }
            ]
        },
        {
            code: "'use strict'; function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["global"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "function foo(a = 0) { 'use strict' }",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nonSimpleParameterList" }]
        },
        {
            code: "function foo(a = 0) { }",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "wrap", data: { name: "function 'foo'" } }]
        },
        {
            code: "(function() { function foo(a = 0) { } }())",
            output: null,
            options: ["function"],
            languageOptions: { ecmaVersion: 6 },
            errors: ["Use the function form of 'use strict'."]
        },

        // functions inside class static blocks should be checked
        {
            code: "'use strict'; class C { static { function foo() { \n'use strict'; } } }",
            output: null,
            options: ["global"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "global", line: 2 }]
        },
        {
            code: "class C { static { function foo() { \n'use strict'; } } }",
            output: null,
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "never", line: 2 }]
        },
        {
            code: "class C { static { function foo() { \n'use strict'; } } }",
            output: "class C { static { function foo() { \n } } }",
            options: ["safe"],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [{ messageId: "module", line: 2 }]
        },
        {
            code: "class C { static { function foo() { \n'use strict'; } } }",
            output: "class C { static { function foo() { \n } } }",
            options: ["safe"],
            languageOptions: { ecmaVersion: 2022, parserOptions: { ecmaFeatures: { impliedStrict: true } } },
            errors: [{ messageId: "implied", line: 2 }]
        },
        {
            code: "function foo() {'use strict'; class C { static { function foo() { \n'use strict'; } } } }",
            output: "function foo() {'use strict'; class C { static { function foo() { \n } } } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessary", line: 2 }]
        },
        {
            code: "class C { static { function foo() { \n'use strict'; } } }",
            output: "class C { static { function foo() { \n } } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessaryInClasses", line: 2 }]
        },
        {
            code: "class C { static { function foo() { \n'use strict';\n'use strict'; } } }",
            output: "class C { static { function foo() { \n\n } } }",
            options: ["function"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "unnecessaryInClasses", line: 2 },
                { messageId: "multiple", line: 3 }
            ]
        },
        {
            code: "module.exports = function identity (value) { return value; }",
            output: null,
            options: ["safe"],
            languageOptions: {
                sourceType: "commonjs"
            },
            errors: [
                { messageId: "global", line: 1 }
            ]
        },
        {
            code: "module.exports = function identity (value) { return value; }",
            output: null,
            languageOptions: {
                sourceType: "commonjs"
            },
            errors: [
                { messageId: "global", line: 1 }
            ]
        }
    ]
});
