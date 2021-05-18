/**
 * @fileoverview Tests for new-cap rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/new-cap"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("new-cap", rule, {
    valid: [
        "var x = new Constructor();",
        "var x = new a.b.Constructor();",
        "var x = new a.b['Constructor']();",
        "var x = new a.b[Constructor]();",
        "var x = new a.b[constructor]();",
        "var x = new function(){};",
        "var x = new _;",
        "var x = new $;",
        "var x = new Σ;",
        "var x = new _x;",
        "var x = new $x;",
        "var x = new this;",
        "var x = Array(42)",
        "var x = Boolean(42)",
        "var x = Date(42)",
        "var x = Date.UTC(2000, 0)",
        "var x = Error('error')",
        "var x = Function('return 0')",
        "var x = Number(42)",
        "var x = Object(null)",
        "var x = RegExp(42)",
        "var x = String(42)",
        "var x = Symbol('symbol')",
        "var x = _();",
        "var x = $();",
        { code: "var x = Foo(42)", options: [{ capIsNew: false }] },
        { code: "var x = bar.Foo(42)", options: [{ capIsNew: false }] },
        { code: "var x = Foo.bar(42)", options: [{ capIsNew: false }] },
        "var x = bar[Foo](42)",
        { code: "var x = bar['Foo'](42)", options: [{ capIsNew: false }] },
        "var x = Foo.bar(42)",
        { code: "var x = new foo(42)", options: [{ newIsCap: false }] },
        "var o = { 1: function() {} }; o[1]();",
        "var o = { 1: function() {} }; new o[1]();",
        { code: "var x = Foo(42);", options: [{ capIsNew: true, capIsNewExceptions: ["Foo"] }] },
        { code: "var x = Foo(42);", options: [{ capIsNewExceptionPattern: "^Foo" }] },
        { code: "var x = new foo(42);", options: [{ newIsCap: true, newIsCapExceptions: ["foo"] }] },
        { code: "var x = new foo(42);", options: [{ newIsCapExceptionPattern: "^foo" }] },
        { code: "var x = Object(42);", options: [{ capIsNewExceptions: ["Foo"] }] },

        { code: "var x = Foo.Bar(42);", options: [{ capIsNewExceptions: ["Bar"] }] },
        { code: "var x = Foo.Bar(42);", options: [{ capIsNewExceptions: ["Foo.Bar"] }] },

        { code: "var x = Foo.Bar(42);", options: [{ capIsNewExceptionPattern: "^Foo\\.." }] },
        { code: "var x = new foo.bar(42);", options: [{ newIsCapExceptions: ["bar"] }] },
        { code: "var x = new foo.bar(42);", options: [{ newIsCapExceptions: ["foo.bar"] }] },

        { code: "var x = new foo.bar(42);", options: [{ newIsCapExceptionPattern: "^foo\\.." }] },
        { code: "var x = new foo.bar(42);", options: [{ properties: false }] },
        { code: "var x = Foo.bar(42);", options: [{ properties: false }] },
        { code: "var x = foo.Bar(42);", options: [{ capIsNew: false, properties: false }] }
    ],
    invalid: [
        { code: "var x = new c();", errors: [{ messageId: "lower", type: "NewExpression" }] },
        { code: "var x = new φ;", errors: [{ messageId: "lower", type: "NewExpression" }] },
        { code: "var x = new a.b.c;", errors: [{ messageId: "lower", type: "NewExpression" }] },
        { code: "var x = new a.b['c'];", errors: [{ messageId: "lower", type: "NewExpression" }] },
        { code: "var b = Foo();", errors: [{ messageId: "upper", type: "CallExpression" }] },
        { code: "var b = a.Foo();", errors: [{ messageId: "upper", type: "CallExpression" }] },
        { code: "var b = a['Foo']();", errors: [{ messageId: "upper", type: "CallExpression" }] },
        { code: "var b = a.Date.UTC();", errors: [{ messageId: "upper", type: "CallExpression" }] },
        { code: "var b = UTC();", errors: [{ messageId: "upper", type: "CallExpression" }] },
        {
            code: "var a = B.C();",
            errors: [
                {
                    messageId: "upper",
                    type: "CallExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var a = B\n.C();",
            errors: [
                {
                    messageId: "upper",
                    type: "CallExpression",
                    line: 2,
                    column: 2
                }
            ]
        },
        {
            code: "var a = new B.c();",
            errors: [
                {
                    messageId: "lower",
                    type: "NewExpression",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "var a = new B.\nc();",
            errors: [
                {
                    messageId: "lower",
                    type: "NewExpression",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var a = new c();",
            errors: [
                {
                    messageId: "lower",
                    type: "NewExpression",
                    line: 1,
                    column: 13
                }
            ]
        },

        {
            code: "var x = Foo.Bar(42);",
            options: [{ capIsNewExceptions: ["Foo"] }],
            errors: [{ type: "CallExpression", messageId: "upper" }]
        },
        {
            code: "var x = Bar.Foo(42);",

            options: [{ capIsNewExceptionPattern: "^Foo\\.." }],
            errors: [{ type: "CallExpression", messageId: "upper" }]
        },
        {
            code: "var x = new foo.bar(42);",
            options: [{ newIsCapExceptions: ["foo"] }],
            errors: [{ type: "NewExpression", messageId: "lower" }]
        },
        {
            code: "var x = new bar.foo(42);",

            options: [{ newIsCapExceptionPattern: "^foo\\.." }],
            errors: [{ type: "NewExpression", messageId: "lower" }]
        }
    ]
});
