/**
 * @fileoverview Tests for lines-between-class-methods rule.
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
        "class foo{ bar(){}\n\n/*comments*/baz(){}}",
        "class foo{ bar(){}\n\n//comments\nbaz(){}}",

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n/*comments*/baz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n//comments\nbaz(){}}", options: ["never"] },

        { code: "class foo{ bar(){}\n\nbaz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n/*comments*/baz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n//comments\nbaz(){}}", options: ["always"] },

        { code: "class foo{ bar(){\n}\n\nbaz(){}}", options: [{ multiline: "always" }] },
        { code: "class foo{ bar(){\n}\n\n/*comments*/baz(){}}", options: [{ multiline: "always" }] },
        { code: "class foo{ bar(){\n}\n\n//comments\nbaz(){}}", options: [{ multiline: "always" }] },

        { code: "class foo{ bar(){\n}\nbaz(){}}", options: [{ multiline: "never" }] },
        { code: "class foo{ bar(){\n}\n/*comments*/baz(){}}", options: [{ multiline: "never" }] },
        { code: "class foo{ bar(){\n}\n//comments\nbaz(){}}", options: [{ multiline: "never" }] },

        { code: "class foo{ bar(){}\n\nbaz(){}}", options: [{ singleline: "always" }] },
        { code: "class foo{ bar(){}\n\n/*comments*/baz(){}}", options: [{ singleline: "always" }] },
        { code: "class foo{ bar(){}\n\n//comments\nbaz(){}}", options: [{ singleline: "always" }] },

        { code: "class foo{ bar(){}\nbaz(){}}", options: [{ singleline: "never" }] },
        { code: "class foo{ bar(){}\n/*comments*/baz(){}}", options: [{ singleline: "never" }] },
        { code: "class foo{ bar(){}\n//comments\nbaz(){}}", options: [{ singleline: "never" }] }
    ],
    invalid: [
        {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n/*comments*/baz(){}}",
            output: "class foo{ bar(){}\n\n/*comments*/baz(){}}",
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n//comments\nbaz(){}}",
            output: "class foo{ bar(){}\n\n//comments\nbaz(){}}",
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: ["never"],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\n/*comments*/baz(){}}",
            output: "class foo{ bar(){}\n/*comments*/baz(){}}",
            options: ["never"],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\n//comments\nbaz(){}}",
            output: "class foo{ bar(){}\n//comments\nbaz(){}}",
            options: ["never"],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: [{ multiline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n/*comments*/baz(){}}",
            output: "class foo{ bar(){\n}\n\n/*comments*/baz(){}}",
            options: [{ multiline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n//comments\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\n//comments\nbaz(){}}",
            options: [{ multiline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n\nbaz(){}}",
            output: "class foo{ bar(){\n}\nbaz(){}}",
            options: [{ multiline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n\n/*comments*/baz(){}}",
            output: "class foo{ bar(){\n}\n/*comments*/baz(){}}",
            options: [{ multiline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){\n}\n\n//comments\nbaz(){}}",
            output: "class foo{ bar(){\n}\n//comments\nbaz(){}}",
            options: [{ multiline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            options: [{ singleline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n/*comments*/baz(){}}",
            output: "class foo{ bar(){}\n\n/*comments*/baz(){}}",
            options: [{ singleline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n//comments\nbaz(){}}",
            output: "class foo{ bar(){}\n\n//comments\nbaz(){}}",
            options: [{ singleline: "always" }],
            errors: [{ message: ALWAYS_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: [{ singleline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\n/*comments*/baz(){}}",
            output: "class foo{ bar(){}\n/*comments*/baz(){}}",
            options: [{ singleline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }, {
            code: "class foo{ bar(){}\n\n//comments\nbaz(){}}",
            output: "class foo{ bar(){}\n//comments\nbaz(){}}",
            options: [{ singleline: "never" }],
            errors: [{ message: NEVER_MESSAGE }]
        }
    ]
});
