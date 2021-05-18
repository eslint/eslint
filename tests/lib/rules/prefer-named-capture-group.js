/**
 * @fileoverview Tests for prefer-named-capture-group rule.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-named-capture-group"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("prefer-named-capture-group", rule, {
    valid: [
        "/normal_regex/",
        "/(?:[0-9]{4})/",
        "/(?<year>[0-9]{4})/",
        "/\\u{1F680}/u",
        "new RegExp()",
        "new RegExp(foo)",
        "new RegExp('')",
        "new RegExp('(?<year>[0-9]{4})')",
        "RegExp()",
        "RegExp(foo)",
        "RegExp('')",
        "RegExp('(?<year>[0-9]{4})')",
        "RegExp('(')", // invalid regexp should be ignored
        "RegExp('\\\\u{1F680}', 'u')"
    ],

    invalid: [
        {
            code: "/([0-9]{4})/",
            errors: [{
                messageId: "required",
                type: "Literal",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 2,
                endColumn: 12
            }]
        },
        {
            code: "new RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 13,
                endColumn: 23
            }]
        },
        {
            code: "RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 9,
                endColumn: 19
            }]
        },
        {
            code: "/([0-9]{4})-(\\w{5})/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "([0-9]{4})" },
                    line: 1,
                    column: 2,
                    endColumn: 12
                },
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(\\w{5})" },
                    line: 1,
                    column: 13,
                    endColumn: 20
                }
            ]
        }
    ]
});
