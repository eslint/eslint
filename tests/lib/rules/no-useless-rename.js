/**
 * @fileoverview Disallow renaming import, export, and destructured assignments to the same name.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-rename"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });

ruleTester.run("no-useless-rename", rule, {
    valid: [
        "let {foo} = obj;",
        "let {foo: bar} = obj;",
        "let {foo: bar, baz: qux} = obj;",
        "let {foo: {bar: baz}} = obj;",
        "let {foo, bar: {baz: qux}} = obj;",
        "let {'foo': bar} = obj;",
        "let {'foo': bar, 'baz': qux} = obj;",
        "let {'foo': {'bar': baz}} = obj;",
        "let {foo, 'bar': {'baz': qux}} = obj;",
        "let {['foo']: bar} = obj;",
        "let {['foo']: bar, ['baz']: qux} = obj;",
        "let {['foo']: {['bar']: baz}} = obj;",
        "let {foo, ['bar']: {['baz']: qux}} = obj;",
        "let {[foo]: foo} = obj;",
        "let {['foo']: foo} = obj;",
        "let {[foo]: bar} = obj;",
        "function func({foo}) {}",
        "function func({foo: bar}) {}",
        "function func({foo: bar, baz: qux}) {}",
        "({foo}) => {}",
        "({foo: bar}) => {}",
        "({foo: bar, baz: qui}) => {}",
        "import * as foo from 'foo';",
        "import foo from 'foo';",
        "import {foo} from 'foo';",
        "import {foo as bar} from 'foo';",
        "import {foo as bar, baz as qux} from 'foo';",
        {
            code: "import {'foo' as bar} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        "export {foo} from 'foo';",
        "var foo = 0;export {foo as bar};",
        "var foo = 0; var baz = 0; export {foo as bar, baz as qux};",
        "export {foo as bar} from 'foo';",
        "export {foo as bar, baz as qux} from 'foo';",
        {
            code: "var foo = 0; export {foo as 'bar'};",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {foo as 'bar'} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {'foo' as bar} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {'foo' as 'bar'} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {'' as ' '} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {' ' as ''} from 'baz';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "export {'foo'} from 'bar';",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const {...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "const {foo, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "const {foo: bar, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 }
        },

        // { ignoreDestructuring: true }
        {
            code: "let {foo: foo} = obj;",
            options: [{ ignoreDestructuring: true }]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            options: [{ ignoreDestructuring: true }]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            options: [{ ignoreDestructuring: true }]
        },

        // { ignoreImport: true }
        {
            code: "import {foo as foo} from 'foo';",
            options: [{ ignoreImport: true }]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            options: [{ ignoreImport: true }]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            options: [{ ignoreImport: true }]
        },

        // { ignoreExport: true }
        {
            code: "var foo = 0;export {foo as foo};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "var foo = 0;var bar = 0;export {foo as foo, bar as baz};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "var foo = 0;var bar = 0;export {foo as foo, bar as bar};",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo} from 'foo';",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            options: [{ ignoreExport: true }]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            options: [{ ignoreExport: true }]
        },

        /*
         * TODO: Remove after babel-eslint removes ExperimentalRestProperty
         * https://github.com/eslint/eslint/issues/12335
         */
        {
            code: "const { ...foo } = bar;",
            parser: require.resolve("../../fixtures/parsers/babel-eslint10/object-pattern-with-rest-element")
        }
    ],

    invalid: [
        {
            code: "let {foo: foo} = obj;",
            output: "let {foo} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (foo)} = obj);",
            output: "({foo} = obj);",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {\\u0061: a} = obj;",
            output: "let {a} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "a" } }]
        },
        {
            code: "let {a: \\u0061} = obj;",
            output: "let {\\u0061} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "a" } }]
        },
        {
            code: "let {\\u0061: \\u0061} = obj;",
            output: "let {\\u0061} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "a" } }]
        },
        {
            code: "let {a, foo: foo} = obj;",
            output: "let {a, foo} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {foo: foo, bar: baz} = obj;",
            output: "let {foo, bar: baz} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {foo: bar, baz: baz} = obj;",
            output: "let {foo: bar, baz} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }]
        },
        {
            code: "let {foo: foo, bar: bar} = obj;",
            output: "let {foo, bar} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }
            ]
        },
        {
            code: "let {foo: {bar: bar}} = obj;",
            output: "let {foo: {bar}} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "let {foo: {bar: bar}, baz: baz} = obj;",
            output: "let {foo: {bar}, baz} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "let {'foo': foo} = obj;",
            output: "let {foo} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {'foo': foo, 'bar': baz} = obj;",
            output: "let {foo, 'bar': baz} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {'foo': bar, 'baz': baz} = obj;",
            output: "let {'foo': bar, baz} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }]
        },
        {
            code: "let {'foo': foo, 'bar': bar} = obj;",
            output: "let {foo, bar} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }
            ]
        },
        {
            code: "let {'foo': {'bar': bar}} = obj;",
            output: "let {'foo': {bar}} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "let {'foo': {'bar': bar}, 'baz': baz} = obj;",
            output: "let {'foo': {bar}, baz} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "let {foo: foo = 1, 'bar': bar = 1, baz: baz} = obj;",
            output: "let {foo = 1, bar = 1, baz} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "let {foo: {bar: bar = 1, 'baz': baz = 1}} = obj;",
            output: "let {foo: {bar = 1, baz = 1}} = obj;",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "let {foo: {bar: bar = {}} = {}} = obj;",
            output: "let {foo: {bar = {}} = {}} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "({foo: (foo) = a} = obj);",
            output: null, // The rule doesn't autofix this edge case. The correct fix would be without parens: `let {foo = a} = obj;`
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {foo: foo = (a)} = obj;",
            output: "let {foo = (a)} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "let {foo: foo = (a, b)} = obj;",
            output: "let {foo = (a, b)} = obj;",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "function func({foo: foo}) {}",
            output: "function func({foo}) {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "function func({foo: foo, bar: baz}) {}",
            output: "function func({foo, bar: baz}) {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "function func({foo: bar, baz: baz}) {}",
            output: "function func({foo: bar, baz}) {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }]
        },
        {
            code: "function func({foo: foo, bar: bar}) {}",
            output: "function func({foo, bar}) {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }
            ]
        },
        {
            code: "function func({foo: foo = 1, 'bar': bar = 1, baz: baz}) {}",
            output: "function func({foo = 1, bar = 1, baz}) {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "function func({foo: {bar: bar = 1, 'baz': baz = 1}}) {}",
            output: "function func({foo: {bar = 1, baz = 1}}) {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "function func({foo: {bar: bar = {}} = {}}) {}",
            output: "function func({foo: {bar = {}} = {}}) {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "({foo: foo}) => {}",
            output: "({foo}) => {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo, bar: baz}) => {}",
            output: "({foo, bar: baz}) => {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: bar, baz: baz}) => {}",
            output: "({foo: bar, baz}) => {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }]
        },
        {
            code: "({foo: foo, bar: bar}) => {}",
            output: "({foo, bar}) => {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }
            ]
        },
        {
            code: "({foo: foo = 1, 'bar': bar = 1, baz: baz}) => {}",
            output: "({foo = 1, bar = 1, baz}) => {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "({foo: {bar: bar = 1, 'baz': baz = 1}}) => {}",
            output: "({foo: {bar = 1, baz = 1}}) => {}",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "baz" } }
            ]
        },
        {
            code: "({foo: {bar: bar = {}} = {}}) => {}",
            output: "({foo: {bar = {}} = {}}) => {}",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "const {foo: foo, ...stuff} = myObject;",
            output: "const {foo, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "const {foo: foo, bar: baz, ...stuff} = myObject;",
            output: "const {foo, bar: baz, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "const {foo: foo, bar: bar, ...stuff} = myObject;",
            output: "const {foo, bar, ...stuff} = myObject;",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }
            ]
        },
        {
            code: "import {foo as foo} from 'foo';",
            output: "import {foo} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {'foo' as foo} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {\\u0061 as a} from 'foo';",
            output: "import {a} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "a" } }]
        },
        {
            code: "import {a as \\u0061} from 'foo';",
            output: "import {\\u0061} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "a" } }]
        },
        {
            code: "import {\\u0061 as \\u0061} from 'foo';",
            output: "import {\\u0061} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "a" } }]
        },
        {
            code: "import {foo as foo, bar as baz} from 'foo';",
            output: "import {foo, bar as baz} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo as bar, baz as baz} from 'foo';",
            output: "import {foo as bar, baz} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "baz" } }]
        },
        {
            code: "import {foo as foo, bar as bar} from 'foo';",
            output: "import {foo, bar} from 'foo';",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Import", name: "bar" } }
            ]
        },
        {
            code: "var foo = 0; export {foo as foo};",
            output: "var foo = 0; export {foo};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "var foo = 0; export {foo as 'foo'};",
            output: "var foo = 0; export {foo};",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "export {foo as 'foo'} from 'bar';",
            output: "export {foo} from 'bar';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "export {'foo' as foo} from 'bar';",
            output: "export {'foo'} from 'bar';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "export {'foo' as 'foo'} from 'bar';",
            output: "export {'foo'} from 'bar';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "export {' 👍 ' as ' 👍 '} from 'bar';",
            output: "export {' 👍 '} from 'bar';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: " 👍 " } }]
        },
        {
            code: "export {'' as ''} from 'bar';",
            output: "export {''} from 'bar';",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "" } }]
        },
        {
            code: "var a = 0; export {a as \\u0061};",
            output: "var a = 0; export {a};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "var \\u0061 = 0; export {\\u0061 as a};",
            output: "var \\u0061 = 0; export {\\u0061};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "var \\u0061 = 0; export {\\u0061 as \\u0061};",
            output: "var \\u0061 = 0; export {\\u0061};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "var foo = 0; var bar = 0; export {foo as foo, bar as baz};",
            output: "var foo = 0; var bar = 0; export {foo, bar as baz};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "var foo = 0; var baz = 0; export {foo as bar, baz as baz};",
            output: "var foo = 0; var baz = 0; export {foo as bar, baz};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "baz" } }]
        },
        {
            code: "var foo = 0; var bar = 0;export {foo as foo, bar as bar};",
            output: "var foo = 0; var bar = 0;export {foo, bar};",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Export", name: "bar" } }
            ]
        },
        {
            code: "export {foo as foo} from 'foo';",
            output: "export {foo} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "export {a as \\u0061} from 'foo';",
            output: "export {a} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "export {\\u0061 as a} from 'foo';",
            output: "export {\\u0061} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "export {\\u0061 as \\u0061} from 'foo';",
            output: "export {\\u0061} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "a" } }]
        },
        {
            code: "export {foo as foo, bar as baz} from 'foo';",
            output: "export {foo, bar as baz} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "var foo = 0; var bar = 0; export {foo as bar, baz as baz} from 'foo';",
            output: "var foo = 0; var bar = 0; export {foo as bar, baz} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "baz" } }]
        },
        {
            code: "export {foo as foo, bar as bar} from 'foo';",
            output: "export {foo, bar} from 'foo';",
            errors: [
                { messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } },
                { messageId: "unnecessarilyRenamed", data: { type: "Export", name: "bar" } }
            ]
        },

        // Should not autofix if it would remove comments
        {
            code: "({/* comment */foo: foo} = {});",
            output: "({/* comment */foo} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({/* comment */foo: foo = 1} = {});",
            output: "({/* comment */foo = 1} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo, /* comment */bar: bar} = {});",
            output: "({foo, /* comment */bar} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "bar" } }]
        },
        {
            code: "({foo/**/ : foo} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo/**/ : foo = 1} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo /**/: foo} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo /**/: foo = 1} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo://\nfoo} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: /**/foo} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (/**/foo)} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (foo/**/)} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (foo //\n)} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: /**/foo = 1} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (/**/foo) = 1} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: (foo/**/) = 1} = {});",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo/* comment */} = {});",
            output: "({foo/* comment */} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo//comment\n,bar} = {});",
            output: "({foo//comment\n,bar} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo/* comment */ = 1} = {});",
            output: "({foo/* comment */ = 1} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo // comment\n = 1} = {});",
            output: "({foo // comment\n = 1} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo = /* comment */ 1} = {});",
            output: "({foo = /* comment */ 1} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo = // comment\n 1} = {});",
            output: "({foo = // comment\n 1} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "({foo: foo = (1/* comment */)} = {});",
            output: "({foo = (1/* comment */)} = {});",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Destructuring assignment", name: "foo" } }]
        },
        {
            code: "import {/* comment */foo as foo} from 'foo';",
            output: "import {/* comment */foo} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo,/* comment */bar as bar} from 'foo';",
            output: "import {foo,/* comment */bar} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "bar" } }]
        },
        {
            code: "import {foo/**/ as foo} from 'foo';",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo /**/as foo} from 'foo';",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo //\nas foo} from 'foo';",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo as/**/foo} from 'foo';",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo as foo/* comment */} from 'foo';",
            output: "import {foo/* comment */} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "import {foo as foo/* comment */,bar} from 'foo';",
            output: "import {foo/* comment */,bar} from 'foo';",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Import", name: "foo" } }]
        },
        {
            code: "let foo; export {/* comment */foo as foo};",
            output: "let foo; export {/* comment */foo};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo, bar; export {foo,/* comment */bar as bar};",
            output: "let foo, bar; export {foo,/* comment */bar};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "bar" } }]
        },
        {
            code: "let foo; export {foo/**/as foo};",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo; export {foo as/**/ foo};",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo; export {foo as /**/foo};",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo; export {foo as//comment\n foo};",
            output: null,
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo; export {foo as foo/* comment*/};",
            output: "let foo; export {foo/* comment*/};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo, bar; export {foo as foo/* comment*/,bar};",
            output: "let foo, bar; export {foo/* comment*/,bar};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        },
        {
            code: "let foo, bar; export {foo as foo//comment\n,bar};",
            output: "let foo, bar; export {foo//comment\n,bar};",
            errors: [{ messageId: "unnecessarilyRenamed", data: { type: "Export", name: "foo" } }]
        }
    ]
});
