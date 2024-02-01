/**
 * @fileoverview Tests for no-obj-calls rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-obj-calls"),
    RuleTester = require("../../../lib/rule-tester/rule-tester"),
    globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("no-obj-calls", rule, {
    valid: [
        "var x = Math;",
        "var x = Math.random();",
        "var x = Math.PI;",
        "var x = foo.Math();",
        "var x = new foo.Math();",
        "var x = new Math.foo;",
        "var x = new Math.foo();",
        "JSON.parse(foo)",
        "new JSON.parse",
        {
            code: "Reflect.get(foo, 'x')",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "new Reflect.foo(a, b)",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "Atomics.load(foo, 0)",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "new Atomics.foo()",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "new Intl.Segmenter()",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "Intl.foo()",
            languageOptions: { globals: globals.browser }
        },

        { code: "globalThis.Math();", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = globalThis.Math();", languageOptions: { ecmaVersion: 6 } },
        { code: "f(globalThis.Math());", languageOptions: { ecmaVersion: 6 } },
        { code: "globalThis.Math().foo;", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = globalThis.JSON();", languageOptions: { ecmaVersion: 6 } },
        { code: "x = globalThis.JSON(str);", languageOptions: { ecmaVersion: 6 } },
        { code: "globalThis.Math( globalThis.JSON() );", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = globalThis.Reflect();", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = globalThis.Reflect();", languageOptions: { ecmaVersion: 2017 } },
        { code: "/*globals Reflect: true*/ globalThis.Reflect();", languageOptions: { ecmaVersion: 2017 } },
        { code: "var x = globalThis.Atomics();", languageOptions: { ecmaVersion: 2017 } },
        { code: "var x = globalThis.Atomics();", languageOptions: { ecmaVersion: 2017, globals: { Atomics: false } } },
        { code: "var x = globalThis.Intl();", languageOptions: { globals: globals.browser } },

        // non-existing variables
        "/*globals Math: off*/ Math();",
        "/*globals Math: off*/ new Math();",
        {
            code: "JSON();",
            languageOptions: {
                globals: { JSON: "off" }
            }
        },
        {
            code: "new JSON();",
            languageOptions: {
                globals: { JSON: "off" }
            }
        },
        "Reflect();",
        "Atomics();",
        "new Reflect();",
        "new Atomics();",
        {
            code: "Atomics();",
            languageOptions: { ecmaVersion: 6 }
        },
        "Intl()",
        "new Intl()",

        // shadowed variables
        "var Math; Math();",
        "var Math; new Math();",
        {
            code: "let JSON; JSON();",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let JSON; new JSON();",
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (foo) { const Reflect = 1; Reflect(); }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { const Reflect = 1; new Reflect(); }",
            languageOptions: { ecmaVersion: 6 }
        },
        "function foo(Math) { Math(); }",
        "function foo(JSON) { new JSON(); }",
        {
            code: "function foo(Atomics) { Atomics(); }",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "function foo() { if (bar) { let Atomics; if (baz) { new Atomics(); } } }",
            languageOptions: { ecmaVersion: 2017 }
        },
        "function foo() { var JSON; JSON(); }",
        {
            code: "function foo() { var Atomics = bar(); var baz = Atomics(5); }",
            languageOptions: { globals: { Atomics: false } }
        },
        {
            code: "var construct = typeof Reflect !== \"undefined\" ? Reflect.construct : undefined; construct();",
            languageOptions: { globals: { Reflect: false } }
        },
        {
            code: "function foo(Intl) { Intl(); }",
            languageOptions: { globals: globals.browser }
        },
        {
            code: "if (foo) { const Intl = 1; Intl(); }",
            languageOptions: { ecmaVersion: 2015, globals: globals.browser }
        },
        {
            code: "if (foo) { const Intl = 1; new Intl(); }",
            languageOptions: { ecmaVersion: 2015, globals: globals.browser }
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
            code: "new Math;",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
        },
        {
            code: "new Math();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
        },
        {
            code: "new Math(foo);",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
        },
        {
            code: "new Math().foo;",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
        },
        {
            code: "(new Math).foo();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
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
            code: "var x = new JSON();",
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "NewExpression" }]
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
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = new Reflect();",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "NewExpression" }]
        },
        {
            code: "var x = Reflect();",
            languageOptions: { ecmaVersion: 2017 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "/*globals Reflect: true*/ Reflect();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "/*globals Reflect: true*/ new Reflect();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "NewExpression" }]
        },
        {
            code: "var x = Atomics();",
            languageOptions: { ecmaVersion: 2017 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = new Atomics();",
            languageOptions: { ecmaVersion: 2017 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "NewExpression" }]
        },
        {
            code: "var x = Atomics();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = Atomics();",
            languageOptions: { globals: { Atomics: false } },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = new Atomics();",
            languageOptions: { globals: { Atomics: "writable" } },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "NewExpression" }]
        },
        {
            code: "var x = Intl();",
            languageOptions: { globals: globals.browser },
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "CallExpression" }]
        },
        {
            code: "var x = new Intl();",
            languageOptions: { globals: globals.browser },
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "NewExpression" }]
        },
        {
            code: "/*globals Intl: true*/ Intl();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "CallExpression" }]
        },
        {
            code: "/*globals Intl: true*/ new Intl();",
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "NewExpression" }]
        },
        {
            code: "var x = globalThis.Math();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression" }]
        },
        {
            code: "var x = new globalThis.Math();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression" }]
        },
        {
            code: "f(globalThis.Math());",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 3, endColumn: 20 }]
        },
        {
            code: "globalThis.Math().foo;",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 18 }]
        },
        {
            code: "new globalThis.Math().foo;",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Math" }, type: "NewExpression", column: 1, endColumn: 22 }]
        },
        {
            code: "var x = globalThis.JSON();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "x = globalThis.JSON(str);",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "globalThis.Math( globalThis.JSON() );",
            languageOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "unexpectedCall", data: { name: "Math" }, type: "CallExpression", column: 1, endColumn: 37 },
                { messageId: "unexpectedCall", data: { name: "JSON" }, type: "CallExpression", column: 18, endColumn: 35 }
            ]
        },
        {
            code: "var x = globalThis.Reflect();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = new globalThis.Reflect;",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "NewExpression" }]
        },
        {
            code: "/*globals Reflect: true*/ Reflect();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = globalThis.Atomics();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var x = globalThis.Intl();",
            languageOptions: { globals: globals.browser, ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "CallExpression" }]
        },
        {
            code: "var x = new globalThis.Intl;",
            languageOptions: { globals: globals.browser, ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "NewExpression" }]
        },
        {
            code: "/*globals Intl: true*/ Intl();",
            languageOptions: { globals: globals.browser, ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Intl" }, type: "CallExpression" }]
        },
        {
            code: "var foo = bar ? baz: JSON; foo();",
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "var foo = bar ? baz: JSON; new foo();",
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "NewExpression" }]
        },
        {
            code: "var foo = bar ? baz: globalThis.JSON; foo();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "CallExpression" }]
        },
        {
            code: "var foo = bar ? baz: globalThis.JSON; new foo();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "JSON" }, type: "NewExpression" }]
        },
        {
            code: "var foo = window.Atomics; foo();",
            languageOptions: { ecmaVersion: 2020, globals: globals.browser },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "Atomics" }, type: "CallExpression" }]
        },
        {
            code: "var foo = window.Atomics; new foo;",
            languageOptions: { ecmaVersion: 2020, globals: globals.browser },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "Atomics" }, type: "NewExpression" }]
        },
        {
            code: "var foo = window.Intl; foo();",
            languageOptions: { ecmaVersion: 2020, globals: globals.browser },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "Intl" }, type: "CallExpression" }]
        },
        {
            code: "var foo = window.Intl; new foo;",
            languageOptions: { ecmaVersion: 2020, globals: globals.browser },
            errors: [{ messageId: "unexpectedRefCall", data: { name: "foo", ref: "Intl" }, type: "NewExpression" }]
        },

        // Optional chaining
        {
            code: "var x = globalThis?.Reflect();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        },
        {
            code: "var x = (globalThis?.Reflect)();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", data: { name: "Reflect" }, type: "CallExpression" }]
        }
    ]
});
