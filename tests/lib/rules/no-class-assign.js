/**
 * @fileoverview Tests for no-class-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-class-assign");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-class-assign", rule, {
    valid: [
        "class A { } foo(A);",
        "let A = class A { }; foo(A);",
        "class A { b(A) { A = 0; } }",
        "class A { b() { let A; A = 0; } }",
        "let A = class { b() { A = 0; } }",

        // ignores non class.
        "var x = 0; x = 1;",
        "let x = 0; x = 1;",
        "const x = 0; x = 1;",
        "function x() {} x = 1;",
        "function foo(x) { x = 1; }",
        "try {} catch (x) { x = 1; }"
    ],
    invalid: [
        {
            code: "class A { } A = 0;",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "class A { } ({A} = 0);",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "class A { } ({b: A = 0} = {});",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "A = 0; class A { }",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "class A { b() { A = 0; } }",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "let A = class A { b() { A = 0; } }",
            errors: [{ messageId: "class", data: { name: "A" }, type: "Identifier" }]
        },
        {
            code: "class A { } A = 0; A = 1;",
            errors: [
                { messageId: "class", data: { name: "A" }, type: "Identifier", line: 1, column: 13 },
                { messageId: "class", data: { name: "A" }, type: "Identifier", line: 1, column: 20 }
            ]
        }
    ]
});
