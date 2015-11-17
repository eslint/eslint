/**
 * @fileoverview Tests for id-length rule.
 * @author Burak Yigit Kaya
 * @copyright 2015 Mathieu M-Gosselin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/id-length"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
        { code: "var x = Foo(42)", options: [{ "min": 1 }] },
        { code: "var x = Foo(42)", options: [{ "min": 0 }] },
        { code: "foo.$x = Foo(42)", options: [{ "min": 1 }] },
        { code: "var lalala = Foo(42)", options: [{ "max": 6 }] },
        { code: "for (var q, h=0; h < 10; h++) { console.log(h); q++; }", options: [{ exceptions: ["h", "q"] }] },
        { code: "(num) => { num * num };", ecmaFeatures: { arrowFunctions: true } },
        { code: "function foo(num = 0) { }", ecmaFeatures: { defaultParams: true } },
        { code: "class MyClass { }", ecmaFeatures: { classes: true } },
        { code: "class Foo { method() {} }", ecmaFeatures: { classes: true } },
        { code: "function foo(...args) { }", ecmaFeatures: { restParams: true } },
        { code: "var { prop } = {};", ecmaFeatures: { destructuring: true } },
        { code: "var { prop: a } = {};", ecmaFeatures: { destructuring: true } },
        { code: "var { prop: [x] } = {};", ecmaFeatures: { destructuring: true } },
        { code: "import something from 'y';", ecmaFeatures: { modules: true } },
        { code: "export var num = 0;", ecmaFeatures: { modules: true } },
        { code: "({ prop: obj.x.y.something }) = {};", ecmaFeatures: { destructuring: true } },
        { code: "({ prop: obj.longName }) = {};", ecmaFeatures: { destructuring: true } },
        { code: "var obj = { a: 1, bc: 2 };", options: [{ "properties": "never" }] },
        { code: "var obj = {}; obj.a = 1; obj.bc = 2;", options: [{ "properties": "never" }] },
        { code: "({ a: obj.x.y.z }) = {};", options: [{ "properties": "never" }], ecmaFeatures: { destructuring: true } },
        { code: "({ prop: obj.x }) = {};", options: [{ "properties": "never" }], ecmaFeatures: { destructuring: true } },
        { code: "var obj = { aaaaa: 1 };", options: [{ "max": 4, "properties": "never" }] },
        { code: "var obj = {}; obj.aaaaa = 1;", options: [{ "max": 4, "properties": "never" }] },
        { code: "({ a: obj.x.y.z }) = {};", options: [{ "max": 4, "properties": "never" }], ecmaFeatures: { destructuring: true } },
        { code: "({ prop: obj.xxxxx }) = {};", options: [{ "max": 4, "properties": "never" }], ecmaFeatures: { destructuring: true } }
    ],
    invalid: [
        { code: "var x = 1;", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }] },
        { code: "var x;", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }] },
        { code: "function x() {};", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }] },
        { code: "function xyz(a) {};", errors: [{ message: "Identifier name 'a' is too short. (< 2)", type: "Identifier" }] },
        { code: "var obj = { a: 1, bc: 2 };", errors: [{ message: "Identifier name 'a' is too short. (< 2)", type: "Identifier" }] },
        { code: "try { blah(); } catch (e) { /* pass */ }", errors: [{ message: "Identifier name 'e' is too short. (< 2)", type: "Identifier" }] },
        { code: "var handler = function (e) {};", errors: [{ message: "Identifier name 'e' is too short. (< 2)", type: "Identifier" }] },
        { code: "for (var i=0; i < 10; i++) { console.log(i); }", errors: [{ message: "Identifier name 'i' is too short. (< 2)", type: "Identifier" }] },
        { code: "var j=0; while (j > -10) { console.log(--j); }", errors: [{ message: "Identifier name 'j' is too short. (< 2)", type: "Identifier" }] },
        { code: "var _$xt_$ = Foo(42)", options: [{ "min": 2, "max": 4 }], errors: [
            { message: "Identifier name '_$xt_$' is too long. (> 4)", type: "Identifier" }
        ]},
        { code: "var _$x$_t$ = Foo(42)", options: [{ "min": 2, "max": 4 }], errors: [
            { message: "Identifier name '_$x$_t$' is too long. (> 4)", type: "Identifier" }
        ]},
        { code: "(a) => { a * a };", ecmaFeatures: { arrowFunctions: true }, errors: [
            { message: "Identifier name 'a' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "function foo(x = 0) { }", ecmaFeatures: { defaultParams: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "class x { }", ecmaFeatures: { classes: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "class Foo { x() {} }", ecmaFeatures: { classes: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "function foo(...x) { }", ecmaFeatures: { restParams: true}, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "var { x} = {};", ecmaFeatures: { destructuring: true}, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" },
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "var { x: a} = {};", ecmaFeatures: { destructuring: true}, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "var { a: [x]} = {};", ecmaFeatures: { destructuring: true }, errors: [
            { message: "Identifier name 'a' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "import x from 'y';", ecmaFeatures: { modules: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "export var x = 0;", ecmaFeatures: { modules: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "({ a: obj.x.y.z }) = {};", ecmaFeatures: { destructuring: true }, errors: [
            { message: "Identifier name 'a' is too short. (< 2)", type: "Identifier" },
            { message: "Identifier name 'z' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "({ prop: obj.x }) = {};", ecmaFeatures: { destructuring: true }, errors: [
            { message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }
        ]},
        { code: "var x = 1;", options: [{ "properties": "never" }], errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier" }] }
    ]
});
