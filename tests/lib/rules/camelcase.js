/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/camelcase"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

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
            code: "const { ['foo']: _foo } = obj;",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "const { [_foo_]: foo } = obj;",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id } = query;",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id: category_id } = query;",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id = 1 } = query;",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { [{category_id} = query]: categoryId } = query;",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { category_id: category } = query;",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { _leading } = query;",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { trailing_ } = query;",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "import { camelCased } from \"external module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { _leading } from \"external module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { trailing_ } from \"external module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as camelCased } from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as _leading } from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as trailing_ } from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { no_camelcased as camelCased, anotherCamelCased } from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { snake_cased } from 'mod'",
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "import { snake_cased as snake_cased } from 'mod'",
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "import { 'snake_cased' as snake_cased } from 'mod'",
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "import { camelCased } from 'mod'",
            options: [{ ignoreImports: false }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },

        // this rule doesn't apply to quoted module export names, as it doesn't apply to quoted property names.
        {
            code: "export { a as 'snake_cased' } from 'mod'",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "export * as 'snake_cased' from 'mod'",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },

        {
            code: "var _camelCased = aGlobalVariable",
            options: [{ ignoreGlobals: false }],
            languageOptions: { globals: { aGlobalVariable: "readonly" } }
        },
        {
            code: "var camelCased = _aGlobalVariable",
            options: [{ ignoreGlobals: false }],
            languageOptions: { globals: { _aGlobalVariable: "readonly" } }
        },
        {
            code: "var camelCased = a_global_variable",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "a_global_variable.foo()",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "a_global_variable[undefined]",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "var foo = a_global_variable.bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "a_global_variable.foo = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "( { foo: a_global_variable.bar } = baz )",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "a_global_variable = foo",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "a_global_variable = foo",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "({ a_global_variable } = foo)",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "({ snake_cased: a_global_variable } = foo)",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "({ snake_cased: a_global_variable = foo } = bar)",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "[a_global_variable] = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "[a_global_variable = foo] = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "foo[a_global_variable] = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "var foo = { [a_global_variable]: bar }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "var { [a_global_variable]: foo } = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "readonly" } } // eslint-disable-line camelcase -- Testing non-CamelCase
        },
        {
            code: "function foo({ no_camelcased: camelCased }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ no_camelcased: _leading }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ no_camelcased: trailing_ }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ camelCased = 'default value' }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ _leading = 'default value' }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ trailing_ = 'default value' }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ camelCased }) {};",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ _leading }) {}",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ trailing_ }) {}",
            languageOptions: { ecmaVersion: 6 }
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
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a: obj.fo_o } = bar);",
            options: [{ allow: ["fo_o"] }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a: obj.foo } = bar);",
            options: [{ allow: ["fo_o"] }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a: obj.fo_o } = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a: obj.fo_o.b_ar } = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a: { b: obj.fo_o } } = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "([obj.fo_o] = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ c: [ob.fo_o]} = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "([obj.fo_o.b_ar] = bar);",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "({obj} = baz.fo_o);",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "([obj] = baz.fo_o);",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "([obj.foo = obj.fo_o] = bar);",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { camelCase; #camelCase; #camelCase2() {} }",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { snake_case; #snake_case; #snake_case2() {} }",
            options: [{ properties: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // Combinations of `properties` and `ignoreDestructuring`
        {
            code: `
            const { some_property } = obj;

            const bar = { some_property };

            obj.some_property = 10;

            const xyz = { some_property: obj.some_property };

            const foo = ({ some_property }) => {
                console.log(some_property)
            };
            `,
            options: [{ properties: "never", ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // https://github.com/eslint/eslint/issues/15572
        {
            code: `
            const { some_property } = obj;
            doSomething({ some_property });
            `,
            options: [{ properties: "never", ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "first_name = \"Nicholas\"",
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
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "__private_first_name" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo_bar(){}",
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
            languageOptions: { ecmaVersion: 6 },
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
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 },
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
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2018 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "category_id" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import no_camelcased from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camel_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { 'snake_cased' as snake_cased } from 'mod'",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { 'snake_cased' as another_snake_cased } from 'mod'",
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "another_snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "import { camelCased, no_camelcased } from \"external-module\";",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            options: [{ ignoreImports: true }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            options: [{ ignoreImports: false }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
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
            options: [{ ignoreImports: false }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var camelCased = snake_cased",
            options: [{ ignoreGlobals: false }],
            languageOptions: { globals: { snake_cased: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "a_global_variable.foo()",
            options: [{ ignoreGlobals: false }],
            languageOptions: { globals: { snake_cased: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "a_global_variable[undefined]",
            options: [{ ignoreGlobals: false }],
            languageOptions: { globals: { snake_cased: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var camelCased = snake_cased",
            languageOptions: { globals: { snake_cased: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var camelCased = snake_cased",
            options: [{}],
            languageOptions: { globals: { snake_cased: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "snake_cased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo.a_global_variable = bar",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { a_global_variable: bar }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { a_global_variable: a_global_variable }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 13
                }
            ]
        },
        {
            code: "var foo = { a_global_variable() {} }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "class Foo { a_global_variable() {} }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "a_global_variable: for (;;);",
            options: [{ ignoreGlobals: true }],
            languageOptions: { globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "if (foo) { let a_global_variable; a_global_variable = bar; }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 16
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 35
                }
            ]
        },
        {
            code: "function foo(a_global_variable) { foo = a_global_variable; }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 14
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 41
                }
            ]
        },
        {
            code: "var a_global_variable",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function a_global_variable () {}",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const a_global_variable = foo; bar = a_global_variable",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 38
                }
            ]
        },
        {
            code: "bar = a_global_variable; var a_global_variable;",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "writable" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier",
                    column: 30
                }
            ]
        },
        {
            code: "var foo = { a_global_variable }",
            options: [{ ignoreGlobals: true }],
            languageOptions: { ecmaVersion: 6, globals: { a_global_variable: "readonly" } }, // eslint-disable-line camelcase -- Testing non-CamelCase
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "a_global_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "undefined_variable;",
            options: [{ ignoreGlobals: true }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "undefined_variable" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "implicit_global = 1;",
            options: [{ ignoreGlobals: true }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "implicit_global" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "export * as snake_cased from 'mod'",
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ no_camelcased = 'default value' }) {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const no_camelcased = 0; function foo({ camelcased_value = no_camelcased}) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "camelcased_value" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { bar: no_camelcased } = foo;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ value_1: my_default }) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "my_default" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo({ isCamelcased: no_camelcased }) {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var { foo: bar_baz = 1 } = quz;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "bar_baz" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { no_camelcased = false } = bar;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "const { no_camelcased = foo_bar } = bar;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "no_camelcased" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "not_ignored_foo = 0;",
            options: [{ allow: ["ignored_bar"] }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "not_ignored_foo" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "not_ignored_foo = 0;",
            options: [{ allow: ["_id$"] }],
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "not_ignored_foo" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "foo = { [computed_bar]: 0 };",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "computed_bar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: obj.fo_o } = bar);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: obj.fo_o } = bar);",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: obj.fo_o.b_ar } = baz);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "b_ar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: { b: { c: obj.fo_o } } } = bar);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: { b: { c: obj.fo_o.b_ar } } } = baz);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "b_ar" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "([obj.fo_o] = bar);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "([obj.fo_o] = bar);",
            options: [{ ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "([obj.fo_o = 1] = bar);",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: [obj.fo_o] } = bar);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({ a: { b: [obj.fo_o] } } = bar);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "([obj.fo_o.ba_r] = baz);",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "ba_r" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({...obj.fo_o} = baz);",
            languageOptions: { ecmaVersion: 9 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({...obj.fo_o.ba_r} = baz);",
            languageOptions: { ecmaVersion: 9 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "ba_r" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "({c: {...obj.fo_o }} = baz);",
            languageOptions: { ecmaVersion: 9 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "fo_o" },
                    type: "Identifier"
                }
            ]
        },

        // Optional chaining.
        {
            code: "obj.o_k.non_camelcase = 0",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "notCamelCase", data: { name: "non_camelcase" } }]
        },
        {
            code: "(obj?.o_k).non_camelcase = 0",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "notCamelCase", data: { name: "non_camelcase" } }]
        },

        // class public/private fields, private methods.
        {
            code: "class C { snake_case; }",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "notCamelCase", data: { name: "snake_case" } }]
        },
        {
            code: "class C { #snake_case; foo() { this.#snake_case; } }",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "notCamelCasePrivate", data: { name: "snake_case" }, column: 11 }]
        },
        {
            code: "class C { #snake_case() {} }",
            options: [{ properties: "always" }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "notCamelCasePrivate", data: { name: "snake_case" } }]
        },

        // Combinations of `properties` and `ignoreDestructuring`
        {
            code: `
            const { some_property } = obj;
            doSomething({ some_property });
            `,
            options: [{ properties: "always", ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "some_property" },
                    line: 3,
                    column: 27
                }
            ]
        },
        {
            code: `
            const { some_property } = obj;
            doSomething({ some_property });
            doSomething({ [some_property]: "bar" });
            `,
            options: [{ properties: "never", ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "some_property" },
                    line: 4,
                    column: 28
                }
            ]
        },
        {
            code: `
            const { some_property } = obj;

            const bar = { some_property };

            obj.some_property = 10;

            const xyz = { some_property: obj.some_property };

            const foo = ({ some_property }) => {
                console.log(some_property)
            };
            `,
            options: [{ properties: "always", ignoreDestructuring: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "notCamelCase",
                    data: { name: "some_property" },
                    line: 4,
                    column: 27
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "some_property" },
                    line: 6,
                    column: 17
                },
                {
                    messageId: "notCamelCase",
                    data: { name: "some_property" },
                    line: 8,
                    column: 27
                }
            ]
        }
    ]
});
