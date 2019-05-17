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
        "A: switch (a) { case 0: switch (b) { case 0: break A; } }",
        "A: for (;;) { while (b) { break A; } }",
        "A: do { switch (b) { case 0: break A; break; } } while (a);",
        "A: for (a in obj) { while (b) { break A; } }",
        { code: "A: for (a of ary) { switch (b) { case 0: break A; } }", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        {
            code: "A: while (a) break A;",
            output: "A: while (a) break;",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: while (a) { B: { continue A; } }",
            output: "A: while (a) { B: { continue; } }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "X: while (x) { A: while (a) { B: { break A; break B; continue X; } } }",
            output: "X: while (x) { A: while (a) { B: { break; break B; continue X; } } }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: do { break A; } while (a);",
            output: "A: do { break; } while (a);",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: for (;;) { break A; }",
            output: "A: for (;;) { break; }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: for (a in obj) { break A; }",
            output: "A: for (a in obj) { break; }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: for (a of ary) { break A; }",
            output: "A: for (a of ary) { break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "A: switch (a) { case 0: break A; }",
            output: "A: switch (a) { case 0: break; }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "X: while (x) { A: switch (a) { case 0: break A; } }",
            output: "X: while (x) { A: switch (a) { case 0: break; } }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: "X: switch (a) { case 0: A: while (b) break A; }",
            output: "X: switch (a) { case 0: A: while (b) break; }",
            errors: [{ messageId: "unexpected", data: { name: "A" } }]
        },
        {
            code: `\
                A: while (true) {
                    break A;
                    while (true) {
                        break A;
                    }
                }
            `,
            output: `\
                A: while (true) {
                    break;
                    while (true) {
                        break A;
                    }
                }
            `,
            errors: [{ messageId: "unexpected", data: { name: "A" }, type: "Identifier", line: 2 }]
        }
    ]
});
