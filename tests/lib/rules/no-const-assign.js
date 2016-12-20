/**
 * @fileoverview Tests for no-const-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-const-assign");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-const-assign", rule, {
    valid: [
        "const x = 0; { let x; x = 1; }",
        "const x = 0; function a(x) { x = 1; }",
        "const x = 0; foo(x);",
        "for (const x in [1,2,3]) { foo(x); }",
        "for (const x of [1,2,3]) { foo(x); }",
        "const x = {key: 0}; x.key = 1;",

        // ignores non constant.
        "var x = 0; x = 1;",
        "let x = 0; x = 1;",
        "function x() {} x = 1;",
        "function foo(x) { x = 1; }",
        "class X {} X = 1;",
        "try {} catch (x) { x = 1; }"
    ],
    invalid: [
        {
            code: "const x = 0; x = 1;",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const {a: x} = {a: 0}; x = 1;",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; ({x}) = {x: 1};",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; ({a: x = 1}) = {};",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; x += 1;",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; ++x;",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "for (const i = 0; i < 10; ++i) { foo(i); }",
            errors: [{ message: "'i' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; x = 1; x = 2;",
            errors: [
                { message: "'x' is constant.", type: "Identifier", line: 1, column: 14 },
                { message: "'x' is constant.", type: "Identifier", line: 1, column: 21 }
            ]
        },
        {
            code: "const x = 0; function foo() { x = x + 1; }",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; function foo(a) { x = a; }",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        },
        {
            code: "const x = 0; while (true) { x = x + 1; }",
            errors: [{ message: "'x' is constant.", type: "Identifier" }]
        }
    ]
});
