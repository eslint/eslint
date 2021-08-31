/**
 * @fileoverview Tests for no-multi-str rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multi-str"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-multi-str", rule, {
    valid: [
        "var a = 'Line 1 Line 2';",
        { code: "var a = <div>\n<h1>Wat</h1>\n</div>;", parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } }
    ],
    invalid: [
        {
            code: "var x = 'Line 1 \\\n Line 2'",
            errors: [{
                messageId: "multilineString",
                type: "Literal"
            }]
        },
        {
            code: "test('Line 1 \\\n Line 2');",
            errors: [{
                messageId: "multilineString",
                type: "Literal"
            }]
        },
        {
            code: "'foo\\\rbar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal"
            }]
        },
        {
            code: "'foo\\\u2028bar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal"
            }]
        },
        {
            code: "'foo\\\u2029ar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal"
            }]
        }
    ]
});
