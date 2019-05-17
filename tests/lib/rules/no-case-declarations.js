/**
 * @fileoverview Tests for no-case-declarations rule.
 * @author Erik Arvidsson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-case-declarations"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-case-declarations", rule, {
    valid: [
        {
            code: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "switch (a) { case 1: let x = 1; break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { default: let x = 2; break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { case 1: const x = 1; break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { default: const x = 2; break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { case 1: function f() {} break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: "switch (a) { default: function f() {} break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: "switch (a) { case 1: class C {} break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "ClassDeclaration" }]
        },
        {
            code: "switch (a) { default: class C {} break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "ClassDeclaration" }]
        }
    ]
});
