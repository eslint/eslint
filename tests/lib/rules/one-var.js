/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/one-var"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
            options: [{ separateRequires: false, var: "always" }]
        },
        {
            code: "var foo = require('foo'), bar = require('bar');",
            options: [{ separateRequires: true, var: "always" }]
        },
        {
            code: "var bar = 'bar'; var foo = require('foo');",
            options: [{ separateRequires: true, var: "always" }]
        },
        {
            code: "var foo = require('foo'); var bar = 'bar';",
            options: [{ separateRequires: true, var: "always" }]
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
        },

        // class static blocks
        {
            code: "class C { static { var a; let b; const c = 0; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const a = 0; class C { static { const b = 0; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { const b = 0; } } const a = 0; ",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "let a; class C { static { let b; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let b; } } let a;",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "var a; class C { static { var b; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var b; } } var a; ",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "var a; class C { static { if (foo) { var b; } } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { if (foo) { var b; } } } var a; ",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { const a = 0; if (foo) { const b = 0; } } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; if (foo) { let b; } } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { const a = 0; const b = 0; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; let b; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var a; var b; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; foo; let b; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; const b = 0; let c; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var a; foo; var b; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var a; let b; var c; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; if (foo) { let b; } } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { if (foo) { let b; } let a;  } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { const a = 0; if (foo) { const b = 0; } } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { if (foo) { const b = 0; } const a = 0; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var a; if (foo) var b; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { if (foo) var b; var a; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { if (foo) { var b; } var a; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { let a; let b = 0; } }",
            options: [{ initialized: "consecutive" }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { var a; var b = 0; } }",
            options: [{ initialized: "consecutive" }],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "var bar = true, baz = false;",
            output: "var bar = true; var baz = false;",
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true, baz = false; }",
            output: "function foo() { var bar = true; var baz = false; }",
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "if (foo) { var bar = true, baz = false; }",
            output: "if (foo) { var bar = true; var baz = false; }",
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "switch (foo) { case bar: var baz = true, quux = false; }",
            output: "switch (foo) { case bar: var baz = true; var quux = false; }",
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "switch (foo) { default: var baz = true, quux = false; }",
            output: "switch (foo) { default: var baz = true; var quux = false; }",
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            output: "function foo() { var bar = true,  baz = false; }",
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var a = 1; for (var b = 2;;) {}",
            output: null,
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var foo = true, bar = false; }",
            output: "function foo() { var foo = true; var bar = false; }",
            options: [{ initialized: "never" }],
            errors: [
                {
                    messageId: "splitInitialized",
                    data: { type: "var" },
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
                    messageId: "splitUninitialized",
                    data: { type: "var" },
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
                    messageId: "combineUninitialized",
                    data: { type: "var" },
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
                    messageId: "combineInitialized",
                    data: { type: "var" },

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
                    messageId: "split",
                    data: { type: "var" },
                    type: "VariableDeclaration"
                },
                {
                    messageId: "split",
                    data: { type: "var" },
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
                    messageId: "combine",
                    data: { type: "var" },
                    type: "VariableDeclaration"
                },
                {
                    messageId: "combine",
                    data: { type: "var" },
                    type: "VariableDeclaration"
                },
                {
                    messageId: "combine",
                    data: { type: "var" },
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            output: "function foo() { var a = [1, 2, 3],  [b, c, d] = a; }",
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            output: "function foo() { let a = 1,  b = 2; }",
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            output: "function foo() { const a = 1,  b = 2; }",
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            output: "function foo() { let a = 1,  b = 2; }",
            options: [{ let: "always" }],
            errors: [{
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            output: "function foo() { const a = 1,  b = 2; }",
            options: [{ const: "always" }],
            errors: [{
                messageId: "combine",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            output: "function foo() { let a = 1; let b = 2; }",
            options: [{ let: "never" }],
            errors: [{
                messageId: "split",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            output: "function foo() { let a = 1; let b = 2; }",
            options: [{ initialized: "never" }],
            errors: [{
                messageId: "splitInitialized",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a, b; }",
            output: "function foo() { let a; let b; }",
            options: [{ uninitialized: "never" }],
            errors: [{
                messageId: "splitUninitialized",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            output: "function foo() { const a = 1; const b = 2; }",
            options: [{ initialized: "never" }],
            errors: [{
                messageId: "splitInitialized",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            output: "function foo() { const a = 1; const b = 2; }",
            options: [{ const: "never" }],
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "let foo = true; switch(foo) { case true: let bar = 2; break; case false: let baz = 3; break; }",
            output: null,
            options: [{ var: "always", let: "always", const: "never" }],
            errors: [{
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var i = [0], j;",
            output: "var i = [0]; var j;",
            options: [{ uninitialized: "never" }],
            errors: [{
                messageId: "splitUninitialized",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x of foo) {}; for (var y of foo) {}",
            output: null,
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var x in foo) {}; for (var y in foo) {}",
            output: null,
            options: ["always"],
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var foo = function() { var bar = true; var baz = false; }",
            output: "var foo = function() { var bar = true,  baz = false; }",
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 40
            }]
        },
        {
            code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
            output: null,
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 45
            }, {
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 35
            }]
        },
        {
            code: "var foo = function() { var bar = true; if (qux) { var baz = false; } }",
            output: null,
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 51
            }]
        },
        {
            code: "var foo; var bar;",
            output: "var foo,  bar;",
            errors: [{
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "const" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "split",
                data: { type: "var" },
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
                messageId: "split",
                data: { type: "var" },
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
                messageId: "split",
                data: { type: "var" },
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
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo = require('foo'), bar;",
            output: null,
            options: [{ separateRequires: true, var: "always" }],
            errors: [{
                messageId: "splitRequires",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "var foo, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, var: "always" }],
            errors: [{
                messageId: "splitRequires",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "let foo, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, let: "always" }],
            errors: [{
                messageId: "splitRequires",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "const foo = 0, bar = require('bar');",
            output: null,
            options: [{ separateRequires: true, const: "always" }],
            errors: [{
                messageId: "splitRequires",
                type: "VariableDeclaration",
                line: 1,
                column: 1
            }]
        },
        {
            code: "const foo = require('foo'); const bar = require('bar');",
            output: "const foo = require('foo'),  bar = require('bar');",
            options: [{ separateRequires: true, const: "always" }],
            errors: [{
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
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
                messageId: "combineInitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "combineUninitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
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
                messageId: "combineInitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "combineUninitialized",
                data: { type: "let" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
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
                messageId: "combineInitialized",
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                messageId: "combineUninitialized",
                data: { type: "let" },
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
                messageId: "combineInitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "splitUninitialized",
                data: { type: "var" },
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
                messageId: "splitUninitialized",
                data: { type: "var" },
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
                messageId: "combineInitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "splitUninitialized",
                data: { type: "let" },
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
                messageId: "splitUninitialized",
                data: { type: "let" },
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
                messageId: "combineInitialized",
                data: { type: "const" },
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                messageId: "splitUninitialized",
                data: { type: "let" },
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
                messageId: "splitUninitialized",
                data: { type: "let" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "combineInitialized",
                data: { type: "var" },
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
                messageId: "combineInitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "combineInitialized",
                data: { type: "let" },
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
                messageId: "combineInitialized",
                data: { type: "let" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "combineInitialized",
                data: { type: "const" },
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
                messageId: "combineInitialized",
                data: { type: "const" },
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
                messageId: "combineUninitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "splitInitialized",
                data: { type: "var" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "splitInitialized",
                data: { type: "let" },
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
                messageId: "splitInitialized",
                data: { type: "let" },
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
                messageId: "combineUninitialized",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "splitInitialized",
                data: { type: "const" },
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
                messageId: "splitInitialized",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 8
            },
            {
                messageId: "split",
                data: { type: "const" },
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
                messageId: "split",
                data: { type: "const" },
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
                messageId: "combine",
                data: { type: "const" },
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "const" },
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                messageId: "split",
                data: { type: "let" },
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
                messageId: "split",
                data: { type: "let" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 14
            },
            {
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration",
                line: 1,
                column: 11
            },
            {
                messageId: "split",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
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
                messageId: "combineInitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "splitUninitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 23
            },
            {
                messageId: "combineInitialized",
                data: { type: "var" },
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
                messageId: "combineInitialized",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 1,
                column: 12
            },
            {
                messageId: "combineInitialized",
                data: { type: "var" },
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
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration",
                line: 2,
                column: 1
            }]
        },
        {
            code: "export const foo=1, bar=2;",
            output: "export const foo=1; export const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "const foo=1,\n bar=2;",
            output: "const foo=1;\n const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo=1,\n bar=2;",
            output: "export const foo=1;\n export const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo=1\n, bar=2;",
            output: "export const foo=1\n; export const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo= a, bar=2;",
            output: "export const foo= a; export const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo=() => a, bar=2;",
            output: "export const foo=() => a; export const bar=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo= a, bar=2, bar2=2;",
            output: "export const foo= a; export const bar=2; export const bar2=2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const foo = 1,bar = 2;",
            output: "export const foo = 1; export const bar = 2;",
            options: ["never"],
            parserOptions: { ecmaVersion: 2021, sourceType: "module" },
            errors: [{
                messageId: "split",
                data: { type: "const" },
                type: "VariableDeclaration"
            }]
        },

        // "never" should not autofix declarations in a block position
        {
            code: "if (foo) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "if (foo) var x, y;",
            output: null,
            options: [{ var: "never" }],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "if (foo) var x, y;",
            output: null,
            options: [{ uninitialized: "never" }],
            errors: [{
                messageId: "splitUninitialized",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "if (foo) var x = 1, y = 1;",
            output: null,
            options: [{ initialized: "never" }],
            errors: [{
                messageId: "splitInitialized",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "if (foo) {} else var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "while (foo) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "do var x, y; while (foo);",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "do var x = f(), y = b(); while (x < y);",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (;;) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (foo in bar) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (foo of bar) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "with (foo) var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "label: var x, y;",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },

        // class static blocks
        {
            code: "class C { static { let x, y; } }",
            output: "class C { static { let x; let y; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "split",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var x, y; } }",
            output: "class C { static { var x; var y; } }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "split",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { let x; let y; } }",
            output: "class C { static { let x,  y; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var x; var y; } }",
            output: "class C { static { var x,  y; } }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { let x; foo; let y; } }",
            output: null,
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var x; foo; var y; } }",
            output: null,
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var x; if (foo) { var y; } } }",
            output: null,
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { let x; let y; } }",
            output: "class C { static { let x,  y; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var x; var y; } }",
            output: "class C { static { var x,  y; } }",
            options: ["consecutive"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combine",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { let a = 0; let b = 1; } }",
            output: "class C { static { let a = 0,  b = 1; } }",
            options: [{ initialized: "consecutive" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combineInitialized",
                data: { type: "let" },
                type: "VariableDeclaration"
            }]
        },
        {
            code: "class C { static { var a = 0; var b = 1; } }",
            output: "class C { static { var a = 0,  b = 1; } }",
            options: [{ initialized: "consecutive" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "combineInitialized",
                data: { type: "var" },
                type: "VariableDeclaration"
            }]
        }
    ]
});
