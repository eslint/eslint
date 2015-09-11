/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/camelcase"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("camelcase", rule, {
    valid: [
        "firstName = \"Nicholas\"",
        "FIRST_NAME = \"Nicholas\"",
        "__myPrivateVariable = \"Patrick\"",
        "myPrivateVariable_ = \"Patrick\"",
        "function doSomething(){}",
        "do_something()",
        "foo.do_something()",
        "var foo = bar.baz_boom;",
        "var foo = bar.baz_boom.something;",
        "foo.boom_pow.qux = bar.baz_boom.something;",
        "if (bar.baz_boom) {}",
        "var obj = { key: foo.bar_baz };",
        "var arr = [foo.bar_baz];",
        "[foo.bar_baz]",
        "var arr = [foo.bar_baz.qux];",
        "[foo.bar_baz.nesting]",
        "if (foo.bar_baz === boom.bam_pow) { [foo.baz_boom] }",
        {
            code: "var o = {key: 1}",
            options: [{properties: "always"}]
        },
        {
            code: "var o = {bar_baz: 1}",
            options: [{properties: "never"}]
        },
        {
            code: "obj.a_b = 2;",
            options: [{properties: "never"}]
        },
        {
            code: "var obj = {\n a_a: 1 \n};\n obj.a_b = 2;",
            options: [{properties: "never"}]
        },
        {
            code: "obj.foo_bar = function(){};",
            options: [{properties: "never"}]
        }
    ],
    invalid: [
        {
            code: "first_name = \"Nicholas\"",
            errors: [
                {
                    message: "Identifier 'first_name' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "firstName = \"Nicholas\""
        },
        {
            code: "__private_first_name = \"Patrick\"",
            errors: [
                {
                    message: "Identifier '__private_first_name' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "privateFirstName = \"Patrick\""
        },
        {
            code: "function foo_bar(){}",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "function fooBar(){}"
        },
        {
            code: "obj.foo_bar = function(){};",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "obj.fooBar = function(){};"
        },
        {
            code: "bar_baz.foo = function(){};",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "barBaz.foo = function(){};"
        },
        {
            code: "[foo_bar.baz]",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "[fooBar.baz]"
        },
        {
            code: "if (foo.bar_baz === boom.bam_pow) { [foo_bar.baz] }",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "if (foo.bar_baz === boom.bam_pow) { [fooBar.baz] }"
        },
        {
            code: "foo.bar_baz = boom.bam_pow",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "foo.barBaz = boom.bam_pow"
        },
        {
            code: "var foo = { bar_baz: boom.bam_pow }",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "var foo = { barBaz: boom.bam_pow }"
        },
        {
            code: "foo.qux.boom_pow = { bar: boom.bam_pow }",
            errors: [
                {
                    message: "Identifier 'boom_pow' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "foo.qux.boomPow = { bar: boom.bam_pow }"
        },
        {
            code: "var o = {bar_baz: 1}",
            options: [{properties: "always"}],
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "var o = {barBaz: 1}"
        },
        {
            code: "obj.a_b = 2;",
            options: [{properties: "always"}],
            errors: [
                {
                    message: "Identifier 'a_b' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "obj.aB = 2;"
        },
        {
            code: "obj.a_b = 2;",
            options: [{properties: "always"}],
            errors: [
                {
                    message: "Identifier 'a_b' is not in camel case.",
                    type: "Identifier"
                }
            ],
            output: "obj.aB = 2;"
        }

    ]
});
