/**
 * @fileoverview Rule to flag non-matching identifiers
 * @author Matthieu Larcher
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/id-match"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("id-match", rule, {
    valid: [
        {
            code: "__foo = \"Matthieu\"",
            options: [
                "^[a-z]+$",
                {
                    onlyDeclarations: true
                }
            ]
        },
        {
            code: "firstname = \"Matthieu\"",
            options: ["^[a-z]+$"]
        },
        {
            code: "first_name = \"Matthieu\"",
            options: ["[a-z]+"]
        },
        {
            code: "firstname = \"Matthieu\"",
            options: ["^f"]
        },
        {
            code: "last_Name = \"Larcher\"",
            options: ["^[a-z]+(_[A-Z][a-z]+)*$"]
        },
        {
            code: "param = \"none\"",
            options: ["^[a-z]+(_[A-Z][a-z])*$"]
        },
        {
            code: "function noUnder(){}",
            options: ["^[^_]+$"]
        },
        {
            code: "no_under()",
            options: ["^[^_]+$"]
        },
        {
            code: "foo.no_under2()",
            options: ["^[^_]+$"]
        },
        {
            code: "var foo = bar.no_under3;",
            options: ["^[^_]+$"]
        },
        {
            code: "var foo = bar.no_under4.something;",
            options: ["^[^_]+$"]
        },
        {
            code: "foo.no_under5.qux = bar.no_under6.something;",
            options: ["^[^_]+$"]
        },
        {
            code: "if (bar.no_under7) {}",
            options: ["^[^_]+$"]
        },
        {
            code: "var obj = { key: foo.no_under8 };",
            options: ["^[^_]+$"]
        },
        {
            code: "var arr = [foo.no_under9];",
            options: ["^[^_]+$"]
        },
        {
            code: "[foo.no_under10]",
            options: ["^[^_]+$"]
        },
        {
            code: "var arr = [foo.no_under11.qux];",
            options: ["^[^_]+$"]
        },
        {
            code: "[foo.no_under12.nesting]",
            options: ["^[^_]+$"]
        },
        {
            code: "if (foo.no_under13 === boom.no_under14) { [foo.no_under15] }",
            options: ["^[^_]+$"]
        },
        {
            code: "var myArray = new Array(); var myDate = new Date();",
            options: ["^[a-z$]+([A-Z][a-z]+)*$"]
        },
        {
            code: "var x = obj._foo;",
            options: ["^[^_]+$"]
        },
        {
            code: "var obj = {key: no_under}",
            options: ["^[^_]+$", {
                properties: true
            }]
        },
        {
            code: "var o = {key: 1}",
            options: ["^[^_]+$", {
                properties: true
            }]
        },
        {
            code: "var o = {no_under16: 1}",
            options: ["^[^_]+$", {
                properties: false
            }]
        },
        {
            code: "obj.no_under17 = 2;",
            options: ["^[^_]+$", {
                properties: false
            }]
        },
        {
            code: "var obj = {\n no_under18: 1 \n};\n obj.no_under19 = 2;",
            options: ["^[^_]+$", {
                properties: false
            }]
        },
        {
            code: "obj.no_under20 = function(){};",
            options: ["^[^_]+$", {
                properties: false
            }]
        },
        {
            code: "var x = obj._foo2;",
            options: ["^[^_]+$", {
                properties: false
            }]
        }
    ],
    invalid: [
        {
            code: "var __foo = \"Matthieu\"",
            options: [
                "^[a-z]+$",
                {
                    onlyDeclarations: true
                }
            ],
            errors: [
                {
                    message: "Identifier '__foo' does not match the pattern '^[a-z]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "first_name = \"Matthieu\"",
            options: ["^[a-z]+$"],
            errors: [
                {
                    message: "Identifier 'first_name' does not match the pattern '^[a-z]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "first_name = \"Matthieu\"",
            options: ["^z"],
            errors: [
                {
                    message: "Identifier 'first_name' does not match the pattern '^z'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "Last_Name = \"Larcher\"",
            options: ["^[a-z]+(_[A-Z][a-z])*$"],
            errors: [
                {
                    message: "Identifier 'Last_Name' does not match the pattern '^[a-z]+(_[A-Z][a-z])*$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function no_under21(){}",
            options: ["^[^_]+$"],
            errors: [
                {
                    message: "Identifier 'no_under21' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.no_under22 = function(){};",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under22' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "no_under23.foo = function(){};",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under23' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "[no_under24.baz]",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under24' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar_baz === boom.bam_pow) { [no_under25.baz] }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under25' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.no_under26 = boom.bam_pow",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under26' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { no_under27: boom.bam_pow }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under27' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.qux.no_under28 = { bar: boom.bam_pow }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under28' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var o = {no_under29: 1}",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under29' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.no_under30 = 2;",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under30' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        }
    ]
});
