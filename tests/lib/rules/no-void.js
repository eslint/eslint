/**
 * @fileoverview Rule to disallow use of void operator.
 * @author Mike Sidorov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-void"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();

ruleTester.run("no-void", rule, {

    valid: [
        "var foo = bar()",
        "foo.void()",
        "foo.void = bar",
        "delete foo;"
    ],

    invalid: [
        {
            code: "void 0",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        },
        {
            code: "void(0)",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        },
        {
            code: "var foo = void 0",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        }
    ]
});
