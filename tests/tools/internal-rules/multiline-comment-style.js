"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/multiline-comment-style");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("internal-rules/multiline-comment-style", rule, {
    valid: [
        `
            //----------------
            // Rule Description
            //----------------
        `,
        `
            /*
             * Block comment
             */
        `,
        `
            // single-line comment
        `
    ],
    invalid: [
        {
            code: `
                // foo
                // bar
            `,
            output: `
                /*
                 * foo
                 * bar
                 */
            `,
            errors: [{ message: "Expected a block comment instead of consecutive line comments." }]
        }
    ]
});
