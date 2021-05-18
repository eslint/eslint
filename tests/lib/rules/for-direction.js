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
const incorrectDirection = { messageId: "incorrectDirection" };

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
        "for(var i = 0; i < 10; i-=-1){}",
        "for(var i = 0; i <= 10; i-=-1){}",
        "for(var i = 10; i > 0; i-=1){}",
        "for(var i = 10; i >= 0; i-=1){}",
        "for(var i = 10; i > 0; i+=-1){}",
        "for(var i = 10; i >= 0; i+=-1){}",

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
        "for(var i = 10; i >= 0; i %= 2){}",
        "for(var i = 0; i < MAX; i += STEP_SIZE);",
        "for(var i = 0; i < MAX; i -= STEP_SIZE);",
        "for(var i = 10; i > 0; i += STEP_SIZE);"
    ],
    invalid: [

        // test if '++', '--'
        { code: "for(var i = 0; i < 10; i--){}", errors: [incorrectDirection] },
        { code: "for(var i = 0; i <= 10; i--){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i > 10; i++){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i >= 0; i++){}", errors: [incorrectDirection] },

        // test if '+=', '-='
        { code: "for(var i = 0; i < 10; i-=1){}", errors: [incorrectDirection] },
        { code: "for(var i = 0; i <= 10; i-=1){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i > 10; i+=1){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i >= 0; i+=1){}", errors: [incorrectDirection] },
        { code: "for(var i = 0; i < 10; i+=-1){}", errors: [incorrectDirection] },
        { code: "for(var i = 0; i <= 10; i+=-1){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i > 10; i-=-1){}", errors: [incorrectDirection] },
        { code: "for(var i = 10; i >= 0; i-=-1){}", errors: [incorrectDirection] }
    ]
});
