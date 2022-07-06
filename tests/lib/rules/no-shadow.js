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
        { code: "class C { foo; foo() { let foo; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { var x; } static { var x; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { let x; } static { let x; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { var x; { var x; /* redeclaration */ } } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { { var x; } { var x; /* redeclaration */ } } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { { let x; } { let x; } } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "const a = [].find(a => a)", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const a = [].find(function(a) { return a; })", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const [a = [].find(a => true)] = dummy", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const { a = [].find(a => true) } = dummy", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "function func(a = [].find(a => true)) {}", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "for (const a in [].find(a => true)) {}", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "for (const a of [].find(a => true)) {}", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const a = [].map(a => true).filter(a => a === 'b')", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const a = [].map(a => true).filter(a => a === 'b').find(a => a === 'c')", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const { a } = (({ a }) => ({ a }))();", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const person = people.find(item => {const person = item.name; return person === 'foo'})", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = bar || foo(y => y);", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = bar && foo(y => y);", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var z = bar(foo(z => z));", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var z = boo(bar(foo(z => z)));", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var match = function (person) { return person.name === 'foo'; };\nconst person = [].find(match);", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const a = foo(x || (a => {}))", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const { a = 1 } = foo(a => {})", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const person = {...people.find((person) => person.firstName.startsWith('s'))}", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 2021 } },
        { code: "const person = { firstName: people.filter((person) => person.firstName.startsWith('s')).map((person) => person.firstName)[0]}", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 2021 } },
        { code: "() => { const y = foo(y => y); }", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const x = (x => x)()", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = bar || (y => y)();", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = bar && (y => y)();", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var x = (x => x)((y => y)());", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const { a = 1 } = (a => {})()", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "() => { const y = (y => y)(); }", options: [{ ignoreOnInitialization: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const [x = y => y] = [].map(y => y)", parserOptions: { ecmaVersion: 6 } }
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
        },
        {
            code: "class C { static { let a; { let a; } } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 24
                },
                type: "Identifier",
                line: 1,
                column: 33
            }]
        },
        {
            code: "class C { static { var C; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "C",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 24
            }]
        },
        {
            code: "class C { static { let C; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "C",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 24
            }]
        },
        {
            code: "var a; class C { static { var a; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 5
                },
                type: "Identifier",
                line: 1,
                column: 31
            }]
        },
        {
            code: "class C { static { var a; } } var a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 35
                },
                type: "Identifier",
                line: 1,
                column: 24
            }]
        },
        {
            code: "class C { static { let a; } } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 35
                },
                type: "Identifier",
                line: 1,
                column: 24
            }]
        },
        {
            code: "class C { static { var a; } } let a;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 35
                },
                type: "Identifier",
                line: 1,
                column: 24
            }]
        },
        {
            code: "class C { static { var a; class D { static { var a; } } } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 24
                },
                type: "Identifier",
                line: 1,
                column: 50
            }]
        },
        {
            code: "class C { static { let a; class D { static { let a; } } } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 24
                },
                type: "Identifier",
                line: 1,
                column: 50
            }]
        },
        {
            code: "let x = foo((x,y) => {});\nlet y;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noShadow",
                    data: {
                        name: "x",
                        shadowedLine: 1,
                        shadowedColumn: 5
                    },
                    type: "Identifier"
                },
                {
                    messageId: "noShadow",
                    data: {
                        name: "y",
                        shadowedLine: 2,
                        shadowedColumn: 5
                    },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const a = fn(()=>{ class C { fn () { const a = 42; return a } } return new C() })",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 44
            }]
        },
        {
            code: "function a() {}\nfoo(a => {});",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 10
                },
                type: "Identifier",
                line: 2,
                column: 5
            }]
        },
        {
            code: "const a = fn(()=>{ function C() { this.fn=function() { const a = 42; return a } } return new C() });",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 62
            }]
        },
        {
            code: "const x = foo(() => { const bar = () => { return x => {}; }; return bar; });",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 50
            }]
        },
        {
            code: "const x = foo(() => { return { bar(x) {} }; });",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 36
            }]
        },
        {
            code: "const x = () => { foo(x => x); }",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 23
            }]
        },
        {
            code: "const foo = () => { let x; bar(x => x); }",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 25
                },
                type: "Identifier",
                line: 1,
                column: 32
            }]
        },
        {
            code: "foo(() => { const x = x => x; });",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 19
                },
                type: "Identifier",
                line: 1,
                column: 23
            }]
        },
        {
            code: "const foo = (x) => { bar(x => {}) }",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 14
                },
                type: "Identifier",
                line: 1,
                column: 26
            }]
        },
        {
            code: "let x = ((x,y) => {})();\nlet y;",
            options: [{ hoist: "all" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "noShadow",
                    data: {
                        name: "x",
                        shadowedLine: 1,
                        shadowedColumn: 5
                    },
                    type: "Identifier"
                },
                {
                    messageId: "noShadow",
                    data: {
                        name: "y",
                        shadowedLine: 2,
                        shadowedColumn: 5
                    },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const a = (()=>{ class C { fn () { const a = 42; return a } } return new C() })()",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "a",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 42
            }]
        },
        {
            code: "const x = () => { (x => x)(); }",
            options: [{ ignoreOnInitialization: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noShadow",
                data: {
                    name: "x",
                    shadowedLine: 1,
                    shadowedColumn: 7
                },
                type: "Identifier",
                line: 1,
                column: 20
            }]
        }
    ]
});
