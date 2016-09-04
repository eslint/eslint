/**
 * @fileoverview Tests for prefer-numeric-literals rule.
 * @author Annie Zhang
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-numeric-literals"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("prefer-numeric-literals", rule, {
    valid: [
        "parseInt(1);",
        "parseInt(1, 3);",
        { code: "0b111110111 === 503;", parserOptions: { ecmaVersion: 6 } },
        { code: "0o767 === 503;", parserOptions: { ecmaVersion: 6 } },
        "0x1F7 === 503;",
        "a[parseInt](1,2);",
        "parseInt(foo);",
        "parseInt(foo, 2);"
    ],
    invalid: [
        {
            code: "parseInt(\"111110111\", 2) === 503;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Use binary literals instead of parseInt()." }]
        }, {
            code: "parseInt(\"767\", 8) === 503;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Use octal literals instead of parseInt()." }]
        }, {
            code: "parseInt(\"1F7\", 16) === 255;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Use hexadecimal literals instead of parseInt()." }]
        }
    ]
});
