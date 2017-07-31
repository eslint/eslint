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
        { code: "for (var foo of []) {}", parserOptions: { ecmaVersion: 6 } },
        {
            code: "let a = true;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = {};",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1, b = false; if (a) { let c = 3, d = null; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo, bar, baz;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { var foo; var bar; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 1;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a, b; if (a) { let c, d; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() { let a; const b = false; var c; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["never", { ignoreForLoopInit: true }],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'bar' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { var foo; var bar = foo; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'foo' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "let a;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'a' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a = 1, b; if (a) { let c = 3, d = null; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'b' should be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a; const b = false; var c; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = true;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo, bar = 5, baz = 3;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'bar' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "let a = 1;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'a' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a = 'foo', b; if (a) { let c, d; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'a' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() { let a; const b = false; var c = 1; }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Variable 'foo' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        }
    ]
});
