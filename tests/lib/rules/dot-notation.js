/**
 * @fileoverview Tests for dot-notation rule.
 * @author Josh Perez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/dot-notation"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

/**
 * Quote a string in "double quotes" because it’s painful
 * with a double-quoted string literal
 * @param   {string} str The string to quote
 * @returns {string}     `"${str}"`
 */
function q(str) {
    return `"${str}"`;
}

ruleTester.run("dot-notation", rule, {
    valid: [
        "a.b;",
        "a.b.c;",
        "a['12'];",
        "a[b];",
        "a[0];",
        { code: "a.b.c;", options: [{ allowKeywords: false }] },
        { code: "a.arguments;", options: [{ allowKeywords: false }] },
        { code: "a.let;", options: [{ allowKeywords: false }] },
        { code: "a.yield;", options: [{ allowKeywords: false }] },
        { code: "a.eval;", options: [{ allowKeywords: false }] },
        { code: "a[0];", options: [{ allowKeywords: false }] },
        { code: "a['while'];", options: [{ allowKeywords: false }] },
        { code: "a['true'];", options: [{ allowKeywords: false }] },
        { code: "a['null'];", options: [{ allowKeywords: false }] },
        { code: "a[true];", options: [{ allowKeywords: false }] },
        { code: "a[null];", options: [{ allowKeywords: false }] },
        { code: "a.true;", options: [{ allowKeywords: true }] },
        { code: "a.null;", options: [{ allowKeywords: true }] },
        { code: "a['snake_case'];", options: [{ allowPattern: "^[a-z]+(_[a-z]+)+$" }] },
        { code: "a['lots_of_snake_case'];", options: [{ allowPattern: "^[a-z]+(_[a-z]+)+$" }] },
        { code: "a[`time${range}`];", parserOptions: { ecmaVersion: 6 } },
        { code: "a[`while`];", options: [{ allowKeywords: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "a[`time range`];", parserOptions: { ecmaVersion: 6 } },
        "a.true;",
        "a.null;",
        "a[undefined];",
        "a[void 0];",
        "a[b()];"
    ],
    invalid: [
        {
            code: "a.true;",
            output: "a[\"true\"];",
            options: [{ allowKeywords: false }],
            errors: [{ messageId: "useBrackets", data: { key: "true" } }]
        },
        {
            code: "a['true'];",
            output: "a.true;",
            errors: [{ messageId: "useDot", data: { key: q("true") } }]
        },
        {
            code: "a[`time`];",
            output: "a.time;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "useDot", data: { key: "`time`" } }]
        },
        {
            code: "a[null];",
            output: "a.null;",
            errors: [{ messageId: "useDot", data: { key: "null" } }]
        },
        {
            code: "a['b'];",
            output: "a.b;",
            errors: [{ messageId: "useDot", data: { key: q("b") } }]
        },
        {
            code: "a.b['c'];",
            output: "a.b.c;",
            errors: [{ messageId: "useDot", data: { key: q("c") } }]
        },
        {
            code: "a['_dangle'];",
            output: "a._dangle;",
            options: [{ allowPattern: "^[a-z]+(_[a-z]+)+$" }],
            errors: [{ messageId: "useDot", data: { key: q("_dangle") } }]
        },
        {
            code: "a['SHOUT_CASE'];",
            output: "a.SHOUT_CASE;",
            options: [{ allowPattern: "^[a-z]+(_[a-z]+)+$" }],
            errors: [{ messageId: "useDot", data: { key: q("SHOUT_CASE") } }]
        },
        {
            code:
                "a\n" +
                "  ['SHOUT_CASE'];",
            output:
                "a\n" +
                "  .SHOUT_CASE;",
            errors: [{
                messageId: "useDot",
                data: { key: q("SHOUT_CASE") },
                line: 2,
                column: 4
            }]
        },
        {
            code:
            "getResource()\n" +
            "    .then(function(){})\n" +
            "    [\"catch\"](function(){})\n" +
            "    .then(function(){})\n" +
            "    [\"catch\"](function(){});",
            output:
            "getResource()\n" +
            "    .then(function(){})\n" +
            "    .catch(function(){})\n" +
            "    .then(function(){})\n" +
            "    .catch(function(){});",
            errors: [
                {
                    messageId: "useDot",
                    data: { key: q("catch") },
                    line: 3,
                    column: 6
                },
                {
                    messageId: "useDot",
                    data: { key: q("catch") },
                    line: 5,
                    column: 6
                }
            ]
        },
        {
            code:
            "foo\n" +
            "  .while;",
            output:
            "foo\n" +
            "  [\"while\"];",
            options: [{ allowKeywords: false }],
            errors: [{ messageId: "useBrackets", data: { key: "while" } }]
        },
        {
            code: "foo[ /* comment */ 'bar' ]",
            output: null, // Not fixed due to comment
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "foo[ 'bar' /* comment */ ]",
            output: null, // Not fixed due to comment
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "foo[    'bar'    ];",
            output: "foo.bar;",
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "foo. /* comment */ while",
            output: null, // Not fixed due to comment
            options: [{ allowKeywords: false }],
            errors: [{ messageId: "useBrackets", data: { key: "while" } }]
        },
        {
            code: "foo[('bar')]",
            output: "foo.bar",
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "foo[(null)]",
            output: "foo.null",
            errors: [{ messageId: "useDot", data: { key: "null" } }]
        },
        {
            code: "(foo)['bar']",
            output: "(foo).bar",
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "1['toString']",
            output: "1 .toString",
            errors: [{ messageId: "useDot", data: { key: q("toString") } }]
        },
        {
            code: "foo['bar']instanceof baz",
            output: "foo.bar instanceof baz",
            errors: [{ messageId: "useDot", data: { key: q("bar") } }]
        },
        {
            code: "let.if()",
            output: null, // `let["if"]()` is a syntax error because `let[` indicates a destructuring variable declaration
            options: [{ allowKeywords: false }],
            errors: [{ messageId: "useBrackets", data: { key: "if" } }]
        }
    ]
});
