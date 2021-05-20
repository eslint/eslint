/**
 * @fileoverview Tests for prefer-named-capture-group rule.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-named-capture-group"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        "RegExp('\\\\u{1F680}', 'u')",
        "new globalThis.RegExp('([0-9]{4})')",
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            env: { es6: true }
        },
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            env: { es2017: true }
        },
        {
            code: "new globalThis.RegExp()",
            env: { es2020: true }
        },
        {
            code: "new globalThis.RegExp(foo)",
            env: { es2020: true }
        },
        {
            code: "globalThis.RegExp(foo)",
            env: { es2020: true }
        },
        {
            code: `
                var globalThis = bar;
                globalThis.RegExp(foo);
                `,
            env: { es2020: true }
        },
        {
            code: `
                function foo () {
                    var globalThis = bar;
                    new globalThis.RegExp(baz);
                }
                `,
            env: { es2020: true }
        }
    ],

    invalid: [
        {
            code: "/([0-9]{4})/",
            errors: [{
                messageId: "required",
                type: "Literal",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 13
            }]
        },
        {
            code: "new RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 25
            }]
        },
        {
            code: "RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 21
            }]
        },
        {
            code: "new RegExp(`a(bc)d`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(bc)" }
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
                    column: 1,
                    endColumn: 21
                },
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(\\w{5})" },
                    line: 1,
                    column: 1,
                    endColumn: 21
                }
            ]
        },
        {
            code: "new RegExp('(' + 'a)')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(a)" }
            }]
        },
        {
            code: "new RegExp('a(bc)d' + 'e')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(bc)" }
            }]
        },
        {
            code: "RegExp('(a)'+'')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(a)" }
            }]
        },
        {
            code: "RegExp( '' + '(ab)')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(ab)" }
            }]
        },
        {
            code: "new RegExp(`(ab)${''}`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(ab)" }
            }]
        },
        {
            code: "new RegExp(`(a)\n`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(a)" },
                line: 1,
                column: 1,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "RegExp(`a(b\nc)d`)",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(b\nc)" }
            }]
        },
        {
            code: "new RegExp('a(b)\\'')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(b)" }
            }]
        },
        {
            code: "RegExp('(a)\\\\d')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(a)" }
            }]
        },
        {
            code: "RegExp(`\\a(b)`)",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(b)" }
            }]
        },
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            env: { es2020: true },
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 36
            }]
        },
        {
            code: "globalThis.RegExp('([0-9]{4})')",
            env: { es2020: true },
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 32
            }]
        },
        {
            code: `
                function foo() { var globalThis = bar; }
                new globalThis.RegExp('([0-9]{4})');
            `,
            env: { es2020: true },
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 3,
                column: 17,
                endColumn: 52
            }]
        }
    ]
});
