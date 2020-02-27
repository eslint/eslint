/**
 * @fileoverview Tests for id-blacklist rule.
 * @author Keith Cirkel
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/id-blacklist"),
    { RuleTester } = require("../../../lib/rule-tester");

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
            code: "import { foo as bar } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export { foo as bar } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
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
            code: "const {foo: bar} = baz",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const {foo: {bar: baz}} = qux",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ bar: baz }) {}",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ bar: {baz: qux} }) {}",
            options: ["bar", "baz"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({baz} = obj.qux) {}",
            options: ["qux"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({ foo: {baz} = obj.qux }) {}",
            options: ["qux"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({a: bar = obj.baz});",
            options: ["baz"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({foo: {a: bar = obj.baz}} = qux);",
            options: ["baz"],
            parserOptions: { ecmaVersion: 6 }
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
        },
        {
            code: "({foo: obj.bar.bar.bar.baz} = {});",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[obj.bar]: a = baz} = qux);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 }
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
            code: "import foo from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                error
            ]
        },
        {
            code: "import * as foo from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                error
            ]
        },
        {
            code: "import { foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                error
            ]
        },
        {
            code: "import { foo as bar } from 'mod'",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "bar" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "import { foo as bar } from 'mod'",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "bar" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "import { foo as foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "import { foo, foo as bar } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 10
            }]
        },
        {
            code: "import { foo as bar, foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 22
            }]
        },
        {
            code: "import foo, { foo as bar } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 8
            }]
        },
        {
            code: "var foo; export { foo as bar };",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "bar" },
                type: "Identifier",
                column: 26
            }]
        },
        {
            code: "var foo; export { foo };",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                }
            ]
        },
        {
            code: "var foo; export { foo as bar };",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },

                // reports each occurence of local identifier, although it's renamed in this export specifier
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                }
            ]
        },
        {
            code: "var foo; export { foo as foo };",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                },
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 26
                }
            ]
        },
        {
            code: "var foo; export { foo as bar };",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                },
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 26
                }
            ]
        },
        {
            code: "export { foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                error
            ]
        },
        {
            code: "export { foo as bar } from 'mod'",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "bar" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "export { foo as bar } from 'mod'",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "bar" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "export { foo as foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 17
            }]
        },
        {
            code: "export { foo, foo as bar } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 10
            }]
        },
        {
            code: "export { foo as bar, foo } from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "blacklisted",
                data: { name: "foo" },
                type: "Identifier",
                column: 22
            }]
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
        },
        {
            code: "const {foo} = baz",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 8
                }
            ]
        },
        {
            code: "const {foo: bar} = baz",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 13
                }
            ]
        },
        {
            code: "const {[foo]: bar} = baz",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 9
                },
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 15
                }
            ]
        },
        {
            code: "const {foo: {bar: baz}} = qux",
            options: ["foo", "bar", "baz"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 19
                }
            ]
        },
        {
            code: "const {foo: {[bar]: baz}} = qux",
            options: ["foo", "bar", "baz"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 15
                },
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 21
                }
            ]
        },
        {
            code: "const {[foo]: {[bar]: baz}} = qux",
            options: ["foo", "bar", "baz"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 9
                },
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 17
                },
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 23
                }
            ]
        },
        {
            code: "function foo({ bar: baz }) {}",
            options: ["bar", "baz"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 21
                }
            ]
        },
        {
            code: "function foo({ bar: {baz: qux} }) {}",
            options: ["bar", "baz", "qux"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "qux" },
                    type: "Identifier",
                    column: 27
                }
            ]
        },
        {
            code: "({foo: obj.bar} = baz);",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 12
                }
            ]
        },
        {
            code: "({foo: obj.bar.bar.bar.baz} = {});",
            options: ["foo", "bar", "baz"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 24
                }
            ]
        },
        {
            code: "({[foo]: obj.bar} = baz);",
            options: ["foo", "bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 4
                },
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 14
                }
            ]
        },
        {
            code: "({foo: { a: obj.bar }} = baz);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 17
                }
            ]
        },
        {
            code: "({a: obj.bar = baz} = qux);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 10
                }
            ]
        },
        {
            code: "({a: obj.bar.bar.baz = obj.qux} = obj.qux);",
            options: ["a", "bar", "baz", "qux"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "baz" },
                    type: "Identifier",
                    column: 18
                }
            ]
        },
        {
            code: "({a: obj[bar] = obj.qux} = obj.qux);",
            options: ["a", "bar", "baz", "qux"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 10
                }
            ]
        },
        {
            code: "({a: [obj.bar] = baz} = qux);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 11
                }
            ]
        },
        {
            code: "({foo: { a: obj.bar = baz}} = qux);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 17
                }
            ]
        },
        {
            code: "({foo: { [a]: obj.bar }} = baz);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 19
                }
            ]
        },
        {
            code: "({...obj.bar} = baz);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 9 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 10
                }
            ]
        },
        {
            code: "([obj.bar] = baz);",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 7
                }
            ]
        },
        {
            code: "const [bar] = baz;",
            options: ["bar"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "blacklisted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 8
                }
            ]
        }
    ]
});
