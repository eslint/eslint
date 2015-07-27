/**
 * @fileoverview Tests for id-length rule.
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/id-length", {
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
        { code: "var x = Foo(42)", options: [{"min": 1}] },
        { code: "var x = Foo(42)", options: [{"min": 0}] },
        { code: "foo.$x = Foo(42)", options: [{"min": 1}] },
        { code: "var lalala = Foo(42)", options: [{"max": 6}] },
        { code: "for (var q, h=0; h < 10; h++) { console.log(h); q++;}", options: [{exceptions: ["h", "q"]}] }
    ],
    invalid: [
        { code: "var x = 1;", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier"}] },
        { code: "var x;", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier"}] },
        { code: "function x() {};", errors: [{ message: "Identifier name 'x' is too short. (< 2)", type: "Identifier"}] },
        { code: "function xyz(a) {};", errors: [{ message: "Identifier name 'a' is too short. (< 2)", type: "Identifier"}] },
        { code: "var obj = {a: 1, bc: 2};", errors: [{ message: "Identifier name 'a' is too short. (< 2)", type: "Identifier"}] },
        { code: "try { blah(); } catch (e) { /* pass */ }", errors: [{ message: "Identifier name 'e' is too short. (< 2)", type: "Identifier"}] },
        { code: "var handler = function (e) {};", errors: [{ message: "Identifier name 'e' is too short. (< 2)", type: "Identifier"}] },
        { code: "for (var i=0; i < 10; i++) { console.log(i); }", errors: [{ message: "Identifier name 'i' is too short. (< 2)", type: "Identifier"}] },
        { code: "var j=0; while (j > -10) { console.log(--j); }", errors: [{ message: "Identifier name 'j' is too short. (< 2)", type: "Identifier"}] },
        { code: "var _$xt_$ = Foo(42)", options: [{"min": 2, "max": 4}], errors: [
            { message: "Identifier name '_$xt_$' is too long. (> 4)", type: "Identifier"}
        ]},
        { code: "var _$x$_t$ = Foo(42)", options: [{"min": 2, "max": 4}], errors: [
            { message: "Identifier name '_$x$_t$' is too long. (> 4)", type: "Identifier"}
        ] }
    ]
});
