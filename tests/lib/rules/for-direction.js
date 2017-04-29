/**
 * @fileoverview Tests for for-direction rule.
 * @author Aladdin-ADD <hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/for-direction");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("for-direction", rule, {
    valid: [

        // test if '++', '--'
        { code: "for(var i = 0; i < 10; i++){}" },
        { code: "for(var i = 0; i <= 10; i++){}" },
        { code: "for(var i = 10; i > 0; i--){}" },
        { code: "for(var i = 10; i >= 0; i--){}" },

        // test if '+=', '-=',
        { code: "for(var i = 0; i < 10; i+=1){}" },
        { code: "for(var i = 0; i <= 10; i+=1){}" },
        { code: "for(var i = 10; i > 0; i-=1){}" },
        { code: "for(var i = 10; i >= 0; i-=1){}" },

        // test if no update.
        { code: "for(var i = 10; i > 0;){}" },
        { code: "for(var i = 10; i >= 0;){}" },
        { code: "for(var i = 10; i < 0;){}" },
        { code: "for(var i = 10; i <= 0;){}" }
    ],
    invalid: [

        // test if '++', '--'
        { code: "for(var i = 0; i < 10; i--){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 0; i <= 10; i--){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 10; i > 10; i++){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 10; i >= 0; i++){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },

        // test if '+=', '-='
        { code: "for(var i = 0; i < 10; i-=1){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 0; i <= 10; i-=1){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 10; i > 10; i+=1){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] },
        { code: "for(var i = 10; i >= 0; i+=1){}", errors: [{ message: "enforce \"for\" loop update clause moving the counter in the right direction." }] }
    ]
});
