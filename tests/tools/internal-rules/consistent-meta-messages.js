/**
 * @fileoverview Tests for consistent-meta-messages rule.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/consistent-meta-messages");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("consistent-meta-messages", rule, {
    valid: [
        `module.exports = {
            meta: {
                messages: {unexpected: "an error occurs."}
            }
        };`
    ],
    invalid: [
        {
            code: `
            module.exports = {
                meta: {}
            };`,
            errors: [{ messageId: "expectedMessages" }]
        }
    ]
});
