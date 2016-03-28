/**
 * @fileoverview Tests for id-blacklist rule.
 * @author Keith Cirkel
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/id-blacklist"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

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
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "bar = \"bar\"",
            options: ["bar"],
            errors: [
                {
                    message: "Identifier 'bar' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo = \"bar\"",
            options: ["f", "fo", "foo", "bar"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo(){}",
            options: ["f", "fo", "foo", "bar"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.bar()",
            options: ["f", "fo", "foo", "b", "ba", "baz"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = bar.baz;",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = bar.baz;",
            options: ["f", "fo", "fooo", "b", "ba", "bar", "bazz"],
            errors: [
                {
                    message: "Identifier 'bar' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar) {}",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["obj"],
            errors: [
                {
                    message: "Identifier 'obj' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["key"],
            errors: [
                {
                    message: "Identifier 'key' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var obj = { key: foo.bar };",
            options: ["foo"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var arr = [foo.bar];",
            options: ["arr"],
            errors: [
                {
                    message: "Identifier 'arr' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var arr = [foo.bar];",
            options: ["foo"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "[foo.bar]",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar === bar.baz) { [bing.baz] }",
            options: ["f", "fo", "foo", "b", "ba", "barr", "bazz", "bingg"],
            errors: [
                {
                    message: "Identifier 'foo' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar === bar.baz) { [foo.bar] }",
            options: ["f", "fo", "fooo", "b", "ba", "bar", "bazz", "bingg"],
            errors: [
                {
                    message: "Identifier 'bar' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["array", "date", "myDate", "myarray", "new", "var"],
            errors: [
                {
                    message: "Identifier 'myDate' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["array", "date", "mydate", "myArray", "new", "var"],
            errors: [
                {
                    message: "Identifier 'myArray' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.bar = 1",
            options: ["bar"],
            errors: [
                {
                    message: "Identifier 'bar' is blacklisted",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.bar.baz = 1",
            options: ["bar", "baz"],
            errors: [
                {
                    message: "Identifier 'baz' is blacklisted",
                    type: "Identifier"
                }
            ]
        }
    ]
});
