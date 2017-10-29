/**
 * @fileoverview Tests for no-unused-labels rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-labels"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unused-labels", rule, {
    valid: [
        "A: break A;",
        "A: { foo(); break A; bar(); }",
        "A: if (a) { foo(); if (b) break A; bar(); }",
        "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; bar(); }",
        "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue A; bar(); }",
        "A: { B: break B; C: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; if (c) continue C; bar(); } }",
        "A: { var A = 0; console.log(A); break A; console.log(A); }"
    ],
    invalid: [
        {
            code: "A: var foo = 0;",
            output: "var foo = 0;",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: { foo(); bar(); }",
            output: "{ foo(); bar(); }",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: if (a) { foo(); bar(); }",
            output: "if (a) { foo(); bar(); }",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
            output: "for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
            output: "for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { B: break A; }",
            output: "A: for (var i = 0; i < 10; ++i) { break A; }",
            errors: ["'B:' is defined but never used."]
        },
        {
            code: "A: { var A = 0; console.log(A); }",
            output: "{ var A = 0; console.log(A); }",
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A: /* comment */ foo",
            output: null,
            errors: ["'A:' is defined but never used."]
        },
        {
            code: "A /* comment */: foo",
            output: null,
            errors: ["'A:' is defined but never used."]
        }

        /*
         * Below is fatal errors.
         * "A: break B",
         * "A: function foo() { break A; }",
         * "A: class Foo { foo() { break A; } }",
         * "A: { A: { break A; } }"
         */
    ]
});
