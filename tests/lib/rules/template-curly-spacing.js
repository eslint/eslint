/**
 * @fileoverview Tests for template-curly-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/template-curly-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("template-curly-spacing", rule, {
    valid: [
        "{ foo }",
        "`${foo} ${bar}`",
        { code: "`${foo} ${bar} ${\n  baz\n}`", options: ["never"] },
        { code: "`${ foo } ${ bar } ${\n  baz\n}`", options: ["always"] },
        "tag`${foo} ${bar}`",
        { code: "tag`${foo} ${bar} ${\n  baz\n}`", options: ["never"] },
        { code: "tag`${ foo } ${ bar } ${\n  baz\n}`", options: ["always"] }
    ],
    invalid: [
        {
            code: "`${ foo } ${ bar }`",
            output: "`${foo} ${bar}`",
            errors: [
                { messageId: "unexpectedAfter", column: 2 },
                { messageId: "unexpectedBefore", column: 9 },
                { messageId: "unexpectedAfter", column: 11 },
                { messageId: "unexpectedBefore", column: 18 }
            ]
        },
        {
            code: "`${ foo } ${ bar }`",
            output: "`${foo} ${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", column: 2 },
                { messageId: "unexpectedBefore", column: 9 },
                { messageId: "unexpectedAfter", column: 11 },
                { messageId: "unexpectedBefore", column: 18 }
            ]
        },
        {
            code: "`${foo} ${bar}`",
            output: "`${ foo } ${ bar }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", column: 2 },
                { messageId: "expectedBefore", column: 7 },
                { messageId: "expectedAfter", column: 9 },
                { messageId: "expectedBefore", column: 14 }
            ]
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            errors: [
                { messageId: "unexpectedAfter", column: 5 },
                { messageId: "unexpectedBefore", column: 12 },
                { messageId: "unexpectedAfter", column: 14 },
                { messageId: "unexpectedBefore", column: 21 }
            ]
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", column: 5 },
                { messageId: "unexpectedBefore", column: 12 },
                { messageId: "unexpectedAfter", column: 14 },
                { messageId: "unexpectedBefore", column: 21 }
            ]
        },
        {
            code: "tag`${foo} ${bar}`",
            output: "tag`${ foo } ${ bar }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", column: 5 },
                { messageId: "expectedBefore", column: 10 },
                { messageId: "expectedAfter", column: 12 },
                { messageId: "expectedBefore", column: 17 }
            ]
        }
    ]
});
