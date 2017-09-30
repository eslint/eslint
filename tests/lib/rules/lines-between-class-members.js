/**
 * @fileoverview Tests for lines-between-class-members rule.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-between-class-members");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = "Expected blank line between class members.";
const NEVER_MESSAGE = "Unexpected blank line between class members.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("lines-between-class-members", rule, {
    valid: [
        "class foo{}",
        "class foo{;;}",
        "class foo{\n\n}",
        "class foo{constructor(){}\n}",
        "class foo{\nconstructor(){}}",

        "class foo{ bar(){}\n\nbaz(){}}",
        "class foo{ bar(){}\n\n/*comments*/baz(){}}",
        "class foo{ bar(){}\n\n//comments\nbaz(){}}",

        "class foo{ bar(){}\n\n;;baz(){}}",
        "class foo{ bar(){};\n\nbaz(){}}",

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n/*comments*/baz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n//comments\nbaz(){}}", options: ["never"] },

        { code: "class foo{ bar(){}\n\nbaz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n/*comments*/baz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n//comments\nbaz(){}}", options: ["always"] },

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["always", { exceptAfterSingleLine: true }] },
        { code: "class foo{ bar(){\n}\n\nbaz(){}}", options: ["always", { exceptAfterSingleLine: true }] }
    ],
    invalid: [
        {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            options: ["always"],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: ["never"],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }
    ]
});
