/**
 * @fileoverview Tests for jsx-quotes rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/jsx-quotes"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("jsx-quotes", rule, {
    valid: [
        {
            code: "<foo bar=\"baz\" />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar='\"' />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar=\"'\" />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar='baz' />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar=\"baz\">\"</foo>",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar='baz'>'</foo>",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar={'baz'} />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar={\"baz\"} />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar={baz} />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar='&quot;' />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar=\"&quot;\" />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar='&#39;' />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: "<foo bar=\"&#39;\" />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        }
    ],
    invalid: [
        {
            code: "<foo bar=\'baz\' />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            errors: [
                { message: "Unexpected usage of singlequote.", line: 1, column: 10, type: "Literal" }
            ],
            output: "<foo bar=\"baz\" />"
        },
        {
            code: "<foo bar=\"baz\" />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            errors: [
                { message: "Unexpected usage of doublequote.", line: 1, column: 10, type: "Literal" }
            ],
            output: "<foo bar='baz' />"
        },
        {
            code: "<foo bar=\"&quot;\" />",
            options: [ "prefer-single" ],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            errors: [
                { message: "Unexpected usage of doublequote.", line: 1, column: 10, type: "Literal" }
            ],
            output: "<foo bar='&quot;' />"
        },
        {
            code: "<foo bar=\'&#39;\' />",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            errors: [
                { message: "Unexpected usage of singlequote.", line: 1, column: 10, type: "Literal" }
            ],
            output: "<foo bar=\"&#39;\" />"
        }
    ]
});
