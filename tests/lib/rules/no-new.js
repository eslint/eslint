/**
 * @fileoverview Tests for no-new rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new", rule, {
    valid: [
        "var a = new Date()",
        "var a; if (a === new Date()) { a = false; }"
    ],
    invalid: [
        { code: "new Date()", errors: [{ message: "Do not use 'new' for side effects.", type: "ExpressionStatement" }] }
    ]
});
