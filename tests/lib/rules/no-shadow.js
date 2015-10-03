/**
 * @fileoverview Tests for no-shadow rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-shadow"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-shadow", rule, {
    valid: [
        "var a=3; function b(x) { a++; return x + a; }; setTimeout(function() { b(a); }, 0);",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())",
        "var arguments;\nfunction bar() { }",
        { code: "var a=3; var b = (x) => { a++; return x + a; }; setTimeout(() => { b(a); }, 0);", ecmaFeatures: { arrowFunctions: true } },
        { code: "class A {}", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { var a; } }", ecmaFeatures: {classes: true} },
        { code: "(function() { var A = class A {}; })()", ecmaFeatures: {classes: true} },
        { code: "{ var a; } let a;", ecmaFeatures: {blockBindings: true} }, // this case reports `no-redeclare`, not shadowing.
        { code: "{ let a; } let a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ let a; } var a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ let a; } function a() {}", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ const a = 0; } const a = 1;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ const a = 0; } var a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ const a = 0; } function a() {}", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { let a; } let a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { let a; } var a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { let a; } function a() {}", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var a; } let a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var a; } var a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var a; } function a() {}", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo(a) { } let a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo(a) { } var a;", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "function foo(a) { } function a() {}", options: [{hoist: "never"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ let a; } let a;", ecmaFeatures: {blockBindings: true} },
        { code: "{ let a; } var a;", ecmaFeatures: {blockBindings: true} },
        { code: "{ const a = 0; } const a = 1;", ecmaFeatures: {blockBindings: true} },
        { code: "{ const a = 0; } var a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { let a; } let a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { let a; } var a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var a; } let a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var a; } var a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo(a) { } let a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo(a) { } var a;", ecmaFeatures: {blockBindings: true} },
        { code: "function foo() { var Object = 0; }" },
        { code: "function foo() { var top = 0; }", env: {browser: true} },
        { code: "var Object = 0;", options: [{builtinGlobals: true}] },
        { code: "var top = 0;", options: [{builtinGlobals: true}], env: {browser: true} }
    ],
    invalid: [
        {
            code: "function a(x) { var b = function c() { var x = 'foo'; }; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 44
            }]
        },
        {
            code: "var a = (x) => { var b = () => { var x = 'foo'; }; }",
            ecmaFeatures: {
                arrowFunctions: true
            },
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 38
            }]
        },
        {
            code: "function a(x) { var b = function () { var x = 'foo'; }; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var x = 1; function a(x) { return ++x; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 23
            }]
        },
        {
            code: "var a=3; function b() { var a=10; }",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }, { message: "b is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var x = 1; { let x = 2; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "x is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "let x = 1; { const x = 2; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "x is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ let a; } function a() {}",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ const a = 0; } function a() {}",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { let a; } function a() {}",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { var a; } function a() {}",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo(a) { } function a() {}",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ let a; } let a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ let a; } var a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ let a; } function a() {}",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ const a = 0; } const a = 1;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ const a = 0; } var a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "{ const a = 0; } function a() {}",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { let a; } let a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { let a; } var a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { let a; } function a() {}",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { var a; } let a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { var a; } var a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { var a; } function a() {}",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo(a) { } let a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo(a) { } var a;",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo(a) { } function a() {}",
            options: [{hoist: "all"}],
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function a() { function a(){} })()",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function a() { class a{} })()",
            ecmaFeatures: {classes: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function a() { (function a(){}); })()",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function a() { (class a{}); })()",
            ecmaFeatures: {classes: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = function(a) {}; })()",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = function() { function a() {} }; })()",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = function() { class a{} }; })()",
            ecmaFeatures: {classes: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = function() { (function a() {}); }; })()",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = function() { (class a{}); }; })()",
            ecmaFeatures: {classes: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function() { var a = class { constructor() { class a {} } }; })()",
            ecmaFeatures: {classes: true},
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "class A { constructor() { var A; } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "A is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "(function a() { function a(){ function a(){} } })()",
            errors: [
                { message: "a is already declared in the upper scope.", type: "Identifier", line: 1, column: 26},
                { message: "a is already declared in the upper scope.", type: "Identifier", line: 1, column: 40}
            ]
        },
        {
            code: "function foo() { var Object = 0; }",
            options: [{builtinGlobals: true}],
            errors: [{ message: "Object is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "function foo() { var top = 0; }",
            options: [{builtinGlobals: true}],
            env: {browser: true},
            errors: [{ message: "top is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "var Object = 0;",
            options: [{builtinGlobals: true}],
            ecmaFeatures: {modules: true},
            errors: [{ message: "Object is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "var top = 0;",
            options: [{builtinGlobals: true}],
            env: {browser: true},
            ecmaFeatures: {modules: true},
            errors: [{ message: "top is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "var Object = 0;",
            options: [{builtinGlobals: true}],
            ecmaFeatures: {globalReturn: true},
            errors: [{ message: "Object is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "var top = 0;",
            options: [{builtinGlobals: true}],
            env: {browser: true},
            ecmaFeatures: {globalReturn: true},
            errors: [{ message: "top is already declared in the upper scope.", type: "Identifier"}]
        }
    ]
});
