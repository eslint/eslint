/**
 * @fileoverview Disallow the use of process.exit()
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-process-exit", {

    valid: [
        "Process.exit()",
        "var exit = process.exit;",
        "f(process.exit)"
    ],

    invalid: [
        {
            code: "process.exit(0);",
            errors: [{
                message: "Don't use process.exit(); throw an error instead.",
                type: "CallExpression"
            }]
        },
        {
            code: "process.exit(1);",
            errors: [{
                message: "Don't use process.exit(); throw an error instead.",
                type: "CallExpression"
            }]
        },
        {
            code: "f(process.exit(1));",
            errors: [{
                message: "Don't use process.exit(); throw an error instead.",
                type: "CallExpression"
            }]
        }
    ]
});
