/**
 * @fileoverview Tests for no-unused-labels rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-labels"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

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
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: { foo(); bar(); }",
            output: "{ foo(); bar(); }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: if (a) { foo(); bar(); }",
            output: "if (a) { foo(); bar(); }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
            output: "for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
            output: "for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: for (var i = 0; i < 10; ++i) { B: break A; }",
            output: "A: for (var i = 0; i < 10; ++i) { break A; }",
            errors: [{ messageId: "unused", data: { name: "B" } }]
        },
        {
            code: "A: { var A = 0; console.log(A); }",
            output: "{ var A = 0; console.log(A); }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: /* comment */ foo",
            output: null,
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A /* comment */: foo",
            output: null,
            errors: [{ messageId: "unused" }]
        },

        // https://github.com/eslint/eslint/issues/16988
        {
            code: 'A: "use strict"',
            output: null,
            errors: [{ messageId: "unused" }]
        },
        {
            code: '"use strict"; foo: "bar"',
            output: null,
            errors: [{ messageId: "unused" }]
        },
        {
            code: 'A: ("use strict")', // Parentheses may be removed by another rule.
            output: null,
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: `use strict`", // `use strict` may be changed to "use strict" by another rule.
            output: null,
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unused" }]
        },
        {
            code: "if (foo) { bar: 'baz' }",
            output: "if (foo) { 'baz' }",
            errors: [{ messageId: "unused" }]
        },
        {
            code: "A: B: 'foo'",
            output: "B: 'foo'",
            errors: [{ messageId: "unused" }, { messageId: "unused" }]
        },
        {
            code: "A: B: C: 'foo'",
            output: "B: C: 'foo'", // Becomes "C: 'foo'" on the second pass.
            errors: [{ messageId: "unused" }, { messageId: "unused" }, { messageId: "unused" }]
        },
        {
            code: "A: B: C: D: 'foo'",
            output: "B: D: 'foo'", // Becomes "D: 'foo'" on the second pass.
            errors: [
                { messageId: "unused" },
                { messageId: "unused" },
                { messageId: "unused" },
                { messageId: "unused" }]
        },
        {
            code: "A: B: C: D: E: 'foo'",
            output: "B: D: E: 'foo'", // Becomes "E: 'foo'" on the third pass.
            errors: [
                { messageId: "unused" },
                { messageId: "unused" },
                { messageId: "unused" },
                { messageId: "unused" },
                { messageId: "unused" }
            ]
        },
        {
            code: "A: 42",
            output: "42",
            errors: [{ messageId: "unused" }]
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
