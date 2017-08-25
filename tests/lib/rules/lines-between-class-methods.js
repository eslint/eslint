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
        "class foo{\nconstructor(){}\n\n}",
        "class foo{ bar(){}\n\nbaz(){}}",
        { code: "class foo{}", options: ["never"] },
        { code: "class foo{ bar(){}baz(){}}", options: ["never"] }
    ],
    invalid: [
        { code: "class foo{ bar(){}baz(){}}", output: null, errors: [{ message: ALWAYS_MESSAGE }] },
        { code: "class foo{ bar(){}\nbaz(){}}", output: null, options: ["always"], errors: [{ message: ALWAYS_MESSAGE }] },
        { code: "class foo{ bar(){}\n\nbaz(){}}", output: null, options: ["never"], errors: [{ message: NEVER_MESSAGE }] }
    ]
});
