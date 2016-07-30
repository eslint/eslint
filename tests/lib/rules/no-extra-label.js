/**
 * @fileoverview Tests for no-extra-label rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-label"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-extra-label", rule, {
    valid: [
        "A: break A;",
        "A: { if (a) break A; }",
        "A: { while (b) { break A; } }",
        "A: { switch (b) { case 0: break A; } }",
        "A: while (a) { while (b) { break; } break; }",
        "A: while (a) { while (b) { break A; } }",
        "A: while (a) { while (b) { continue A; } }",
        "A: while (a) { switch (b) { case 0: break A; } }",
        "A: while (a) { switch (b) { case 0: continue A; } }",
        "A: switch (a) { case 0: while (b) { break A; } }",
        "A: switch (a) { case 0: while (b) { break A; } }",
        "A: switch (a) { case 0: switch (b) { case 0: break A; } }",
        "A: switch (a) { case 0: switch (b) { case 0: break A; } }",
        "A: for (;;) { while (b) { break A; } }",
        "A: do { switch (b) { case 0: break A; break; } } while (a);",
        "A: for (a in obj) { while (b) { break A; } }",
        {code: "A: for (a of ary) { switch (b) { case 0: break A; } }", parserOptions: {ecmaVersion: 6}}
    ],
    invalid: [
        {code: "A: while (a) break A;", errors: ["This label 'A' is unnecessary."]},
        {code: "A: while (a) { B: { continue A; } }", errors: ["This label 'A' is unnecessary."]},
        {code: "X: while (x) { A: while (a) { B: { break A; break B; continue X; } } }", errors: ["This label 'A' is unnecessary."]},
        {code: "A: do { break A; } while (a);", errors: ["This label 'A' is unnecessary."]},
        {code: "A: for (;;) { break A; }", errors: ["This label 'A' is unnecessary."]},
        {code: "A: for (a in obj) { break A; }", errors: ["This label 'A' is unnecessary."]},
        {code: "A: for (a of ary) { break A; }", errors: ["This label 'A' is unnecessary."], parserOptions: {ecmaVersion: 6}},
        {code: "A: switch (a) { case 0: break A; }", errors: ["This label 'A' is unnecessary."]},
        {code: "X: while (x) { A: switch (a) { case 0: break A; } }", errors: ["This label 'A' is unnecessary."]},
        {code: "X: switch (a) { case 0: A: while (b) break A; }", errors: ["This label 'A' is unnecessary."]}
    ]
});
