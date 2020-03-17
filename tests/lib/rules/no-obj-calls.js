/**
 * @fileoverview Tests for no-obj-calls rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-obj-calls"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-obj-calls", rule, {
    valid: [
        "var x = Math;",
        "var x = Math.random();",
        "var x = Math.PI;",
        "var x = foo.Math();",
        "JSON.parse(foo)",
        "Reflect.get(foo, 'x')",
        "Atomics.load(foo, 0)",

        { code: "globalThis.Math();", env: { es6: true } },
        { code: "var x = globalThis.Math();", env: { es6: true } },
        { code: "f(globalThis.Math());", env: { es6: true } },
        { code: "globalThis.Math().foo;", env: { es6: true } },
        { code: "var x = globalThis.JSON();", env: { es6: true } },
        { code: "x = globalThis.JSON(str);", env: { es6: true } },
        { code: "globalThis.Math( globalThis.JSON() );", env: { es6: true } },
        { code: "var x = globalThis.Reflect();", env: { es6: true } },
        { code: "var x = globalThis.Reflect();", env: { es2017: true } },
        { code: "/*globals Reflect: true*/ globalThis.Reflect();", env: { es2017: true } },
        { code: "var x = globalThis.Atomics();", env: { es2017: true } },
        { code: "var x = globalThis.Atomics();", globals: { Atomics: false }, env: { es2017: true } },

        // non-existing variables
        "/*globals Math: off*/ Math();",
        {
            code: "JSON();",
            globals: { JSON: "off" }
        },
        "Reflect();",
        "Atomics();",
        {
            code: "Atomics();",
            env: { es6: true }
        },

        // shadowed variables
        "var Math; Math();",
        {
            code: "let JSON; JSON();",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (foo) { const Reflect = 1; Reflect(); }",
            parserOptions: { ecmaVersion: 2015 },
            env: { es6: true }
        },
        "function foo(Math) { Math(); }",
        {
            code: "function foo(Atomics) { Atomics(); }",
            env: { es2017: true }
        },
        "function foo() { var JSON; JSON(); }",
        {
            code: "function foo() { var Atomics = bar(); var baz = Atomics(5); }",
            globals: { Atomics: false }
        },
        {
            code: "var construct = typeof Reflect !== \"undefined\" ? Reflect.construct : undefined; construct();",
            globals: { Reflect: false }
        }
    ],
    invalid: [

        {
            code: "Math();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression" }]
        },

        {
            code: "var x = Math();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression" }]
        },
        {
            code: "f(Math());",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 3, endColumn: 9 }]
        },
        {
            code: "Math().foo;",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 7 }]
        },
        {
            code: "var x = JSON();",
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "x = JSON(str);",
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "Math( JSON() );",
            errors: [
                { messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 15 },
                { messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression", column: 7, endColumn: 13 }
            ]
        },
        {
            code: "var x = Reflect();",
            env: { es6: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = Reflect();",
            env: { es2017: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "/*globals Reflect: true*/ Reflect();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = Atomics();",
            env: { es2017: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = Atomics();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = Atomics();",
            globals: { Atomics: false },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = globalThis.Math();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression" }]
        },
        {
            code: "f(globalThis.Math());",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 3, endColumn: 20 }]
        },
        {
            code: "globalThis.Math().foo;",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 18 }]
        },
        {
            code: "var x = globalThis.JSON();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "x = globalThis.JSON(str);",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "globalThis.Math( globalThis.JSON() );",
            env: { es2020: true },
            errors: [
                { messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 37 },
                { messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression", column: 18, endColumn: 35 }
            ]
        },
        {
            code: "var x = globalThis.Reflect();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "/*globals Reflect: true*/ Reflect();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = globalThis.Atomics();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var foo = bar ? baz: JSON; foo();",
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "var foo = bar ? baz: globalThis.JSON; foo();",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "var foo = window.Atomics; foo();",
            env: { es2020: true, browser: true },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "Atomics" }, type: "CallExpression" }]
        }
    ]
});
