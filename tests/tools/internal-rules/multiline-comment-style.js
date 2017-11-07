"use strict";

const rule = require("../../../tools/internal-rules/multiline-comment-style");
const RuleTester = require("../../../lib/testers/rule-tester");
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
