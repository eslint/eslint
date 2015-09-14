/**
 * @fileoverview Tests for jsx-quotes rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2015 Mathias Schreck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/jsx-quotes"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("jsx-quotes", rule, {
    valid: [
        {
            code: "<foo bar=\"baz\" />",
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar='\"' />",
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar='baz' />",
            options: [ "prefer-single" ],
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar=\"baz\">\"</foo>",
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar='baz'>'</foo>",
            options: [ "prefer-single" ],
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar={'baz'} />",
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar={\"baz\"} />",
            options: [ "prefer-single" ],
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar={baz} />",
            ecmaFeatures: { jsx: true }
        },
        {
            code: "<foo bar />",
            ecmaFeatures: { jsx: true }
        }
    ],
    invalid: [
        {
            code: "<foo bar=\'baz\' />",
            ecmaFeatures: { jsx: true },
            errors: [
                { message: "Unexpected usage of singlequote.", line: 1, column: 10, type: "Literal" }
            ]
        },
        {
            code: "<foo bar=\"baz\" />",
            options: [ "prefer-single" ],
            ecmaFeatures: { jsx: true },
            errors: [
                { message: "Unexpected usage of doublequote.", line: 1, column: 10, type: "Literal" }
            ]
        }
    ]
});
