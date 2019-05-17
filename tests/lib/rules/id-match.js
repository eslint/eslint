/**
 * @fileoverview Rule to flag non-matching identifiers
 * @author Matthieu Larcher
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/id-match"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = { messageId: "notMatch", type: "Identifier" };

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
                properties: true,
                onlyDeclarations: true
            }]
        },
        {
            code: "var {key_no_under: key} = {}",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id } = query;",
            options: ["^[^_]+$", {
                properties: true,
                ignoreDestructuring: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id: category_id } = query;",
            options: ["^[^_]+$", {
                properties: true,
                ignoreDestructuring: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id = 1 } = query;",
            options: ["^[^_]+$", {
                properties: true,
                ignoreDestructuring: true
            }],
            parserOptions: { ecmaVersion: 6 }
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
            errors: [error]
        },
        {
            code: "first_name = \"Matthieu\"",
            options: ["^[a-z]+$"],
            errors: [error]
        },
        {
            code: "first_name = \"Matthieu\"",
            options: ["^z"],
            errors: [
                error
            ]
        },
        {
            code: "Last_Name = \"Larcher\"",
            options: ["^[a-z]+(_[A-Z][a-z])*$"],
            errors: [error
            ]
        },
        {
            code: "var obj = {key: no_under}",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    message: "Identifier 'no_under' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function no_under21(){}",
            options: ["^[^_]+$"],
            errors: [error
            ]
        },
        {
            code: "obj.no_under22 = function(){};",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "no_under23.foo = function(){};",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "[no_under24.baz]",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "if (foo.bar_baz === boom.bam_pow) { [no_under25.baz] }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "foo.no_under26 = boom.bam_pow",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "var foo = { no_under27: boom.bam_pow }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "foo.qux.no_under28 = { bar: boom.bam_pow }",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "var o = {no_under29: 1}",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [error
            ]
        },
        {
            code: "obj.no_under30 = 2;",
            options: ["^[^_]+$", {
                properties: true
            }],
            errors: [
                {
                    messageId: "notMatch",
                    data: { name: "no_under30", pattern: "^[^_]+$" }
                }
            ]
        },
        {
            code: "var { category_id: category_alias } = query;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_alias' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: category_alias } = query;",
            options: ["^[^_]+$", {
                properties: true,
                ignoreDestructuring: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_alias' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: categoryId, ...other_props } = query;",
            options: ["^[^_]+$", {
                properties: true,
                ignoreDestructuring: true
            }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Identifier 'other_props' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id } = query;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_id' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id = 1 } = query;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_id' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import * as no_camelcased from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased } from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as no_camel_cased } from \"external module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camel_cased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased as no_camel_cased } from \"external module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camel_cased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased, no_camelcased } from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as camelCased, another_no_camelcased } from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'another_no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import camelCased, { no_camelcased } from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased, { another_no_camelcased as camelCased } from \"external-module\";",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased }) {};",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased = 'default value' }) {};",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const no_camelcased = 0; function foo({ camelcased_value = no_camelcased }) {}",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                },
                {
                    message: "Identifier 'camelcased_value' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { bar: no_camelcased } = foo;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ value_1: my_default }) {}",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'my_default' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ isCamelcased: no_camelcased }) {};",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { foo: bar_baz = 1 } = quz;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'bar_baz' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { no_camelcased = false } = bar;",
            options: ["^[^_]+$", {
                properties: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.",
                    type: "Identifier"
                }
            ]
        }
    ]
});
