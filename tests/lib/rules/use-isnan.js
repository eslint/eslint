/**
 * @fileoverview Tests for use-isnan rule.
 * @author James Allardice, Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/use-isnan"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const error = { messageId: "useIsNaN", type: "BinaryExpression" };

ruleTester.run("use-isnan", rule, {
    valid: [
        "var x = NaN;",
        "isNaN(NaN) === true;",
        "isNaN(123) !== true;",
        "Number.isNaN(NaN) === true;",
        "Number.isNaN(123) !== true;",
        "foo(NaN + 1);",
        "foo(1 + NaN);",
        "foo(NaN - 1)",
        "foo(1 - NaN)",
        "foo(NaN * 2)",
        "foo(2 * NaN)",
        "foo(NaN / 2)",
        "foo(2 / NaN)",
        "var x; if (x = NaN) { }"
    ],
    invalid: [
        {
            code: "123 == NaN;",
            errors: [error]
        },
        {
            code: "123 === NaN;",
            errors: [error]
        },
        {
            code: "NaN === \"abc\";",
            errors: [error]
        },
        {
            code: "NaN == \"abc\";",
            errors: [error]
        },
        {
            code: "123 != NaN;",
            errors: [error]
        },
        {
            code: "123 !== NaN;",
            errors: [error]
        },
        {
            code: "NaN !== \"abc\";",
            errors: [error]
        },
        {
            code: "NaN != \"abc\";",
            errors: [error]
        },
        {
            code: "NaN < \"abc\";",
            errors: [error]
        },
        {
            code: "\"abc\" < NaN;",
            errors: [error]
        },
        {
            code: "NaN > \"abc\";",
            errors: [error]
        },
        {
            code: "\"abc\" > NaN;",
            errors: [error]
        },
        {
            code: "NaN <= \"abc\";",
            errors: [error]
        },
        {
            code: "\"abc\" <= NaN;",
            errors: [error]
        },
        {
            code: "NaN >= \"abc\";",
            errors: [error]
        },
        {
            code: "\"abc\" >= NaN;",
            errors: [error]
        }
    ]
});
