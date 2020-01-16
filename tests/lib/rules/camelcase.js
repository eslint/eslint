/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/camelcase"),
    { RuleTester } = require("../../../lib/rule-tester");

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
            code: "var { category_id } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id: category_id } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id = 1 } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { [{category_id} = query]: categoryId } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
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
            code: "import { snake_cased } from 'mod'",
            options: [{ ignoreImports: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { camelCased } from 'mod'",
            options: [{ ignoreImports: false }],
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
        },
        {
            code: "ignored_foo = 0;",
            options: [{ allow: ["ignored_foo"] }]
        },
        {
            code: "ignored_foo = 0; ignored_bar = 1;",
            options: [{ allow: ["ignored_foo", "ignored_bar"] }]
        },
        {
            code: "user_id = 0;",
            options: [{ allow: ["_id$"] }]
        },
        {
            code: "__option_foo__ = 0;",
            options: [{ allow: ["__option_foo__"] }]
        },
        {
            code: "foo = { [computedBar]: 0 };",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "first_name = \"Nicholas\"",
            output: "firstName = \"Nicholas\"",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "first_name" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "__private_first_name = \"Patrick\"",
            output: "__privateFirstName = \"Patrick\"",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "__private_first_name" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "trailing_underscore_ = \"Yaron\"",
            output: "trailingUnderscore_ = \"Yaron\"",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "trailing_underscore_" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "__leading_and_trailing_underscores_ = \"Yaron\"",
            output: "__leadingAndTrailingUnderscores_ = \"Yaron\"",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "__leading_and_trailing_underscores_" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo_bar(){}",
            output: "function fooBar(){}",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "foo_bar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.foo_bar = function(){};",
            output: "obj.fooBar = function(){};",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "foo_bar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "bar_baz.foo = function(){};",
            output: "barBaz.foo = function(){};",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "[foo_bar.baz]",
            output: "[fooBar.baz]",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "foo_bar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo.bar_baz === boom.bam_pow) { [foo_bar.baz] }",
            output: "if (foo.bar_baz === boom.bam_pow) { [fooBar.baz] }",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "foo_bar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.bar_baz = boom.bam_pow",
            output: "foo.barBaz = boom.bam_pow",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { bar_baz: boom.bam_pow }",
            output: "var foo = { barBaz: boom.bam_pow }",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { bar_baz: boom.bam_pow }",
            output: "var foo = { barBaz: boom.bam_pow }",
            options: [{ ignoreDestructuring: true }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.qux.boom_pow = { bar: boom.bam_pow }",
            output: "foo.qux.boomPow = { bar: boom.bam_pow }",
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "boom_pow" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var o = {bar_baz: 1}",
            output: "var o = {barBaz: 1}",
            options: [{ properties: "always" }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "obj.a_b = 2;",
            output: "obj.aB = 2;",
            options: [{ properties: "always" }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_b" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: category_alias } = query;",
            output: "var { category_id: categoryAlias } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_alias" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: category_alias } = query;",
            output: "var { category_id: categoryAlias } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_alias" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { [category_id]: categoryId } = query;",
            output: "var { [categoryId]: categoryId } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_id" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { [category_id]: categoryId } = query;",
            output: "var { [categoryId]: categoryId } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_id" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: categoryId, ...other_props } = query;",
            output: "var { category_id: categoryId, ...otherProps } = query;",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "other_props" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id } = query;",
            output: "var { categoryId } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_id" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id: category_id } = query;",
            output: "var { category_id: categoryId } = query;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_id" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { category_id = 1 } = query;",
            output: "var { categoryId = 1 } = query;",
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
            output: "import noCamelcased from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import * as no_camelcased from \"external-module\";",
            output: "import * as noCamelcased from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased } from \"external-module\";",
            output: "import { noCamelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as no_camel_cased } from \"external module\";",
            output: "import { no_camelcased as noCamelCased } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camel_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased as no_camel_cased } from \"external module\";",
            output: "import { camelCased as noCamelCased } from \"external module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camel_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased, no_camelcased } from \"external-module\";",
            output: "import { camelCased, noCamelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { no_camelcased as camelCased, another_no_camelcased } from \"external-module\";",
            output: "import { no_camelcased as camelCased, anotherNoCamelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "another_no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import camelCased, { no_camelcased } from \"external-module\";",
            output: "import camelCased, { noCamelcased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased, { another_no_camelcased as camelCased } from \"external-module\";",
            output: "import noCamelcased, { another_no_camelcased as camelCased } from \"external-module\";",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import snake_cased from 'mod'",
            output: "import snakeCased from 'mod'",
            options: [{ ignoreImports: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import * as snake_cased from 'mod'",
            output: "import * as snakeCased from 'mod'",
            options: [{ ignoreImports: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import snake_cased from 'mod'",
            output: "import snakeCased from 'mod'",
            options: [{ ignoreImports: false }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import * as snake_cased from 'mod'",
            output: "import * as snakeCased from 'mod'",
            options: [{ ignoreImports: false }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased }) {};",
            output: "function foo({ noCamelcased }) {};",
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
            output: "function foo({ noCamelcased = 'default value' }) {};",
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
            output: "const noCamelcased = 0; function foo({ camelcasedValue = no_camelcased}) {}",
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
            output: "const { bar: noCamelcased } = foo;",
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
            output: "function foo({ value_1: myDefault }) {}",
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
            output: "function foo({ isCamelcased: noCamelcased }) {};",
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
            output: "var { foo: barBaz = 1 } = quz;",
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
            output: "const { noCamelcased = false } = bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { no_camelcased = foo_bar } = bar;",
            output: "const { noCamelcased = foo_bar } = bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'no_camelcased' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "not_ignored_foo = 0;",
            output: "notIgnoredFoo = 0;",
            options: [{ allow: ["ignored_bar"] }],
            errors: [
                {
                    message: "Identifier 'not_ignored_foo' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "not_ignored_foo = 0;",
            output: "notIgnoredFoo = 0;",
            options: [{ allow: ["_id$"] }],
            errors: [
                {
                    message: "Identifier 'not_ignored_foo' is not in camel case.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo = { [computed_bar]: 0 };",
            output: "foo = { [computedBar]: 0 };",
            options: [{ ignoreDestructuring: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Identifier 'computed_bar' is not in camel case.",
                    type: "Identifier"
                }
            ]
        }
    ]
});
