/**
 * @fileoverview Tests for template-curly-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/template-curly-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        { code: "tag`${ foo } ${ bar } ${\n  baz\n}`", options: ["always"] },

        "`${/*  */ foo} ${bar /*  */}`",
        "`${/*  */foo/*  */} ${/*  */  bar  /*  */}`",
        "`${\n  /*  */  foo  /*  */  \n} ${/*\n  */  bar  /*  \n*/}`",
        "tag`${/*  */ foo} ${bar /*  */}}`",
        "tag`${/*  */foo/*  */} ${/*  */  bar  /*  */}`",
        "tag`${\n  /*  */  foo  /*  */  \n} ${/*\n  */  bar  /*  \n*/}`",
        "`${// comment\n foo} ${bar // comment \n}`",

        { code: "`${/*  */ foo} ${bar /*  */}`", options: ["never"] },
        { code: "`${/*  */foo/*  */} ${/*  */  bar  /*  */}`", options: ["never"] },
        { code: "`${\n  /*  */  foo  /*  */  \n} ${/*\n  */  bar  /*  \n*/}`", options: ["never"] },
        { code: "tag`${/*  */ foo} ${bar /*  */}}`", options: ["never"] },
        { code: "tag`${/*  */foo/*  */} ${/*  */  bar  /*  */}`", options: ["never"] },
        { code: "tag`${\n  /*  */  foo  /*  */  \n} ${/*\n  */  bar  /*  \n*/}`", options: ["never"] },
        { code: "`${// comment\n foo} ${bar // comment \n}`", options: ["never"] },

        { code: "`${ /*  */ foo } ${ bar /*  */ }`", options: ["always"] },
        { code: "`${ /*  */foo/*  */ } ${ /*  */  bar  /*  */ }`", options: ["always"] },
        { code: "`${\n  /*  */  foo  /*  */  \n} ${ /*\n  */  bar  /*  \n*/ }`", options: ["always"] },
        { code: "tag`${ /*  */ foo } ${ bar /*  */ }`", options: ["always"] },
        { code: "tag`${ /*  */foo/*  */ } ${ /*  */  bar  /*  */ }`", options: ["always"] },
        { code: "tag`${\n  /*  */  foo  /*  */  \n} ${ /*\n  */  bar  /*  \n*/ }`", options: ["always"] },
        { code: "`${ // comment\n foo } ${ bar // comment \n}`", options: ["always"] }
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
        },
        {
            code: "`${ /*  */foo } ${ bar/*  */ }`",
            output: "`${/*  */foo} ${bar/*  */}`",
            errors: [
                { messageId: "unexpectedAfter", column: 2 },
                { messageId: "unexpectedBefore", column: 15 },
                { messageId: "unexpectedAfter", column: 17 },
                { messageId: "unexpectedBefore", column: 30 }
            ]
        },
        {
            code: "`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "`${/*\n  */foo} ${bar/*  \n*/}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 2 },
                { messageId: "unexpectedBefore", line: 2, column: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 11 },
                { messageId: "unexpectedBefore", line: 3, column: 4 }
            ]
        },
        {
            code: "`${ /*  */ foo } ${ bar /*  */ }`",
            output: "`${/*  */ foo} ${bar /*  */}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", column: 2 },
                { messageId: "unexpectedBefore", column: 16 },
                { messageId: "unexpectedAfter", column: 18 },
                { messageId: "unexpectedBefore", column: 32 }
            ]
        },
        {
            code: "`${ /*\n  */ foo } ${ bar /*  \n*/ }`",
            output: "`${/*\n  */ foo} ${bar /*  \n*/}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 2 },
                { messageId: "unexpectedBefore", line: 2, column: 10 },
                { messageId: "unexpectedAfter", line: 2, column: 12 },
                { messageId: "unexpectedBefore", line: 3, column: 4 }
            ]
        },
        {
            code: "`${/*  */foo} ${bar/*  */}`",
            output: "`${ /*  */foo } ${ bar/*  */ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", column: 2 },
                { messageId: "expectedBefore", column: 13 },
                { messageId: "expectedAfter", column: 15 },
                { messageId: "expectedBefore", column: 26 }
            ]
        },
        {
            code: "`${/*\n  */foo} ${bar/*  \n*/}`",
            output: "`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2 },
                { messageId: "expectedBefore", line: 2, column: 8 },
                { messageId: "expectedAfter", line: 2, column: 10 },
                { messageId: "expectedBefore", line: 3, column: 3 }
            ]
        },
        {
            code: "tag`${ /*  */foo } ${ bar/*  */ }`",
            output: "tag`${/*  */foo} ${bar/*  */}`",
            errors: [
                { messageId: "unexpectedAfter", column: 5 },
                { messageId: "unexpectedBefore", column: 18 },
                { messageId: "unexpectedAfter", column: 20 },
                { messageId: "unexpectedBefore", column: 33 }
            ]
        },
        {
            code: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 5 },
                { messageId: "unexpectedBefore", line: 2, column: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 11 },
                { messageId: "unexpectedBefore", line: 3, column: 4 }
            ]
        },
        {
            code: "tag`${ /*  */foo } ${ bar/*  */ }`",
            output: "tag`${/*  */foo} ${bar/*  */}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", column: 5 },
                { messageId: "unexpectedBefore", column: 18 },
                { messageId: "unexpectedAfter", column: 20 },
                { messageId: "unexpectedBefore", column: 33 }
            ]
        },
        {
            code: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 5 },
                { messageId: "unexpectedBefore", line: 2, column: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 11 },
                { messageId: "unexpectedBefore", line: 3, column: 4 }
            ]
        },
        {
            code: "tag`${/*  */foo} ${bar/*  */}`",
            output: "tag`${ /*  */foo } ${ bar/*  */ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", column: 5 },
                { messageId: "expectedBefore", column: 16 },
                { messageId: "expectedAfter", column: 18 },
                { messageId: "expectedBefore", column: 29 }
            ]
        },
        {
            code: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            output: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 5 },
                { messageId: "expectedBefore", line: 2, column: 8 },
                { messageId: "expectedAfter", line: 2, column: 10 },
                { messageId: "expectedBefore", line: 3, column: 3 }
            ]
        },
        {
            code: "`${ // comment\n foo} ${bar // comment \n}`",
            output: "`${// comment\n foo} ${bar // comment \n}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 2 }
            ]
        },
        {
            code: "`${ // comment\n foo} ${bar // comment \n}`",
            output: "`${// comment\n foo} ${bar // comment \n}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 2 }
            ]
        },
        {
            code: "`${// comment\n foo } ${ bar // comment \n}`",
            output: "`${ // comment\n foo } ${ bar // comment \n}`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2 }
            ]
        }
    ]
});
