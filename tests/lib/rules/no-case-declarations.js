/**
 * @fileoverview Tests for no-case-declarations rule.
 * @author Erik Arvidsson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-case-declarations"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-case-declarations", rule, {
    valid: [
        {
            code: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }",
            languageOptions: { ecmaVersion: 6 }
        },
        `
                switch (a) {
                    case 1:
                    case 2: {}
                }
            `,
        `
                switch (a) {
                    case 1: var x;
                }
            `
    ],
    invalid: [
        {
            code: `
                switch (a) {
                    case 1:
                        {}
                        function f() {}
                        break;
                }
            `,
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: `
                switch (a) {
                    case 1:
                    case 2:
                        let x;
                }
            `,
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { case 1: let x = 1; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { default: let x = 2; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { case 1: const x = 1; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { default: const x = 2; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "VariableDeclaration" }]
        },
        {
            code: "switch (a) { case 1: function f() {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: "switch (a) { default: function f() {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "FunctionDeclaration" }]
        },
        {
            code: "switch (a) { case 1: class C {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "ClassDeclaration" }]
        },
        {
            code: "switch (a) { default: class C {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "ClassDeclaration" }]
        }
    ]
});
