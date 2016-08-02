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

const ruleTester = new RuleTester();

ruleTester.run("no-class-assign", rule, {
    valid: [
        {code: "class A { } foo(A);", parserOptions: { ecmaVersion: 6 }},
        {code: "let A = class A { }; foo(A);", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { b(A) { A = 0; } }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { b() { let A; A = 0; } }", parserOptions: { ecmaVersion: 6 }},
        {code: "let A = class { b() { A = 0; } }", parserOptions: { ecmaVersion: 6 }},

        // ignores non class.
        {code: "var x = 0; x = 1;"},
        {code: "let x = 0; x = 1;", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 0; x = 1;", parserOptions: { ecmaVersion: 6 }},
        {code: "function x() {} x = 1;"},
        {code: "function foo(x) { x = 1; }"},
        {code: "try {} catch (x) { x = 1; }"}
    ],
    invalid: [
        {
            code: "class A { } A = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } ({A}) = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } ({b: A = 0}) = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "A = 0; class A { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "class A { b() { A = 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "let A = class A { b() { A = 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'A' is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } A = 0; A = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {message: "'A' is a class.", type: "Identifier", line: 1, column: 13},
                {message: "'A' is a class.", type: "Identifier", line: 1, column: 20}
            ]
        }
    ]
});
