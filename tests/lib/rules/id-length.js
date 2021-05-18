/**
 * @fileoverview Tests for id-length rule.
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/id-length"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const tooShortError = { messageId: "tooShort", type: "Identifier" };
const tooLongError = { messageId: "tooLong", type: "Identifier" };

ruleTester.run("id-length", rule, {
    valid: [
        "var xyz;",
        "var xy = 1;",
        "function xyz() {};",
        "function xyz(abc, de) {};",
        "var obj = { abc: 1, de: 2 };",
        "var obj = { 'a': 1, bc: 2 };",
        "var obj = {}; obj['a'] = 2;",
        "abc = d;",
        "try { blah(); } catch (err) { /* pass */ }",
        "var handler = function ($e) {};",
        "var _a = 2",
        "var _ad$$ = new $;",
        "var xyz = new ΣΣ();",
        "unrelatedExpressionThatNeedsToBeIgnored();",
        "var obj = { 'a': 1, bc: 2 }; obj.tk = obj.a;",
        "var query = location.query.q || '';",
        "var query = location.query.q ? location.query.q : ''",
        { code: "var x = Foo(42)", options: [{ min: 1 }] },
        { code: "var x = Foo(42)", options: [{ min: 0 }] },
        { code: "foo.$x = Foo(42)", options: [{ min: 1 }] },
        { code: "var lalala = Foo(42)", options: [{ max: 6 }] },
        { code: "for (var q, h=0; h < 10; h++) { console.log(h); q++; }", options: [{ exceptions: ["h", "q"] }] },
        { code: "(num) => { num * num };", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(num = 0) { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class MyClass { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class Foo { method() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(...args) { }", parserOptions: { ecmaVersion: 6 } },
        { code: "var { prop } = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var { prop: a } = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var { prop: [x] } = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "import something from 'y';", parserOptions: { sourceType: "module" } },
        { code: "export var num = 0;", parserOptions: { sourceType: "module" } },
        { code: "({ prop: obj.x.y.something } = {});", parserOptions: { ecmaVersion: 6 } },
        { code: "({ prop: obj.longName } = {});", parserOptions: { ecmaVersion: 6 } },
        { code: "var obj = { a: 1, bc: 2 };", options: [{ properties: "never" }] },
        { code: "var obj = {}; obj.a = 1; obj.bc = 2;", options: [{ properties: "never" }] },
        { code: "({ a: obj.x.y.z } = {});", options: [{ properties: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "({ prop: obj.x } = {});", options: [{ properties: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "var obj = { aaaaa: 1 };", options: [{ max: 4, properties: "never" }] },
        { code: "var obj = {}; obj.aaaaa = 1;", options: [{ max: 4, properties: "never" }] },
        { code: "({ a: obj.x.y.z } = {});", options: [{ max: 4, properties: "never" }], parserOptions: { ecmaVersion: 6 } },
        { code: "({ prop: obj.xxxxx } = {});", options: [{ max: 4, properties: "never" }], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "var x = 1;", errors: [tooShortError] },
        { code: "var x;", errors: [tooShortError] },
        { code: "obj.e = document.body;", errors: [tooShortError] },
        { code: "function x() {};", errors: [tooShortError] },
        { code: "function xyz(a) {};", errors: [tooShortError] },
        { code: "var obj = { a: 1, bc: 2 };", errors: [tooShortError] },
        { code: "try { blah(); } catch (e) { /* pass */ }", errors: [tooShortError] },
        { code: "var handler = function (e) {};", errors: [tooShortError] },
        { code: "for (var i=0; i < 10; i++) { console.log(i); }", errors: [tooShortError] },
        { code: "var j=0; while (j > -10) { console.log(--j); }", errors: [tooShortError] },
        {
            code: "var _$xt_$ = Foo(42)",
            options: [{ min: 2, max: 4 }],
            errors: [
                tooLongError
            ]
        },
        {
            code: "var _$x$_t$ = Foo(42)",
            options: [{ min: 2, max: 4 }],
            errors: [
                tooLongError
            ]
        },
        {
            code: "(a) => { a * a };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "function foo(x = 0) { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "class x { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "class Foo { x() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "function foo(...x) { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "var { x} = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError,
                tooShortError
            ]
        },
        {
            code: "var { x: a} = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "var { a: [x]} = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        {
            code: "import x from 'y';",
            parserOptions: { sourceType: "module" },
            errors: [
                tooShortError
            ]
        },
        {
            code: "export var x = 0;",
            parserOptions: { sourceType: "module" },
            errors: [
                tooShortError
            ]
        },
        {
            code: "({ a: obj.x.y.z } = {});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError,
                tooShortError
            ]
        },
        {
            code: "({ prop: obj.x } = {});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                tooShortError
            ]
        },
        { code: "var x = 1;", options: [{ properties: "never" }], errors: [tooShortError] }
    ]
});
