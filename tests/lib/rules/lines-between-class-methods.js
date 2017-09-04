/**
 * @fileoverview Tests for lines-between-class-methods rule.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-between-class-methods");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = "Methods must be padded by blank lines.";
const NEVER_MESSAGE = "Methods must not be padded by blank lines.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("lines-between-class-methods", rule, {
    valid: [
        "class foo{}",
        "class foo{\n\n}",
        "class foo{constructor(){}\n}",
        "class foo{\nconstructor(){}}",
        "class foo{ bar(){}\n\nbaz(){}}",
        { code: "class foo{ bar(){}\nbaz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n\nbaz(){}}", options: ["always"] },
        { code: "class foo{ bar(){\n}\n\nbaz(){}}", options: [{ multiLine: "always" }] },
        { code: "class foo{ bar(){\n}\nbaz(){}}", options: [{ multiLine: "never" }] },
        { code: "class foo{ bar(){}\n\nbaz(){}}", options: [{ singleLine: "always" }] },
        { code: "class foo{ bar(){}\nbaz(){}}", options: [{ singleLine: "never" }] }
    ],
    invalid: [
        {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: ["never"],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: [{ multiLine: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n\nbaz(){}}",
            output: "class foo{ bar(){\n}\nbaz(){}}",
            options: [{ multiLine: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            options: [{ singleLine: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: [{ singleLine: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }
    ]
});
