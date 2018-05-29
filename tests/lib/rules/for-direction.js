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
        "for(var i = 0; i < 10; i++){}",
        "for(var i = 0; i <= 10; i++){}",
        "for(var i = 10; i > 0; i--){}",
        "for(var i = 10; i >= 0; i--){}",

        // test if '+=', '-=',
        "for(var i = 0; i < 10; i+=1){}",
        "for(var i = 0; i <= 10; i+=1){}",
        "for(var i = 10; i > 0; i-=1){}",
        "for(var i = 10; i >= 0; i-=1){}",
        "for (var i = 0; i < MAX; i += STEP_SIZE);",
        "for (var i = MAX; i > MIN; i -= STEP_SIZE);",

        // test if no update.
        "for(var i = 10; i > 0;){}",
        "for(var i = 10; i >= 0;){}",
        "for(var i = 10; i < 0;){}",
        "for(var i = 10; i <= 0;){}",
        "for(var i = 10; i <= 0; j++){}",
        "for(var i = 10; i <= 0; j--){}",
        "for(var i = 10; i >= 0; j++){}",
        "for(var i = 10; i >= 0; j--){}",
        "for(var i = 10; i >= 0; j += 2){}",
        "for(var i = 10; i >= 0; j -= 2){}",
        "for(var i = 10; i >= 0; i |= 2){}",
        "for(var i = 10; i >= 0; i %= 2){}"
    ],
    invalid: [

        // test if '++', '--'
        { code: "for(var i = 0; i < 10; i--){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 0; i <= 10; i--){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 10; i > 10; i++){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 10; i >= 0; i++){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },

        // test if '+=', '-='
        { code: "for(var i = 0; i < 10; i-=1){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 0; i <= 10; i-=1){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 10; i > 10; i+=1){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for(var i = 10; i >= 0; i+=1){}", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for (var i = 0; i < MAX; i -= STEP_SIZE);", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] },
        { code: "for (var i = 0; i > MIN; i += STEP_SIZE);", errors: [{ message: "The update clause in this loop moves the variable in the wrong direction." }] }
    ]
});
