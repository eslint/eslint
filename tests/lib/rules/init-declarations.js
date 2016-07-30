/**
 * @fileoverview A rule to control the style of variable initializations.
 * @author Colin Ihrig
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/init-declarations"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("init-declarations", rule, {
    valid: [
        "var foo = null;",
        "foo = true;",
        "var foo = 1, bar = false, baz = {};",
        "function foo() { var foo = 0; var bar = []; }",
        "var fn = function() {};",
        "var foo = bar = 2;",
        "for (var i = 0; i < 1; i++) {}",
        "for (var foo in []) {}",
        {code: "for (var foo of []) {}", parserOptions: { ecmaVersion: 6 }},
        {
            code: "let a = true;",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "const a = {};",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1, b = false; if (a) { let c = 3, d = null; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "var foo;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "var foo, bar, baz;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "function foo() { var foo; var bar; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "let a;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "const a = 1;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "function foo() { let a, b; if (a) { let c, d; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "function foo() { let a; const b = false; var c; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "for(var i = 0; i < 1; i++){}",
            options: ["never", { ignoreForLoopInit: true }]
        },
        {
            code: "for (var foo in []) {}",
            options: ["never", { ignoreForLoopInit: true }]
        },
        {
            code: "for (var foo of []) {}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never", { ignoreForLoopInit: true }]
        }
    ],
    invalid: [
        {
            code: "var foo;",
            options: ["always"],
            errors: [
                {
                    message: "Variable 'foo' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "for (var a in []) var foo;",
            options: ["always"],
            errors: [
                {
                    message: "Variable 'foo' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo, bar = false, baz;",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'foo' should be initialized on declaration.",
                    type: "VariableDeclarator"
                },
                {
                    message: "Variable 'baz' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { var foo = 0; var bar; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'bar' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { var foo; var bar = foo; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'foo' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "let a;",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'a' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a = 1, b; if (a) { let c = 3, d = null; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'b' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a; const b = false; var c; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                {
                    message: "Variable 'a' should be initialized on declaration.",
                    type: "VariableDeclarator"
                },
                {
                    message: "Variable 'c' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = bar = 2;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = true;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo, bar = 5, baz = 3;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'bar' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                },
                {
                    message: "Variable 'baz' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { var foo; var bar = foo; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'bar' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "let a = 1;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'a' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a = 'foo', b; if (a) { let c, d; } }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'a' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a; const b = false; var c = 1; }",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'c' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "for(var i = 0; i < 1; i++){}",
            options: ["never"],
            errors: [
                {
                    message: "Variable 'i' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "for (var foo in []) {}",
            options: ["never"],
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "for (var foo of []) {}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        }
    ]
});
