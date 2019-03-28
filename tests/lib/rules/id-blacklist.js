/**
 * @fileoverview Tests for id-blacklist rule.
 * @author Keith Cirkel
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/id-blacklist"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = { messageId: "blacklisted", type: "Identifier" };

ruleTester.run("id-blacklist", rule, {
    valid: [
        {
            code: "foo = \"bar\"",
            options: ["bar"]
        },
        {
            code: "bar = \"bar\"",
            options: ["foo"]
        },
        {
            code: "foo = \"bar\"",
            options: ["f", "fo", "fooo", "bar"]
        },
        {
            code: "function foo(){}",
            options: ["bar"]
        },
        {
            code: "foo()",
            options: ["f", "fo", "fooo", "bar"]
        },
        {
            code: "foo.bar()",
            options: ["f", "fo", "fooo", "b", "ba", "baz"]
        },
        {
            code: "var foo = bar.baz;",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz"]
        },
        {
            code: "var foo = bar.baz.bing;",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "foo.bar.baz = bing.bong.bash;",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "if (foo.bar) {}",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "var arr = [foo.bar];",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "[foo.bar]",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "[foo.bar.nesting]",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "if (foo.bar === bar.baz) { [foo.bar] }",
            options: ["f", "fo", "fooo", "b", "ba", "barr", "bazz", "bingg"]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["array", "date", "mydate", "myarray", "new", "var"]
        },
        {
            code: "foo()",
            options: ["foo"]
        },
        {
            code: "foo.bar()",
            options: ["bar"]
        },
        {
            code: "foo.bar",
            options: ["bar"]
        }
    ],
    invalid: [
        {
            code: "foo = \"bar\"",
            options: ["foo"],
            errors: [
                error
            ]
        },
        {
            code: "bar = \"bar\"",
            options: ["bar"],
            errors: [
                error
            ]
        },
        {
            code: "foo = \"bar\"",
            options: ["f", "fo", "foo", "bar"],
            errors: [
                error
            ]
        },
        {
            code: "function foo(){}",
            options: ["f", "fo", "foo", "bar"],
            errors: [
                error
            ]
        },
        {
            code: "foo.bar()",
            options: ["f", "fo", "foo", "b", "ba", "baz"],
            errors: [
                error
            ]
        },
        {
            code: "var foo = bar.baz;",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz"],
            errors: [
                error
            ]
        },
        {
            code: "var foo = bar.baz;",
            options: ["f", "fo", "fooo", "b", "ba", "bar", "bazz"],
            errors: [
                error
            ]
        },
        {
            code: "if (foo.bar) {}",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                error
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["obj"],
            errors: [
                error
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["key"],
            errors: [
                error
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["foo"],
            errors: [
                error
            ]
        },
        {
            code: "var arr = [foo.bar];",
            options: ["arr"],
            errors: [
                error
            ]
        },
        {
            code: "var arr = [foo.bar];",
            options: ["foo"],
            errors: [
                error
            ]
        },
        {
            code: "[foo.bar]",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                error
            ]
        },
        {
            code: "if (foo.bar === bar.baz) { [bing.baz] }",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                error
            ]
        },
        {
            code: "if (foo.bar === bar.baz) { [foo.bar] }",
            options: ["f", "fo", "fooo", "b", "ba", "bar", "bazz", "bingg"],
            errors: [
                error
            ]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["array", "date", "myDate", "myarray", "new", "var"],
            errors: [
                error
            ]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["array", "date", "mydate", "myArray", "new", "var"],
            errors: [
                error
            ]
        },
        {
            code: "foo.bar = 1",
            options: ["bar"],
            errors: [
                error
            ]
        },
        {
            code: "foo.bar.baz = 1",
            options: ["bar", "baz"],
            errors: [
                error
            ]
        }
    ]
});
