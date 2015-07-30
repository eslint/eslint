/**
 * @fileoverview A rule to control the style of variable initializations.
 * @author Colin Ihrig
 * @copyright 2015 Colin Ihrig. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/init-declarations", {
    valid: [
        "var foo = null;",
        "foo = true;",
        "var foo = 1, bar = false, baz = {};",
        "function foo() { var foo = 0; var bar = []; }",
        "var fn = function() {};",
        "var foo = bar = 2;",
        "for (var foo in []) {}",
        {code: "for (var foo of []) {}", ecmaFeatures: {forOf: true}},
        {
            code: "let a = true;",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["always"]
        },
        {
            code: "const a = {};",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1, b = false; if (a) { let c = 3, d = null; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["always"]
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["always"]
        },
        {
            code: "var foo;",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "var foo, bar, baz;",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "function foo() { var foo; var bar; }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "let a;",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "const a = 1;",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "function foo() { let a, b; if (a) { let c, d; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
        },
        {
            code: "function foo() { let a; const b = false; var c; }",
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"]
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
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
            ecmaFeatures: {
                blockBindings: true
            },
            options: ["never"],
            errors: [
                {
                    message: "Variable 'c' should not be initialized on declaration.",
                    type: "VariableDeclarator"
                }
            ]
        }
    ]
});
