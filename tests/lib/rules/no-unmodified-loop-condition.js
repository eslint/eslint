/**
 * @fileoverview Tests for no-unmodified-loop-condition rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unmodified-loop-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-unmodified-loop-condition", rule, {
    valid: [
        "var foo = 0; while (foo) { ++foo; }",
        { code: "let foo = 0; while (foo) { ++foo; }", env: { es6: true } },
        "var foo = 0; while (foo) { foo += 1; }",
        "var foo = 0; while (foo++) { }",
        "var foo = 0; while (foo = next()) { }",
        "var foo = 0; while (ok(foo)) { }",
        "var foo = 0, bar = 0; while (++foo < bar) { }",
        "var foo = 0, obj = {}; while (foo === obj.bar) { }",
        "var foo = 0, f = {}, bar = {}; while (foo === f(bar)) { }",
        "var foo = 0, f = {}; while (foo === f()) { }",
        { code: "var foo = 0, tag = 0; while (foo === tag`abc`) { }", env: { es6: true } },
        { code: "function* foo() { var foo = 0; while (yield foo) { } }", env: { es6: true } },
        { code: "function* foo() { var foo = 0; while (foo === (yield)) { } }", env: { es6: true } },
        "var foo = 0; while (foo.ok) { }",
        "var foo = 0; while (foo) { update(); } function update() { ++foo; }",
        "var foo = 0, bar = 9; while (foo < bar) { foo += 1; }",
        "var foo = 0, bar = 1, baz = 2; while (foo ? bar : baz) { foo += 1; }",
        "var foo = 0, bar = 0; while (foo && bar) { ++foo; ++bar; }",
        "var foo = 0, bar = 0; while (foo || bar) { ++foo; ++bar; }",
        "var foo = 0; do { ++foo; } while (foo);",
        "var foo = 0; do { } while (foo++);",
        "for (var foo = 0; foo; ++foo) { }",
        "for (var foo = 0; foo;) { ++foo }",
        "var foo = 0, bar = 0; for (bar; foo;) { ++foo }",
        "var foo; if (foo) { }",
        "var a = [1, 2, 3]; var len = a.length; for (var i = 0; i < len - 1; i++) {}"
    ],
    invalid: [
        { code: "var foo = 0; while (foo) { } foo = 1;", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo = 0; while (!foo) { } foo = 1;", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo = 0; while (foo != null) { } foo = 1;", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo = 0, bar = 9; while (foo < bar) { } foo = 1;", errors: ["'foo' is not modified in this loop.", "'bar' is not modified in this loop."] },
        { code: "var foo = 0, bar = 0; while (foo && bar) { ++bar; } foo = 1;", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo = 0, bar = 0; while (foo && bar) { ++foo; } foo = 1;", errors: ["'bar' is not modified in this loop."] },
        { code: "var a, b, c; while (a < c && b < c) { ++a; } foo = 1;", errors: ["'b' is not modified in this loop.", "'c' is not modified in this loop."] },
        { code: "var foo = 0; while (foo ? 1 : 0) { } foo = 1;", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo = 0; while (foo) { update(); } function update(foo) { ++foo; }", errors: ["'foo' is not modified in this loop."] },
        { code: "var foo; do { } while (foo);", errors: ["'foo' is not modified in this loop."] },
        { code: "for (var foo = 0; foo < 10; ) { } foo = 1;", errors: ["'foo' is not modified in this loop."] }
    ]
});
