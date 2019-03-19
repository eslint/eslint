/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/one-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("one-var", rule, {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function() { var bar = true; baz(); }",
        {
            code: "function foo() { var bar = true, baz = false; }",
            options: ["always"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            options: ["never"]
        },
        {
            code: "for (var i = 0, len = arr.length; i < len; i++) {}",
            options: ["never"]
        },
        {
            code: "var bar = true; var baz = false;",
            options: [{ initialized: "never" }]
        },
        {
            code: "var bar = true, baz = false;",
            options: [{ initialized: "always" }]
        },
        {
            code: "var bar, baz;",
            options: [{ initialized: "never" }]
        },
        {
            code: "var bar; var baz;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "var bar, baz;",
            options: [{ uninitialized: "always" }]
        },
        {
            code: "var bar = true, baz = false;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "var bar = true, baz = false, a, b;",
            options: [{ uninitialized: "always", initialized: "always" }]
        },
        {
            code: "var bar = true; var baz = false; var a; var b;",
            options: [{ uninitialized: "never", initialized: "never" }]
        },
        {
            code: "var bar, baz; var a = true; var b = false;",
            options: [{ uninitialized: "always", initialized: "never" }]
        },
        {
            code: "var bar = true, baz = false; var a; var b;",
            options: [{ uninitialized: "never", initialized: "always" }]
        },
        {
            code: "var bar; var baz; var a = true, b = false;",
            options: [{ uninitialized: "never", initialized: "always" }]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            options: ["never"]
        },
        {
            code: "function foo() { let a = 1; var c = true; if (a) {let c = true; } }",
            options: ["always"]
        },
        {
            code: "function foo() { const a = 1; var c = true; if (a) {const c = true; } }",
            options: ["always"]
        },
        {
            code: "function foo() { if (true) { const a = 1; }; if (true) {const a = true; } }",
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1; let b = true; }",
            options: ["never"]
        },
        {
            code: "function foo() { const a = 1; const b = true; }",
            options: ["never"]
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1, b = false; var c = true; }",
            options: ["always"]
        },
        {
            code: "function foo() { let a = 1; let b = 2; const c = false; const d = true; var e = true, f = false; }",
            options: [{ var: "always", let: "never", const: "never" }]
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            options: [{ var: "always", let: "always", const: "never" }]
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            options: [{ var: "always" }]
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ var: "never" }]
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ const: "never" }]
        },
        {
            code: "let foo = true, bar = false;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "let foo, bar",
            options: [{ initialized: "never" }]
        },
        {
            code: "let foo = true, bar = false; let a; let b;",
            options: [{ uninitialized: "never" }]
        },
        {
            code: "let foo, bar; let a = true; let b = true;",
            options: [{ initialized: "never" }]
        },
        {
            code: "var foo, bar; const a=1; const b=2; let c, d",
            options: [{ var: "always", let: "always" }]
        },
        {
            code: "var foo; var bar; const a=1, b=2; let c; let d",
            options: [{ const: "always" }]
        },
        {
            code: "for (let x of foo) {}; for (let y of foo) {}",
            options: [{ uninitialized: "always" }]
        },
        {
            code: "for (let x in foo) {}; for (let y in foo) {}",
            options: [{ uninitialized: "always" }]
        },
        {
            code: "var x; for (var y in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x, y; for (y in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x, y; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x; for (var y in foo) {var bar = y; for (var z in bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z in foo) {var baz = z; for (var d in baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x; for (var y of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x, y; for (y of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x, y; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var x; for (var y of foo) {var bar = y; for (var z of bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z of foo) {var baz = z; for (var d of baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }]
        },
        {
            code: "var foo = require('foo'), bar;",
            options: [{ separateRequires: false, var: "always" }],
            parserOptions: { env: { node: true } }
        },
        {
            code: "var foo = require('foo'), bar = require('bar');",
            options: [{ separateRequires: true, var: "always" }],
            parserOptions: { env: { node: true } }
        },
        {
            code: "var bar = 'bar'; var foo = require('foo');",
            options: [{ separateRequires: true, var: "always" }]
        },
        {
            code: "var foo = require('foo'); var bar = 'bar';",
            options: [{ separateRequires: true, var: "always" }]
        },
        {
            code: "var foo = require('foo'); var bar = 'bar';",
            options: [{ separateRequires: true, var: "always" }],
            parserOptions: { env: { node: true } }
        },

        // https://github.com/eslint/eslint/issues/4680
        {
            code: "var a = 0, b, c;",
            options: ["consecutive"]
        },
        {
            code: "var a = 0, b = 1, c = 2;",
            options: ["consecutive"]
        },
        {
            code: "var a = 0, b = 1; foo(); var c = 2;",
            options: ["consecutive"]
        },
        {
            code: "let a = 0, b, c;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0, b = 1, c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0, b = 1; foo(); let c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1; foo(); const c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; var b = 1;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; let b = 1;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; const b = 1; var c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/10784
        {
            code: "const foo = require('foo'); const bar = 'bar';",
            options: [{ const: "consecutive", separateRequires: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0, b = 1; var c, d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }]
        },
        {
            code: "var a = 0; var b, c; var d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "always" }]
        },
        {
            code: "let a = 0, b = 1; let c, d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; let b, c; let d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1; let c, d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; let b, c; const d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0, b = 1; var c; var d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }]
        },
        {
            code: "var a = 0; var b; var c; var d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }]
        },
        {
            code: "let a = 0, b = 1; let c; let d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; let b; let c; let d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1; let c; let d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; let b; let c; const d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a, b; var c = 0, d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }]
        },
        {
            code: "var a; var b = 0, c = 1; var d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }]
        },
        {
            code: "let a, b; let c = 0, d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; let b = 0, c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a, b; const c = 0, d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; const b = 0, c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a, b; var c = 0; var d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }]
        },
        {
            code: "var a; var b = 0; var c = 1; var d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }]
        },
        {
            code: "let a, b; let c = 0; let d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; let b = 0; let c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a, b; const c = 0; const d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; const b = 0; const c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 0, b = 1;",
            options: [{ var: "consecutive" }]
        },
        {
            code: "var a = 0; foo; var b = 1;",
            options: [{ var: "consecutive" }]
        },
        {
            code: "let a = 0, b = 1;",
            options: [{ let: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a = 0; foo; let b = 1;",
            options: [{ let: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1;",
            options: [{ const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; foo; const b = 1;",
            options: [{ const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a, b; const c = 0, d = 1;",
            options: [{ let: "consecutive", const: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; const b = 0, c = 1; let d;",
            options: [{ let: "consecutive", const: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a, b; const c = 0; const d = 1;",
            options: [{ let: "consecutive", const: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let a; const b = 0; const c = 1; let d;",
            options: [{ let: "consecutive", const: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1; let c, d;",
            options: [{ const: "consecutive", let: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; let b, c; const d = 1;",
            options: [{ const: "consecutive", let: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0, b = 1; let c; let d;",
            options: [{ const: "consecutive", let: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 0; let b; let c; const d = 1;",
            options: [{ const: "consecutive", let: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 1, b = 2; foo(); var c = 3, d = 4;",
            options: [{ initialized: "consecutive" }]
        },
        {
            code: "var bar, baz;",
            options: ["consecutive"]
        },
        {
            code: "var bar = 1, baz = 2; qux(); var qux = 3, quux;",
            options: ["consecutive"]
        },
        {
            code: "let a, b; var c; var d; let e;",
            options: [{ var: "never", let: "consecutive", const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const a = 1, b = 2; var d; var e; const f = 3;",
            options: [{ var: "never", let: "consecutive", const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a, b; const c = 1; const d = 2; let e; let f; ",
            options: [{ var: "consecutive" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = 1, b = 2; var c; var d; var e = 3, f = 4;",
            options: [{ initialized: "consecutive", uninitialized: "never" }]
        },
        {
            code: "var a; somethingElse(); var b;",
            options: [{ var: "never" }]
        },
        {
            code: "var foo = 1;\nlet bar = function() { var x; };\nvar baz = 2;",
            options: [{ var: "never" }]
        }
    ],
    invalid: [
        {
            code: "function foo() { var bar = true, baz = false; }",
            output: "function foo() { var bar = true; var baz = false; }",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            output: "function foo() { var bar = true,  baz = false; }",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var a = 1; for (var b = 2;;) {}",
            output: null,
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var foo = true, bar = false; }",
            output: "function foo() { var foo = true; var bar = false; }",
            options: [{ initialized: "never" }],
            errors: [
                {
                    message: "Split initialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var foo, bar; }",
            output: "function foo() { var foo; var bar; }",
            options: [{ uninitialized: "never" }],
            errors: [
                {
                    message: "Split uninitialized 'var' declarations into multiple statements.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar, baz; var a = true; var b = false; var c, d;}",
            output: "function foo() { var bar, baz; var a = true; var b = false,  c, d;}",
            options: [{ uninitialized: "always", initialized: "never" }],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with uninitialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a; var b; var c = true, d = false; }",
            output: "function foo() { var bar = true, baz = false; var a; var b,  c = true, d = false; }",
            options: [{ uninitialized: "never", initialized: "always" }],
            errors: [
                {
                    message: "Combine this with the previous 'var' statement with initialized variables.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; var a, b;}",
            output: "function foo() { var bar = true; var baz = false; var a; var b;}",
            options: [{ uninitialized: "never", initialized: "never" }],
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
            output: "function foo() { var bar = true,  baz = false,  a,  b;}",
            options: [{ uninitialized: "always", initialized: "always" }],
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
            output: "function foo() { var a = [1, 2, 3],  [b, c, d] = a; }",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            output: "function foo() { let a = 1,  b = 2; }",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            output: "function foo() { const a = 1,  b = 2; }",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            output: "function foo() { let a = 1,  b = 2; }",
            options: [{ let: "always" }],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            output: "function foo() { const a = 1,  b = 2; }",
            options: [{ const: "always" }],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            output: "function foo() { let a = 1; let b = 2; }",
            options: [{ let: "never" }],
            errors: [{
                message: "Split 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            output: "function foo() { let a = 1; let b = 2; }",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a, b; }",
            output: "function foo() { let a; let b; }",
            options: [{ uninitialized: "never" }],
            errors: [{
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            output: "function foo() { const a = 1; const b = 2; }",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            output: "function foo() { const a = 1; const b = 2; }",
            options: [{ const: "never" }],
            errors: [{
                message: "Split 'const' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "let foo = true; switch(foo) { case true: let bar = 2; break; case false: let baz = 3; break; }",
            output: null,
            options: [{ var: "always", let: "always", const: "never" }],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 74
            }]
        },
        {
            code: "var one = 1, two = 2;\nvar three;",
            output: "var one = 1, two = 2,\n three;",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 2,
                column: 1
            }]
        },
        {
            code: "var i = [0], j;",
            output: "var i = [0]; var j;",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var i = [0], j;",
            output: "var i = [0]; var j;",
            options: [{ uninitialized: "never" }],
            errors: [{
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x of foo) {}; for (var y of foo) {}",
            output: null,
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x in foo) {}; for (var y in foo) {}",
            output: null,
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var foo = function() { var bar = true; var baz = false; }",
            output: "var foo = function() { var bar = true,  baz = false; }",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 40
            }]
        },
        {
            code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
            output: null,
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 45
            }, {
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 71
            }]
        },
        {
            code: "var foo = () => { var bar = true; var baz = false; }",
            output: "var foo = () => { var bar = true,  baz = false; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 35
            }]
        },
        {
            code: "var foo = function() { var bar = true; if (qux) { var baz = false; } }",
            output: null,
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 51
            }]
        },
        {
            code: "var foo; var bar;",
            output: "var foo,  bar;",
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 10
            }]
        },
        {
            code: "var x = 1, y = 2; for (var z in foo) {}",
            output: "var x = 1; var y = 2; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var x = 1, y = 2; for (var z of foo) {}",
            output: "var x = 1; var y = 2; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var x; var y; for (var z in foo) {}",
            output: "var x,  y; for (var z in foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var x; var y; for (var z of foo) {}",
            output: "var x,  y; for (var z of foo) {}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var x; for (var y in foo) {var bar = y; var a; for (var z of bar) {}}",
            output: "var x; for (var y in foo) {var bar = y,  a; for (var z of bar) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 41
            }]
        },
        {
            code: "var a = 1; var b = 2; var x, y; for (var z of foo) {var c = 3, baz = z; for (var d in baz) {}}",
            output: "var a = 1; var b = 2; var x, y; for (var z of foo) {var c = 3; var baz = z; for (var d in baz) {}}",
            options: [{ initialized: "never", uninitialized: "always" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 53
            }]
        },
        {
            code: "var {foo} = 1, [bar] = 2;",
            output: "var {foo} = 1; var [bar] = 2;",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "const foo = 1,\n    bar = 2;",
            output: "const foo = 1;\n    const bar = 2;",
            options: [{ initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo = 1,\n    bar = 2;",
            output: "var foo = 1;\n    var bar = 2;",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo = 1, // comment\n    bar = 2;",
            output: "var foo = 1; // comment\n    var bar = 2;",
            options: [{ initialized: "never" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var f, k /* test */, l;",
            output: "var f; var k /* test */; var l;",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var f,          /* test */ l;",
            output: "var f;          /* test */ var l;",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var f, k /* test \n some more comment \n even more */, l = 1, P;",
            output: "var f; var k /* test \n some more comment \n even more */; var l = 1; var P;",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var a = 1, b = 2",
            output: "var a = 1; var b = 2",
            options: ["never"],
            errors: [{
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo = require('foo'), bar;",
            output: null,
            options: [{ separateRequires: true, var: "always" }],
            parserOptions: { env: { node: true } },
            errors: [{
                message: "Split requires to be separated into a single block.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, var: "always" }],
            parserOptions: { env: { node: true } },
            errors: [{
                message: "Split requires to be separated into a single block.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "let foo, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, let: "always" }],
            parserOptions: { env: { node: true } },
            errors: [{
                message: "Split requires to be separated into a single block.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "const foo = 0, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, const: "always" }],
            parserOptions: { env: { node: true } },
            errors: [{
                message: "Split requires to be separated into a single block.",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "const foo = require('foo'); const bar = require('bar');",
            output: "const foo = require('foo'),  bar = require('bar');",
            options: [{ separateRequires: true, const: "always" }],
            parserOptions: { env: { node: true } },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 29
            }]
        },

        // https://github.com/eslint/eslint/issues/4680
        {
            code: "var a = 1, b; var c;",
            output: "var a = 1, b,  c;",
            options: ["consecutive"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "var a = 0, b = 1; var c = 2;",
            output: "var a = 0, b = 1,  c = 2;",
            options: ["consecutive"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "let a = 1, b; let c;",
            output: "let a = 1, b,  c;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "let a = 0, b = 1; let c = 2;",
            output: "let a = 0, b = 1,  c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "const a = 0, b = 1; const c = 2;",
            output: "const a = 0, b = 1,  c = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 21
            }]
        },
        {
            code: "const a = 0; var b = 1; var c = 2; const d = 3;",
            output: "const a = 0; var b = 1,  c = 2; const d = 3;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 25
            }]
        },
        {
            code: "var a = true; var b = false;",
            output: "var a = true,  b = false;",
            options: [{ separateRequires: true, var: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "const a = 0; let b = 1; let c = 2; const d = 3;",
            output: "const a = 0; let b = 1,  c = 2; const d = 3;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 25
            }]
        },
        {
            code: "let a = 0; const b = 1; const c = 1; var d = 2;",
            output: "let a = 0; const b = 1,  c = 1; var d = 2;",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 25
            }]
        },
        {
            code: "var a = 0; var b; var c; var d = 1",
            output: "var a = 0; var b,  c; var d = 1",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "var a = 0; var b = 1; var c; var d;",
            output: "var a = 0,  b = 1; var c,  d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 30
            }]
        },
        {
            code: "let a = 0; let b; let c; let d = 1;",
            output: "let a = 0; let b,  c; let d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "let a = 0; let b = 1; let c; let d;",
            output: "let a = 0,  b = 1; let c,  d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 30
            }]
        },
        {
            code: "const a = 0; let b; let c; const d = 1;",
            output: "const a = 0; let b,  c; const d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 21
            }]
        },
        {
            code: "const a = 0; const b = 1; let c; let d;",
            output: "const a = 0,  b = 1; let c,  d;",
            options: [{ initialized: "consecutive", uninitialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 34
            }]
        },
        {
            code: "var a = 0; var b = 1; var c, d;",
            output: "var a = 0,  b = 1; var c; var d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 23
            }]
        },
        {
            code: "var a = 0; var b, c; var d = 1;",
            output: "var a = 0; var b; var c; var d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            errors: [{
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            }]
        },
        {
            code: "let a = 0; let b = 1; let c, d;",
            output: "let a = 0,  b = 1; let c; let d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 23
            }]
        },
        {
            code: "let a = 0; let b, c; let d = 1;",
            output: "let a = 0; let b; let c; let d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            }]
        },
        {
            code: "const a = 0; const b = 1; let c, d;",
            output: "const a = 0,  b = 1; let c; let d;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 27
            }]
        },
        {
            code: "const a = 0; let b, c; const d = 1;",
            output: "const a = 0; let b; let c; const d = 1;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split uninitialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            }]
        },
        {
            code: "var a; var b; var c = 0; var d = 1;",
            output: "var a,  b; var c = 0,  d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 26
            }]
        },
        {
            code: "var a; var b = 0; var c = 1; var d;",
            output: "var a; var b = 0,  c = 1; var d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "let a; let b; let c = 0; let d = 1;",
            output: "let a,  b; let c = 0,  d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Combine this with the previous 'let' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 26
            }]
        },
        {
            code: "let a; let b = 0; let c = 1; let d;",
            output: "let a; let b = 0,  c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 19
            }]
        },
        {
            code: "let a; let b; const c = 0; const d = 1;",
            output: "let a,  b; const c = 0,  d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Combine this with the previous 'const' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 28
            }]
        },
        {
            code: "let a; const b = 0; const c = 1; let d;",
            output: "let a; const b = 0,  c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 21
            }]
        },
        {
            code: "var a; var b; var c = 0, d = 1;",
            output: "var a,  b; var c = 0; var d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "var a; var b = 0, c = 1; var d;",
            output: "var a; var b = 0; var c = 1; var d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            errors: [{
                message: "Split initialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "let a; let b; let c = 0, d = 1;",
            output: "let a,  b; let c = 0; let d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Split initialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "let a; let b = 0, c = 1; let d;",
            output: "let a; let b = 0; let c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "let a; let b; const c = 0, d = 1;",
            output: "let a,  b; const c = 0; const d = 1;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement with uninitialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "let a; const b = 0, c = 1; let d;",
            output: "let a; const b = 0; const c = 1; let d;",
            options: [{ uninitialized: "consecutive", initialized: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split initialized 'const' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var a = 0; var b = 1;",
            output: "var a = 0,  b = 1;",
            options: [{ var: "consecutive" }],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            }]
        },
        {
            code: "let a = 0; let b = 1;",
            output: "let a = 0,  b = 1;",
            options: [{ let: "consecutive" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            }]
        },
        {
            code: "const a = 0; const b = 1;",
            output: "const a = 0,  b = 1;",
            options: [{ const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            }]
        },
        {
            code: "let a; let b; const c = 0; const d = 1;",
            output: "let a,  b; const c = 0,  d = 1;",
            options: [{ let: "consecutive", const: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 28
            }]
        },
        {
            code: "let a; const b = 0; const c = 1; let d;",
            output: "let a; const b = 0,  c = 1; let d;",
            options: [{ let: "consecutive", const: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 21
            }]
        },
        {
            code: "let a; let b; const c = 0, d = 1;",
            output: "let a,  b; const c = 0; const d = 1;",
            options: [{ let: "consecutive", const: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                message: "Split 'const' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 15
            }]
        },
        {
            code: "let a; const b = 0, c = 1; let d;",
            output: "let a; const b = 0; const c = 1; let d;",
            options: [{ let: "consecutive", const: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split 'const' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "const a = 0; const b = 1; let c; let d;",
            output: "const a = 0,  b = 1; let c,  d;",
            options: [{ const: "consecutive", let: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 34
            }]
        },
        {
            code: "const a = 0; let b; let c; const d = 1;",
            output: "const a = 0; let b,  c; const d = 1;",
            options: [{ const: "consecutive", let: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 21
            }]
        },
        {
            code: "const a = 0; const b = 1; let c, d;",
            output: "const a = 0,  b = 1; let c; let d;",
            options: [{ const: "consecutive", let: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                message: "Split 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 27
            }]
        },
        {
            code: "const a = 0; let b, c; const d = 1;",
            output: "const a = 0; let b; let c; const d = 1;",
            options: [{ const: "consecutive", let: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Split 'let' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            }]
        },
        {
            code: "var bar; var baz;",
            output: "var bar,  baz;",
            options: ["consecutive"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 10
            }]
        },
        {
            code: "var bar = 1; var baz = 2; qux(); var qux = 3; var quux;",
            output: "var bar = 1,  baz = 2; qux(); var qux = 3,  quux;",
            options: ["consecutive"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 47
            }]
        },
        {
            code: "let a, b; let c; var d, e;",
            output: "let a, b,  c; var d; var e;",
            options: [{ var: "never", let: "consecutive", const: "consecutive" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 11
            },
            {
                message: "Split 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 18
            }]
        },
        {
            code: "var a; var b;",
            output: "var a,  b;",
            options: [{ var: "consecutive" }],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 8
            }]
        },
        {
            code: "var a = 1; var b = 2; var c, d; var e = 3; var f = 4;",
            output: "var a = 1,  b = 2; var c; var d; var e = 3,  f = 4;",
            options: [{ initialized: "consecutive", uninitialized: "never" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Split uninitialized 'var' declarations into multiple statements.",
                type: "VariableDeclaration",
                line: 1,
                column: 23
            },
            {
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 44
            }]
        },
        {
            code: "var a = 1; var b = 2; foo(); var c = 3; var d = 4;",
            output: "var a = 1,  b = 2; foo(); var c = 3,  d = 4;",
            options: [{ initialized: "consecutive" }],
            errors: [{
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                message: "Combine this with the previous 'var' statement with initialized variables.",
                type: "VariableDeclaration",
                line: 1,
                column: 41
            }]
        },
        {
            code: "var a\nvar b",
            output: "var a,\n b",
            options: ["always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration",
                line: 2,
                column: 1
            }]
        }
    ]
});
