/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/camelcase"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("camelcase", rule, {
    valid: [
        "firstName = \"Nicholas\"",
        "FIRST_NAME = \"Nicholas\"",
        "__myPrivateVariable = \"Patrick\"",
        "myPrivateVariable_ = \"Patrick\"",
        "function doSomething(){}",
        "do_something()",
        "new do_something",
        "new do_something()",
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
            options: [{ properties: "always" }]
        },
        {
            code: "var o = {_leading: 1}",
            options: [{ properties: "always" }]
        },
        {
            code: "var o = {trailing_: 1}",
            options: [{ properties: "always" }]
        },
        {
            code: "var o = {bar_baz: 1}",
            options: [{ properties: "never" }]
        },
        {
            code: "var o = {_leading: 1}",
            options: [{ properties: "never" }]
        },
        {
            code: "var o = {trailing_: 1}",
            options: [{ properties: "never" }]
        },
        {
            code: "obj.a_b = 2;",
            options: [{ properties: "never" }]
        },
        {
            code: "obj._a = 2;",
            options: [{ properties: "always" }]
        },
        {
            code: "obj.a_ = 2;",
            options: [{ properties: "always" }]
        },
        {
            code: "obj._a = 2;",
            options: [{ properties: "never" }]
        },
        {
            code: "obj.a_ = 2;",
            options: [{ properties: "never" }]
        },
        {
            code: "var obj = {\n a_a: 1 \n};\n obj.a_b = 2;",
            options: [{ properties: "never" }]
        },
        {
            code: "obj.foo_bar = function(){};",
            options: [{ properties: "never" }]
        },
        {
            code: "var { category_id: category } = query;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { _leading } = query;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { trailing_ } = query;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "import { camelCased } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { _leading } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { trailing_ } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as camelCased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as _leading } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as trailing_ } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as camelCased, anoterCamelCased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "function foo({ no_camelcased: camelCased }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ no_camelcased: _leading }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ no_camelcased: trailing_ }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ camelCased = 'default value' }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ _leading = 'default value' }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ trailing_ = 'default value' }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ camelCased }) {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ _leading }) {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ trailing_ }) {}",
            parserOptions: { ecmaVersion: 6 }
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
            ]
        },
        {
            code: "__private_first_name = \"Patrick\"",
            errors: [
                {
                    message: "Identifier '__private_first_name' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo_bar(){}",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.foo_bar = function(){};",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "bar_baz.foo = function(){};",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "[foo_bar.baz]",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar_baz === boom.bam_pow) { [foo_bar.baz] }",
            errors: [
                {
                    message: "Identifier 'foo_bar' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.bar_baz = boom.bam_pow",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { bar_baz: boom.bam_pow }",
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.qux.boom_pow = { bar: boom.bam_pow }",
            errors: [
                {
                    message: "Identifier 'boom_pow' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var o = {bar_baz: 1}",
            options: [{ properties: "always" }],
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.a_b = 2;",
            options: [{ properties: "always" }],
            errors: [
                {
                    message: "Identifier 'a_b' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: category_id } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_id' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_id' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id = 1 } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'category_id' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import * as no_camelcased from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as no_camel_cased } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camel_cased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased as no_camel_cased } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camel_cased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased, no_camelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as camelCased, another_no_camelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'another_no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import camelCased, { no_camelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased, { another_no_camelcased as camelCased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased }) {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased = 'default value' }) {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const no_camelcased = 0; function foo({ camelcased_value = no_camelcased}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                },
                {
                    message: "Identifier 'camelcased_value' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { bar: no_camelcased } = foo;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ value_1: my_default }) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'my_default' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ isCamelcased: no_camelcased }) {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { foo: bar_baz = 1 } = quz;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'bar_baz' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { no_camelcased = false } = bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        }
    ]
});
