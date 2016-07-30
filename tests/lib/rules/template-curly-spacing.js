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

const ruleTester = new RuleTester();

ruleTester.run("template-curly-spacing", rule, {
    valid: [
        {code: "{ foo }"},
        {code: "`${foo} ${bar}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${foo} ${bar} ${\n  baz\n}`", options: ["never"], parserOptions: {ecmaVersion: 6}},
        {code: "`${ foo } ${ bar } ${\n  baz\n}`", options: ["always"], parserOptions: {ecmaVersion: 6}},
        {code: "tag`${foo} ${bar}`", parserOptions: {ecmaVersion: 6}},
        {code: "tag`${foo} ${bar} ${\n  baz\n}`", options: ["never"], parserOptions: {ecmaVersion: 6}},
        {code: "tag`${ foo } ${ bar } ${\n  baz\n}`", options: ["always"], parserOptions: {ecmaVersion: 6}}
    ],
    invalid: [
        {
            code: "`${ foo } ${ bar }`",
            output: "`${foo} ${bar}`",
            errors: [
                {message: "Unexpected space(s) after '${'.", column: 2},
                {message: "Unexpected space(s) before '}'.", column: 9},
                {message: "Unexpected space(s) after '${'.", column: 11},
                {message: "Unexpected space(s) before '}'.", column: 18}
            ],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "`${ foo } ${ bar }`",
            output: "`${foo} ${bar}`",
            errors: [
                {message: "Unexpected space(s) after '${'.", column: 2},
                {message: "Unexpected space(s) before '}'.", column: 9},
                {message: "Unexpected space(s) after '${'.", column: 11},
                {message: "Unexpected space(s) before '}'.", column: 18}
            ],
            options: ["never"],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "`${foo} ${bar}`",
            output: "`${ foo } ${ bar }`",
            errors: [
                {message: "Expected space(s) after '${'.", column: 2},
                {message: "Expected space(s) before '}'.", column: 7},
                {message: "Expected space(s) after '${'.", column: 9},
                {message: "Expected space(s) before '}'.", column: 14}
            ],
            options: ["always"],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            errors: [
                {message: "Unexpected space(s) after '${'.", column: 5},
                {message: "Unexpected space(s) before '}'.", column: 12},
                {message: "Unexpected space(s) after '${'.", column: 14},
                {message: "Unexpected space(s) before '}'.", column: 21}
            ],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "tag`${ foo } ${ bar }`",
            output: "tag`${foo} ${bar}`",
            errors: [
                {message: "Unexpected space(s) after '${'.", column: 5},
                {message: "Unexpected space(s) before '}'.", column: 12},
                {message: "Unexpected space(s) after '${'.", column: 14},
                {message: "Unexpected space(s) before '}'.", column: 21}
            ],
            options: ["never"],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "tag`${foo} ${bar}`",
            output: "tag`${ foo } ${ bar }`",
            errors: [
                {message: "Expected space(s) after '${'.", column: 5},
                {message: "Expected space(s) before '}'.", column: 10},
                {message: "Expected space(s) after '${'.", column: 12},
                {message: "Expected space(s) before '}'.", column: 17}
            ],
            options: ["always"],
            parserOptions: {ecmaVersion: 6}
        }
    ]
});
