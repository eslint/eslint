/**
 * @fileoverview Rule to encourage the use of inclusive language that avoids discrimination against groups of people.
 * @author Drew Wyatt
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-inclusive-language"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("prefer-inclusive-language", rule, {
    valid: [
        {
            code: "const allowList = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const denyList = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "const blackList = ['foo', 'bar'];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "exclusive",
                data: { name: "blackList" },
                type: "Identifier"
            }]
        }
    ]
});
