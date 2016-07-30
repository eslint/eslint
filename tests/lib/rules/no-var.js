/**
 * @fileoverview Tests for no-var rule.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-var", rule, {
    valid: [
        {
            code: "const JOE = 'schmoe';",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let moo = 'car';",
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "var foo = bar;",
            output: "let foo = bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar, toast = most;",
            output: "let foo = bar, toast = most;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar; let toast = most;",
            output: "let foo = bar; let toast = most;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },

        // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
        {
            code: "var a, b, c; var a;",
            output: "var a, b, c; var a;",
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a; if (b) { var a; }",
            output: "var a; if (b) { var a; }",
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "if (foo) { var a, b, c; } a;",
            output: "if (foo) { var a, b, c; } a;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var i = 0; i < 10; ++i) {} i;",
            output: "for (var i = 0; i < 10; ++i) {} i;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a in obj) {} a;",
            output: "for (var a in obj) {} a;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a of list) {} a;",
            output: "for (var a of list) {} a;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "switch (a) { case 0: var b = 1 }",
            output: "switch (a) { case 0: var b = 1 }",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
    ]
});
