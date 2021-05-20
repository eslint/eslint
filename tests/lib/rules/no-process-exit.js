/**
 * @fileoverview Disallow the use of process.exit()
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-process-exit"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-process-exit", rule, {

    valid: [
        "Process.exit()",
        "var exit = process.exit;",
        "f(process.exit)"
    ],

    invalid: [
        {
            code: "process.exit(0);",
            errors: [{
                messageId: "noProcessExit",
                type: "CallExpression"
            }]
        },
        {
            code: "process.exit(1);",
            errors: [{
                messageId: "noProcessExit",
                type: "CallExpression"
            }]
        },
        {
            code: "f(process.exit(1));",
            errors: [{
                messageId: "noProcessExit",
                type: "CallExpression"
            }]
        }
    ]
});
