/**
 * @fileoverview Tests for no-var rule.
 * @author Jamund Ferguson
 * @copyright 2014 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

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
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        }
    ]
});
