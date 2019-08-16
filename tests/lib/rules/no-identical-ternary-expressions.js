/**
 * @fileoverview Tests for no-identical-ternary-expressions rule
 * @author Che Fisher
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-identical-ternary-expressions"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-identical-ternary-expressions", rule, {

    valid: [
        "x === 1 ? 'true' : true;",
        "var a = x === 1 ? 'false' : false;",
        "foo() ? null : undefined;",
        "foo() ? true : foo();",
        "var a = x === 1 ? foo(x) : foo(y);",
        "var a = foo ? foo : bar;",
        "var value = 'a';var set = true;var result = value || (set ? 'unset' : 'cannot set')",
        "x === 1 ? value1 : x === 2 ? value2 : x === 3 ? value1 : value2",
        "condition1 ? value1 : condition2 ? value2 : condition3 ? value1 : value3",
        "matched = options.selector ? options.selector.match(filePath) : options.selector.test(filePath)",
        "openingElseCurly.range[0] ? ' ' : ''",
        "foo ? 1 : '1'"
    ],
    invalid: [

        // primitives
        {
            code: "foo() ? '$2.00' : '$2.00';",
            errors: [{
                messageId: "expressions",
                data: { expression: "'$2.00'" },
                line: 1,
                column: 19
            }]
        },
        {
            code: "foo() ? null : null",
            errors: [{
                messageId: "expressions",
                data: { expression: "null" },
                line: 1,
                column: 16
            }]
        },
        {
            code: "foo() ? undefined : undefined",
            errors: [{
                messageId: "expressions",
                data: { expression: "undefined" },
                line: 1,
                column: 21
            }]
        },
        {
            code: "var a = x === 2 ? true : true;",
            errors: [{
                messageId: "expressions",
                data: { expression: "true" },
                line: 1,
                column: 26
            }]
        },
        {
            code: "var a = foo() ? false : false;",
            errors: [{
                messageId: "expressions",
                data: { expression: "false" },
                line: 1,
                column: 25
            }]
        },

        // comparisons
        {
            code: "var a = x instanceof foo ? x === y : x === y;",
            errors: [{
                messageId: "expressions",
                data: { expression: "x === y" },
                line: 1,
                column: 38
            }]
        },

        // function calls
        {
            code: "x === 2 ? foo() : foo();",
            errors: [{
                messageId: "expressions",
                data: { expression: "foo()" },
                line: 1,
                column: 19
            }]
        },
        {
            code: `
                value === x
                ? foo(bar)
                : foo(bar)`,
            errors: [{
                messageId: "expressions",
                data: { expression: "foo(bar)" },
                line: 4,
                column: 19
            }]
        },

        // conditions
        {
            code: "condition1 ? value1 : condition1 ? value2 : value3;",
            errors: [{
                messageId: "conditions",
                data: { condition: "condition1" },
                line: 1,
                column: 23
            }]
        },
        {
            code: "condition1 ? value1 : condition2 ? value2 : condition1 ? value3 : value4;",
            errors: [{
                messageId: "conditions",
                data: { condition: "condition1" },
                line: 1,
                column: 45
            }]
        },

        // other
        {
            code: "var a = ((foo)) ? ((bar)) : (((((bar)))));",
            errors: [{
                messageId: "expressions",
                data: { expression: "bar" },
                line: 1,
                column: 34
            }]
        },
        {
            code: "var a = foo ? (bar === getFee(baz)) : ((((bar === getFee(baz)))));",
            errors: [{
                messageId: "expressions",
                data: { expression: "bar === getFee(baz)" },
                line: 1,
                column: 43
            }]
        },
        {
            code: "var a = ((foo)) ? (((2+5)*7)*2) : ( ( (2+5)* 7)*2 );",
            errors: [{
                messageId: "expressions",
                data: { expression: "((2+5)*7)*2" },
                line: 1,
                column: 37
            }]
        },
        {
            code: "var result = value ? value : canSet ? value : value",
            errors: [{
                messageId: "expressions",
                data: { expression: "value" },
                line: 1,
                column: 47
            }]
        },
        {
            code: "foo ? bar : (qux ? baz : baz)",
            errors: [{
                messageId: "expressions",
                data: { expression: "baz" },
                line: 1,
                column: 26
            }]
        },
        {
            code: "function* fn() { foo ? yield bar : yield bar }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expressions",
                data: { expression: "yield bar" },
                line: 1,
                column: 36
            }]
        },
        {
            code: "var a = b ? c => c : c => c;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "expressions",
                data: { expression: "c => c" },
                line: 1,
                column: 22
            }]
        }
    ]
});
