/**
 * @fileoverview Tests for id-denylist rule.
 * @author Keith Cirkel
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/id-denylist"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = { messageId: "restricted", type: "Identifier" };

ruleTester.run("id-denylist", rule, {
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
        },

        // references to global variables
        {
            code: "Number.parseInt()",
            options: ["Number"]
        },
        {
            code: "x = Number.NaN;",
            options: ["Number"]
        },
        {
            code: "var foo = undefined;",
            options: ["undefined"]
        },
        {
            code: "if (foo === undefined);",
            options: ["undefined"]
        },
        {
            code: "obj[undefined] = 5;", // creates obj["undefined"]. It should be disallowed, but the rule doesn't know values of globals and can't control computed access.
            options: ["undefined"]
        },
        {
            code: "foo = { [myGlobal]: 1 };",
            options: ["myGlobal"],
            parserOptions: { ecmaVersion: 6 },
            globals: { myGlobal: "readonly" }
        },
        {
            code: "({ myGlobal } = foo);", // writability doesn't affect the logic, it's always assumed that user doesn't have control over the names of globals.
            options: ["myGlobal"],
            parserOptions: { ecmaVersion: 6 },
            globals: { myGlobal: "writable" }
        },
        {
            code: "/* global myGlobal: readonly */ myGlobal = 5;",
            options: ["myGlobal"]
        },
        {
            code: "var foo = [Map];",
            options: ["Map"],
            env: { es6: true }
        },
        {
            code: "var foo = { bar: window.baz };",
            options: ["window"],
            env: { browser: true }
        },

        // Class fields
        {
            code: "class C { camelCase; #camelCase; #camelCase2() {} }",
            options: ["foo"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { snake_case; #snake_case; #snake_case2() {} }",
            options: ["foo"],
            parserOptions: { ecmaVersion: 2022 }
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
            code: "export * as foo from 'mod'",
            options: ["foo"],
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },

                // reports each occurrence of local identifier, although it's renamed in this export specifier
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 19
                },
                {
                    messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
                messageId: "restricted",
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
            code: "foo[bar] = baz;",
            options: ["bar"],
            errors: [{
                messageId: "restricted",
                data: { name: "bar" },
                type: "Identifier"
            }]
        },
        {
            code: "baz = foo[bar];",
            options: ["bar"],
            errors: [{
                messageId: "restricted",
                data: { name: "bar" },
                type: "Identifier"
            }]
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 9
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 15
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 9
                },
                {
                    messageId: "restricted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 17
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 4
                },
                {
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
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
                    messageId: "restricted",
                    data: { name: "bar" },
                    type: "Identifier",
                    column: 8
                }
            ]
        },

        // not a reference to a global variable, because it isn't a reference to a variable
        {
            code: "foo.undefined = 1;",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { undefined: 1 };",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = { undefined: undefined };",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 13
                }
            ]
        },
        {
            code: "var foo = { Number() {} };",
            options: ["Number"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "class Foo { Number() {} }",
            options: ["Number"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "myGlobal: while(foo) { break myGlobal; } ",
            options: ["myGlobal"],
            globals: { myGlobal: "readonly" },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "myGlobal" },
                    type: "Identifier",
                    column: 1
                },
                {
                    messageId: "restricted",
                    data: { name: "myGlobal" },
                    type: "Identifier",
                    column: 30
                }
            ]
        },

        // globals declared in the given source code are not excluded from consideration
        {
            code: "const foo = 1; bar = foo;",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 22
                }
            ]
        },
        {
            code: "let foo; foo = bar;",
            options: ["foo"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 10
                }
            ]
        },
        {
            code: "bar = foo; var foo;",
            options: ["foo"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 16
                }
            ]
        },
        {
            code: "function foo() {} var bar = foo;",
            options: ["foo"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 10
                },
                {
                    messageId: "restricted",
                    data: { name: "foo" },
                    type: "Identifier",
                    column: 29
                }
            ]
        },
        {
            code: "class Foo {} var bar = Foo;",
            options: ["Foo"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Foo" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "restricted",
                    data: { name: "Foo" },
                    type: "Identifier",
                    column: 24
                }
            ]
        },

        // redeclared globals are not excluded from consideration
        {
            code: "let undefined; undefined = 1;",
            options: ["undefined"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 5
                },
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 16
                }
            ]
        },
        {
            code: "foo = undefined; var undefined;",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 22
                }
            ]
        },
        {
            code: "function undefined(){} x = undefined;",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 10
                },
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 28
                }
            ]
        },
        {
            code: "class Number {} x = Number.NaN;",
            options: ["Number"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 7
                },
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 21
                }
            ]
        },

        /*
         * Assignment to a property with a restricted name isn't allowed, in general.
         * In this case, that restriction prevents creating a global variable with a restricted name.
         */
        {
            code: "/* globals myGlobal */ window.myGlobal = 5; foo = myGlobal;",
            options: ["myGlobal"],
            env: { browser: true },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "myGlobal" },
                    type: "Identifier",
                    column: 31
                }
            ]
        },

        // disabled global variables
        {
            code: "var foo = undefined;",
            options: ["undefined"],
            globals: { undefined: "off" },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "/* globals Number: off */ Number.parseInt()",
            options: ["Number"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = [Map];", // this actually isn't a disabled global: it was never enabled because es6 environment isn't enabled
            options: ["Map"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Map" },
                    type: "Identifier"
                }
            ]
        },

        // shadowed global variables
        {
            code: "if (foo) { let undefined; bar = undefined; }",
            options: ["undefined"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 16
                },
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier",
                    column: 33
                }
            ]
        },
        {
            code: "function foo(Number) { var x = Number.NaN; }",
            options: ["Number"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 14
                },
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 32
                }
            ]
        },
        {
            code: "function foo() { var myGlobal; x = myGlobal; }",
            options: ["myGlobal"],
            globals: { myGlobal: "readonly" },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "myGlobal" },
                    type: "Identifier",
                    column: 22
                },
                {
                    messageId: "restricted",
                    data: { name: "myGlobal" },
                    type: "Identifier",
                    column: 36
                }
            ]
        },
        {
            code: "function foo(bar) { return Number.parseInt(bar); } const Number = 1;",
            options: ["Number"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 28
                },
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 58
                }
            ]
        },
        {
            code: "import Number from 'myNumber'; const foo = Number.parseInt(bar);",
            options: ["Number"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 8
                },
                {
                    messageId: "restricted",
                    data: { name: "Number" },
                    type: "Identifier",
                    column: 44
                }
            ]
        },
        {
            code: "var foo = function undefined() {};",
            options: ["undefined"],
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier"
                }
            ]
        },

        // this is a reference to a global variable, but at the same time creates a property with a restricted name
        {
            code: "var foo = { undefined }",
            options: ["undefined"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "undefined" },
                    type: "Identifier"
                }
            ]
        },

        // Class fields
        {
            code: "class C { camelCase; #camelCase; #camelCase2() {} }",
            options: ["camelCase"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "camelCase" },
                    type: "Identifier"
                },
                {
                    messageId: "restrictedPrivate",
                    data: { name: "camelCase" },
                    type: "PrivateIdentifier"
                }
            ]

        },
        {
            code: "class C { snake_case; #snake_case() {}; #snake_case2() {} }",
            options: ["snake_case"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "restricted",
                    data: { name: "snake_case" },
                    type: "Identifier"
                },
                {
                    messageId: "restrictedPrivate",
                    data: { name: "snake_case" },
                    type: "PrivateIdentifier"
                }
            ]

        }
    ]
});
