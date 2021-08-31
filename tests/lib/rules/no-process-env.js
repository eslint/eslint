/**
 * @fileoverview Tests for no-process-env rule.
 * @author Vignesh Anand
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-process-env"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-process-env", rule, {

    valid: [
        "Process.env",
        "process[env]",
        "process.nextTick",
        "process.execArgv"
    ],

    invalid: [
        {
            code: "process.env",
            errors: [{
                messageId: "unexpectedProcessEnv",
                type: "MemberExpression"
            }]
        },
        {
            code: "process.env.ENV",
            errors: [{
                messageId: "unexpectedProcessEnv",
                type: "MemberExpression"
            }]
        },
        {
            code: "f(process.env)",
            errors: [{
                messageId: "unexpectedProcessEnv",
                type: "MemberExpression"
            }]
        }
    ]
});
