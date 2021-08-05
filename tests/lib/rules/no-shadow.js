/**
 * @fileoverview Tests for no-shadow rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-shadow"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-shadow", rule, {
    valid: [
        "var a=3; function b(x) { a++; return x + a; }; setTimeout(function() { b(a); }, 0);",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())",
        "var arguments;\nfunction bar() { }",
        { code: "var a=3; var b = (x) => { a++; return x + a; }; setTimeout(() => { b(a); }, 0);", parserOptions: { ecmaVersion: 6 } },
        { code: "class A {}", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { var a; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { var A = class A {}; })()", parserOptions: { ecmaVersion: 6 } },
        { code: "{ var a; } var a;", parserOptions: { ecmaVersion: 6 } }, // this case reports `no-redeclare`, not shadowing.
        { code: "{ let a; } let a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ let a; } var a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ let a; } function a() {}", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ const a = 0; } const a = 1;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ const a = 0; } var a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ const a = 0; } function a() {}", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { let a; } let a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { let a; } var a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { let a; } function a() {}", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { var a; } let a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { var a; } var a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { var a; } function a() {}", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { } let a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { } var a;", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { } function a() {}", options: [{ hoist: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "{ let a; } let a;", parserOptions: { ecmaVersion: 6 } },
        { code: "{ let a; } var a;", parserOptions: { ecmaVersion: 6 } },
        { code: "{ const a = 0; } const a = 1;", parserOptions: { ecmaVersion: 6 } },
        { code: "{ const a = 0; } var a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { let a; } let a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { let a; } var a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { var a; } let a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { var a; } var a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { } let a;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { } var a;", parserOptions: { ecmaVersion: 6 } },
        "function foo() { var Object = 0; }",
        { code: "function foo() { var top = 0; }", env: { browser: true } },
        { code: "var Object = 0;", options: [{ builtinGlobals: true }] },
        { code: "var top = 0;", options: [{ builtinGlobals: true }], env: { browser: true } },
        { code: "function foo(cb) { (function (cb) { cb(42); })(cb); }", options: [{ allow: ["cb"] }] },
        { code: "class C { foo; foo() { let foo; } }", parserOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        {
            code: "function a(x) { var b = function c() { var x = 'foo'; }; }",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 12
                },
                type: "Identifier",
                line: 1,
                column: 44
            }]
        },
        {
            code: "var a = (x) => { var b = () => { var x = 'foo'; }; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 10
                },
                type: "Identifier",
                line: 1,
                column: 38
            }]
        },
        {
            code: "function a(x) { var b = function () { var x = 'foo'; }; }",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 12
                },
                type: "Identifier",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var x = 1; function a(x) { return ++x; }",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier",
                line: 1,
                column: 23
            }]
        },
        {
            code: "var a=3; function b() { var a=10; }",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier"
            }]
        },
        {
            code: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier"
            }]
        },
        {
            code: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);",
            errors: [
                {
                    messageId: "noShadow",
                    data: {
                        name: "a",
                        shadowedLine: 1,
                        shadowedColumn: 5
                    },
                    type: "Identifier"
                }, {
                    messageId: "noShadow",
                    data: {
                        name: "b",
                        shadowedLine: 1,
                        shadowedColumn: 19
                    },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var x = 1; { let x = 2; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier"
            }]
        },
        {
            code: "let x = 1; { const x = 2; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ let a; } function a() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 21
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ const a = 0; } function a() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 27
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { let a; } function a() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 36
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { var a; } function a() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 36
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a) { } function a() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 30
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ let a; } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 16
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ let a; } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 16
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ let a; } function a() {}",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 21
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ const a = 0; } const a = 1;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 24
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ const a = 0; } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 22
                },
                type: "Identifier"
            }]
        },
        {
            code: "{ const a = 0; } function a() {}",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 27
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { let a; } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 31
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { let a; } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 31
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { let a; } function a() {}",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 36
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { var a; } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 31
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { var a; } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 31
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { var a; } function a() {}",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 36
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a) { } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 25
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a) { } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 25
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a) { } function a() {}",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 30
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function a() { function a(){} })()",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 11
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function a() { class a{} })()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 11
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function a() { (function a(){}); })()",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 11
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function a() { (class a{}); })()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 11
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = function(a) {}; })()",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = function() { function a() {} }; })()",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = function() { class a{} }; })()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = function() { (function a() {}); }; })()",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = function() { (class a{}); }; })()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { var a = class { constructor() { class a {} } }; })()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier"
            }]
        },
        {
            code: "class A { constructor() { var A; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "A",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier"
            }]
        },
        {
            code: "(function a() { function a(){ function a(){} } })()",
            errors: [
                {
                    messageId: "noShadow",
                    data: {
                        name: "a",
                        shadowedLine: 1,
                        shadowedColumn: 11
                    },
                    type: "Identifier",
                    line: 1,
                    column: 26
                },
                {
                    messageId: "noShadow",
                    data: {
                        name: "a",
                        shadowedLine: 1,
                        shadowedColumn: 26
                    },
                    type: "Identifier",
                    line: 1,
                    column: 40
                }
            ]
        },
        {
            code: "function foo() { var Object = 0; }",
            options: [{ builtinGlobals: true }],
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "Object"
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { var top = 0; }",
            options: [{ builtinGlobals: true }],
            env: { browser: true },
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "top"
                },
                type: "Identifier"
            }]
        },
        {
            code: "var Object = 0;",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "Object"
                },
                type: "Identifier"
            }]
        },
        {
            code: "var top = 0;",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            env: { browser: true },
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "top"
                },
                type: "Identifier"
            }]
        },
        {
            code: "var Object = 0;",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "Object"
                },
                type: "Identifier"
            }]
        },
        {
            code: "var top = 0;",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            env: { browser: true },
            errors: [{
                messageId: "noShadowGlobal",
                data: {
                    name: "top"
                },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(cb) { (function (cb) { cb(42); })(cb); }",
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "cb",
                    shadowedLine: 1,
                    shadowedColumn: 14
                },
                type: "Identifier",
                line: 1,
                column: 31
            }]
        }
    ]
});
