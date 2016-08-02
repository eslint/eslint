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

const ruleTester = new RuleTester();

ruleTester.run("no-const-assign", rule, {
    valid: [
        {code: "const x = 0; { let x; x = 1; }", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 0; function a(x) { x = 1; }", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 0; foo(x);", parserOptions: { ecmaVersion: 6 }},
        {code: "for (const x in [1,2,3]) { foo(x); }", parserOptions: { ecmaVersion: 6 }},
        {code: "for (const x of [1,2,3]) { foo(x); }", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = {key: 0}; x.key = 1;", parserOptions: { ecmaVersion: 6 }},

        // ignores non constant.
        {code: "var x = 0; x = 1;"},
        {code: "let x = 0; x = 1;", parserOptions: { ecmaVersion: 6 }},
        {code: "function x() {} x = 1;"},
        {code: "function foo(x) { x = 1; }"},
        {code: "class X {} X = 1;", parserOptions: { ecmaVersion: 6 }},
        {code: "try {} catch (x) { x = 1; }"}
    ],
    invalid: [
        {
            code: "const x = 0; x = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const {a: x} = {a: 0}; x = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ({x}) = {x: 1};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ({a: x = 1}) = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; x += 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ++x;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "for (const i = 0; i < 10; ++i) { foo(i); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'i' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; x = 1; x = 2;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {message: "'x' is constant.", type: "Identifier", line: 1, column: 14},
                {message: "'x' is constant.", type: "Identifier", line: 1, column: 21}
            ]
        },
        {
            code: "const x = 0; function foo() { x = x + 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; function foo(a) { x = a; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; while (true) { x = x + 1; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "'x' is constant.", type: "Identifier"}]
        }
    ]
});
