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
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 1, column: 8, endLine: 1, endColumn: 9 },
                { messageId: "unexpectedAfter", line: 1, column: 13, endLine: 1, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 }
            ]
        },
        {
            code: "`${ foo } ${ bar }`",
            output: "`${foo} ${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 1, column: 8, endLine: 1, endColumn: 9 },
                { messageId: "unexpectedAfter", line: 1, column: 13, endLine: 1, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 }
            ]
        },
        {
            code: "` ${ foo }${ bar }` ",
            output: "` ${foo}${bar}` ",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 5, endLine: 1, endColumn: 6 },
                { messageId: "unexpectedBefore", line: 1, column: 9, endLine: 1, endColumn: 10 },
                { messageId: "unexpectedAfter", line: 1, column: 13, endLine: 1, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 }
            ]
        },
        {
            code: "`${  foo } ${ bar  }`",
            output: "`${foo} ${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 6 },
                { messageId: "unexpectedBefore", line: 1, column: 9, endLine: 1, endColumn: 10 },
                { messageId: "unexpectedAfter", line: 1, column: 14, endLine: 1, endColumn: 15 },
                { messageId: "unexpectedBefore", line: 1, column: 18, endLine: 1, endColumn: 20 }
            ]
        },
        {
            code: "`${foo   }${   bar}`",
            output: "`${foo}${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedBefore", line: 1, column: 7, endLine: 1, endColumn: 10 },
                { messageId: "unexpectedAfter", line: 1, column: 13, endLine: 1, endColumn: 16 }
            ]
        },
        {
            code: "`${   foo \t}${\t\tbar   }`",
            output: "`${foo}${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 7 },
                { messageId: "unexpectedBefore", line: 1, column: 10, endLine: 1, endColumn: 12 },
                { messageId: "unexpectedAfter", line: 1, column: 15, endLine: 1, endColumn: 17 },
                { messageId: "unexpectedBefore", line: 1, column: 20, endLine: 1, endColumn: 23 }
            ]
        },
        {
            code: "`${foo} ${bar}`",
            output: "`${ foo } ${ bar }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2, endLine: 1, endColumn: 4 },
                { messageId: "expectedBefore", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "expectedAfter", line: 1, column: 9, endLine: 1, endColumn: 11 },
                { messageId: "expectedBefore", line: 1, column: 14, endLine: 1, endColumn: 15 }
            ]
        },
        {
            code: "`${foo}${bar}`",
            output: "`${ foo }${ bar }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2, endLine: 1, endColumn: 4 },
                { messageId: "expectedBefore", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "expectedAfter", line: 1, column: 8, endLine: 1, endColumn: 10 },
                { messageId: "expectedBefore", line: 1, column: 13, endLine: 1, endColumn: 14 }
            ]
        },
        {
            code: "`a${foo}b${bar}c`",
            output: "`a${ foo }b${ bar }c`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 3, endLine: 1, endColumn: 5 },
                { messageId: "expectedBefore", line: 1, column: 8, endLine: 1, endColumn: 9 },
                { messageId: "expectedAfter", line: 1, column: 10, endLine: 1, endColumn: 12 },
                { messageId: "expectedBefore", line: 1, column: 15, endLine: 1, endColumn: 16 }
            ]
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 1, column: 11, endLine: 1, endColumn: 12 },
                { messageId: "unexpectedAfter", line: 1, column: 16, endLine: 1, endColumn: 17 },
                { messageId: "unexpectedBefore", line: 1, column: 20, endLine: 1, endColumn: 21 }
            ]
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 1, column: 11, endLine: 1, endColumn: 12 },
                { messageId: "unexpectedAfter", line: 1, column: 16, endLine: 1, endColumn: 17 },
                { messageId: "unexpectedBefore", line: 1, column: 20, endLine: 1, endColumn: 21 }
            ]
        },
        {
            code: "tag`${foo} ${bar}`",
            output: "tag`${ foo } ${ bar }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 5, endLine: 1, endColumn: 7 },
                { messageId: "expectedBefore", line: 1, column: 10, endLine: 1, endColumn: 11 },
                { messageId: "expectedAfter", line: 1, column: 12, endLine: 1, endColumn: 14 },
                { messageId: "expectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 }
            ]
        },
        {
            code: "`${ /*  */foo } ${ bar/*  */ }`",
            output: "`${/*  */foo} ${bar/*  */}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 1, column: 14, endLine: 1, endColumn: 15 },
                { messageId: "unexpectedAfter", line: 1, column: 19, endLine: 1, endColumn: 20 },
                { messageId: "unexpectedBefore", line: 1, column: 29, endLine: 1, endColumn: 30 }
            ]
        },
        {
            code: "`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "`${/*\n  */foo} ${bar/*  \n*/}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 2, column: 8, endLine: 2, endColumn: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 13, endLine: 2, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "`${ /*  */ foo } ${ bar /*  */ }`",
            output: "`${/*  */ foo} ${bar /*  */}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 1, column: 15, endLine: 1, endColumn: 16 },
                { messageId: "unexpectedAfter", line: 1, column: 20, endLine: 1, endColumn: 21 },
                { messageId: "unexpectedBefore", line: 1, column: 31, endLine: 1, endColumn: 32 }
            ]
        },
        {
            code: "`${ /*\n  */ foo } ${ bar /*  \n*/ }`",
            output: "`${/*\n  */ foo} ${bar /*  \n*/}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 },
                { messageId: "unexpectedBefore", line: 2, column: 9, endLine: 2, endColumn: 10 },
                { messageId: "unexpectedAfter", line: 2, column: 14, endLine: 2, endColumn: 15 },
                { messageId: "unexpectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "`${/*  */foo} ${bar/*  */}`",
            output: "`${ /*  */foo } ${ bar/*  */ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2, endLine: 1, endColumn: 4 },
                { messageId: "expectedBefore", line: 1, column: 13, endLine: 1, endColumn: 14 },
                { messageId: "expectedAfter", line: 1, column: 15, endLine: 1, endColumn: 17 },
                { messageId: "expectedBefore", line: 1, column: 26, endLine: 1, endColumn: 27 }
            ]
        },
        {
            code: "`${/*\n  */foo} ${bar/*  \n*/}`",
            output: "`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2, endLine: 1, endColumn: 4 },
                { messageId: "expectedBefore", line: 2, column: 8, endLine: 2, endColumn: 9 },
                { messageId: "expectedAfter", line: 2, column: 10, endLine: 2, endColumn: 12 },
                { messageId: "expectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "tag`${ /*  */foo } ${ bar/*  */ }`",
            output: "tag`${/*  */foo} ${bar/*  */}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 },
                { messageId: "unexpectedAfter", line: 1, column: 22, endLine: 1, endColumn: 23 },
                { messageId: "unexpectedBefore", line: 1, column: 32, endLine: 1, endColumn: 33 }
            ]
        },
        {
            code: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 2, column: 8, endLine: 2, endColumn: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 13, endLine: 2, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "tag`${ /*  */foo } ${ bar/*  */ }`",
            output: "tag`${/*  */foo} ${bar/*  */}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 1, column: 17, endLine: 1, endColumn: 18 },
                { messageId: "unexpectedAfter", line: 1, column: 22, endLine: 1, endColumn: 23 },
                { messageId: "unexpectedBefore", line: 1, column: 32, endLine: 1, endColumn: 33 }
            ]
        },
        {
            code: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            output: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 7, endLine: 1, endColumn: 8 },
                { messageId: "unexpectedBefore", line: 2, column: 8, endLine: 2, endColumn: 9 },
                { messageId: "unexpectedAfter", line: 2, column: 13, endLine: 2, endColumn: 14 },
                { messageId: "unexpectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "tag`${/*  */foo} ${bar/*  */}`",
            output: "tag`${ /*  */foo } ${ bar/*  */ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 5, endLine: 1, endColumn: 7 },
                { messageId: "expectedBefore", line: 1, column: 16, endLine: 1, endColumn: 17 },
                { messageId: "expectedAfter", line: 1, column: 18, endLine: 1, endColumn: 20 },
                { messageId: "expectedBefore", line: 1, column: 29, endLine: 1, endColumn: 30 }
            ]
        },
        {
            code: "tag`${/*\n  */foo} ${bar/*  \n*/}`",
            output: "tag`${ /*\n  */foo } ${ bar/*  \n*/ }`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 5, endLine: 1, endColumn: 7 },
                { messageId: "expectedBefore", line: 2, column: 8, endLine: 2, endColumn: 9 },
                { messageId: "expectedAfter", line: 2, column: 10, endLine: 2, endColumn: 12 },
                { messageId: "expectedBefore", line: 3, column: 3, endLine: 3, endColumn: 4 }
            ]
        },
        {
            code: "`${ // comment\n foo} ${bar // comment \n}`",
            output: "`${// comment\n foo} ${bar // comment \n}`",
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 }
            ]
        },
        {
            code: "`${ // comment\n foo} ${bar // comment \n}`",
            output: "`${// comment\n foo} ${bar // comment \n}`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 1, column: 4, endLine: 1, endColumn: 5 }
            ]
        },
        {
            code: "`${// comment\n foo } ${ bar // comment \n}`",
            output: "`${ // comment\n foo } ${ bar // comment \n}`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 1, column: 2, endLine: 1, endColumn: 4 }
            ]
        },
        {
            code: "`\n${ foo }\n`",
            output: "`\n${foo}\n`",
            options: ["never"],
            errors: [
                { messageId: "unexpectedAfter", line: 2, column: 3, endLine: 2, endColumn: 4 },
                { messageId: "unexpectedBefore", line: 2, column: 7, endLine: 2, endColumn: 8 }
            ]
        },
        {
            code: "`\n${foo}\n`",
            output: "`\n${ foo }\n`",
            options: ["always"],
            errors: [
                { messageId: "expectedAfter", line: 2, column: 1, endLine: 2, endColumn: 3 },
                { messageId: "expectedBefore", line: 2, column: 6, endLine: 2, endColumn: 7 }
            ]
        }
    ]
});
