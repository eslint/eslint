/**
 * @fileoverview Tests for no-case-declarations rule.
 * @author Erik Arvidsson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-case-declarations"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

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
            errors: [{
                messageId: "unexpected",
                type: "FunctionDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: `
                switch (a) {
                    case 1:
                        { {}
                        function f() {}
                        break; }
                }
            `
                    }
                ]
            }]
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
            errors: [{
                messageId: "unexpected",
                type: "VariableDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: `
                switch (a) {
                    case 1:
                    case 2:
                        { let x; }
                }
            `
                    }
                ]
            }]
        },
        {
            code: `
                switch (a) {
                    case 1:
                        let x;
                    case 2:
                        let y;
                }
            `,
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "VariableDeclaration",
                    suggestions: [
                        {
                            messageId: "addBrackets",
                            output: `
                switch (a) {
                    case 1:
                        { let x; }
                    case 2:
                        let y;
                }
            `
                        }
                    ]
                },
                {
                    messageId: "unexpected",
                    type: "VariableDeclaration",
                    suggestions: [
                        {
                            messageId: "addBrackets",
                            output: `
                switch (a) {
                    case 1:
                        let x;
                    case 2:
                        { let y; }
                }
            `
                        }
                    ]
                }
            ]
        },
        {
            code: `
                switch (a) {
                    case 1:
                        let x;
                    default:
                        let y;
                }
            `,
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "VariableDeclaration",
                    suggestions: [
                        {
                            messageId: "addBrackets",
                            output: `
                switch (a) {
                    case 1:
                        { let x; }
                    default:
                        let y;
                }
            `
                        }
                    ]
                },
                {
                    messageId: "unexpected",
                    type: "VariableDeclaration",
                    suggestions: [
                        {
                            messageId: "addBrackets",
                            output: `
                switch (a) {
                    case 1:
                        let x;
                    default:
                        { let y; }
                }
            `
                        }
                    ]
                }
            ]
        },
        {
            code: "switch (a) { case 1: let x = 1; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "VariableDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { case 1: { let x = 1; break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { default: let x = 2; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "VariableDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { default: { let x = 2; break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { case 1: const x = 1; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "VariableDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { case 1: { const x = 1; break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { default: const x = 2; break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "VariableDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { default: { const x = 2; break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { case 1: function f() {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "FunctionDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { case 1: { function f() {} break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { default: function f() {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "FunctionDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { default: { function f() {} break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { case 1: class C {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "ClassDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { case 1: { class C {} break; } }"
                    }
                ]
            }]
        },
        {
            code: "switch (a) { default: class C {} break; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                type: "ClassDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: "switch (a) { default: { class C {} break; } }"
                    }
                ]
            }]
        },

        // https://github.com/eslint/eslint/pull/18388#issuecomment-2075356456
        {
            code: `
                switch ("foo") {
                    case "bar":
                        function baz() { }
                        break;
                    default:
                        baz();
                }
            `,
            languageOptions: { ecmaVersion: "latest" },
            errors: [{
                messageId: "unexpected",
                type: "FunctionDeclaration",
                suggestions: [
                    {
                        messageId: "addBrackets",
                        output: `
                switch ("foo") {
                    case "bar":
                        { function baz() { }
                        break; }
                    default:
                        baz();
                }
            `
                    }
                ]
            }]
        }
    ]
});
