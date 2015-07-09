/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 * @copyright 2013 Michael Paulukonis. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/one-var", {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function() { var bar = true; baz(); }",
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "always"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "for (var i = 0, len = arr.length; i < len; i++) {}",
            args: [2, "never"]
        },
        {
            code: "var bar = true; var baz = false;",
            args: [2, {initialized: "never"}]
        },
        {
            code: "var bar = true, baz = false;",
            args: [2, {initialized: "always"}]
        },
        {
            code: "var bar, baz;",
            args: [2, {initialized: "never"}]
        },
        {
            code: "var bar; var baz;",
            args: [2, {uninitialized: "never"}]
        },
        {
            code: "var bar, baz;",
            args: [2, {uninitialized: "always"}]
        },
        {
            code: "var bar = true, baz = false;",
            args: [2, {uninitialized: "never"}]
        },
        {
            code: "var bar = true, baz = false, a, b;",
            args: [2, {uninitialized: "always", initialized: "always"}]
        },
        {
            code: "var bar = true; var baz = false; var a; var b;",
            args: [2, {uninitialized: "never", initialized: "never"}]
        },
        {
            code: "var bar, baz; var a = true; var b = false;",
            args: [2, {uninitialized: "always", initialized: "never"}]
        },
        {
            code: "var bar, baz; var a = true; var b = false;",
            args: [2, {uninitialized: "always", initialized: "never"}]
        },
        {
            code: "var bar = true, baz = false; var a; var b;",
            args: [2, {uninitialized: "never", initialized: "always"}]
        },
        {
            code: "var bar; var baz; var a = true, b = false;",
            args: [2, {uninitialized: "never", initialized: "always"}]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { let a = 1; var c = true; if (a) {let c = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { const a = 1; var c = true; if (a) {const c = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { if (true) { const a = 1; }; if (true) {const a = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1; let b = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { const a = 1; const b = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1, b = false; var c = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1; let b = 2; const c = false; const d = true; var e = true, f = false; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "never", const: "never"}]
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "always", const: "never"}]
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always"}]
        },
        {
            code: "let foo = true, bar = false;",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "never"}]
        },
        {
            code: "let foo = true, bar = false;",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {const: "never"}]
        },
        {
            code: "let foo = true, bar = false;",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {uninitialized: "never"}]
        },
        {
            code: "let foo, bar",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {initialized: "never"}]
        },
        {
            code: "let foo = true, bar = false; let a; let b;",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {uninitialized: "never"}]
        },
        {
            code: "let foo, bar; let a = true; let b = true;",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {initialized: "never"}]
        },
        "function foo() { var bar = true; var baz = false; }",
        "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
        "var foo = function() { var bar = true; var baz = false; }",
        {
            code: "var foo = () => { var bar = true; var baz = false; }",
            ecmaFeatures: {
                arrowFunctions: true
            }
        },
        "var foo = function() { var bar = true; if (qux) { var baz = false; } }",
        "var foo; var bar;",
        {
            code: "var foo, bar; const a=1; const b=2; let c, d",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, { var: "always", let: "always" }]
        },
        {
            code: "var foo; var bar; const a=1, b=2; let c; let d",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, { const: "always" }]
        },
        {
            code: "var foo, bar; const a=1; const b=2; let c, d",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, { var: "always", let: "always" }]
        }
    ],
    invalid: [
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var a = 1; for (var b = 2;;) {}",
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var foo = true, bar = false; }",
            args: [2, {initialized: "never"}],
            errors: [
                {
                    message: "Split initialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var foo, bar; }",
            args: [2, {uninitialized: "never"}],
            errors: [
                {
                    message: "Split uninitialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar, baz; var a = true; var b = false; var c, d;}",
            args: [2, {uninitialized: "always", initialized: "never"}],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with uninitialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a; var b; var c = true, d = false; }",
            args: [2, {uninitialized: "never", initialized: "always"}],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with initialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a, b;}",
            args: [2, {uninitialized: "never", initialized: "never"}],
            errors: [
                {
                    message: "Split 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Split 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true; var baz = false; var a; var b;}",
            args: [2, {uninitialized: "always", initialized: "always"}],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {let: "always"}],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {const: "always"}],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {let: "never"}],
            errors: [{
                message: "Split 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {initialized: "never"}],
            errors: [{
                message: "Split initialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a, b; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {uninitialized: "never"}],
            errors: [{
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {initialized: "never"}],
            errors: [{
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {const: "never"}],
            errors: [{
                message: "Split 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "let foo = true; switch(foo) { case true: let bar = 2; break; case false: let baz = 3; break; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "always", const: "never"}],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 74
            }]
        },
        {
            code: "var one = 1, two = 2;\nvar three;",
            options: [ "always" ],
            errors: [ {
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 2,
                column: 1
            } ]
        },
        {
            code: "var i = [0], j;",
            options: [ { "initialized": "never" } ],
            errors: [ {
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            } ]
        },
        {
            code: "var i = [0], j;",
            options: [ { "uninitialized": "never" } ],
            errors: [ {
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            } ]
        }
    ]
});
