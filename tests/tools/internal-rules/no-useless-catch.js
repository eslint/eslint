/**
 * @fileoverview Tests for no-useless-throw rule
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/no-useless-catch");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new RuleTester({ parserOptions: { ecmaVersion: 6 } }).run("rulesdir/no-useless-catch", rule, {
    valid: [
        `
            try {
                foo();
            } catch (err) {
                console.error(err);
            } finally {
                foo;
            }
        `,
        `
            try {
                foo();
            } catch ({ err }) {
                throw err;
            }
        `
    ],
    invalid: [
        {
            code: `
                try {
                    foo();
                } catch (e) {
                    throw e;
                }
            `,
            errors: [{ message: "Unnecessary try/catch wrapper." }]
        },
        {
            code: `
                try {
                    foo();
                } catch (e) {
                    throw e;
                } finally {
                    foo();
                }
            `,
            errors: [{ message: "Unnecessary catch clause." }]
        }
    ]
});
