/**
 * @fileoverview disallow using an async function as a Promise executor
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-async-promise-executor");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 8 } });

ruleTester.run("no-async-promise-executor", rule, {

    valid: [
        "new Promise((resolve, reject) => {})",
        "new Promise((resolve, reject) => {}, async function unrelated() {})",
        "new Foo(async (resolve, reject) => {})"
    ],

    invalid: [
        {
            code: "new Promise(async function foo(resolve, reject) {})",
            errors: [{
                messageId: "async",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "new Promise(async (resolve, reject) => {})",
            errors: [{
                messageId: "async",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "new Promise(((((async () => {})))))",
            errors: [{
                messageId: "async",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 22
            }]
        }
    ]
});
