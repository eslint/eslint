/**
 * @fileoverview Disallows or enforces spaces inside of object literals.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const resolvePath = require("path").resolve,
    rule = require("../../../lib/rules/object-curly-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("object-curly-spacing", rule, {

    valid: [

        // always - object literals
        { code: "var obj = { foo: bar, baz: qux };", options: ["always"] },
        { code: "var obj = { foo: { bar: quxx }, baz: qux };", options: ["always"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", options: ["always"] },

        // always - destructuring
        { code: "var { x } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { x, y } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { x,y } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\nx,y } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\nx,y\n} = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { x = 10, y } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { x: { z }, y } = y", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\ny,\n} = x", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { y, } = x", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { y: x } = x", options: ["always"], parserOptions: { ecmaVersion: 6 } },

        // always - import / export
        { code: "import door from 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import * as door from 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import { door } from 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import {\ndoor } from 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "export { door } from 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import { house, mouse } from 'caravan'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import house, { mouse } from 'caravan'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import door, { house, mouse } from 'caravan'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "var door = 0;export { door }", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import 'room'", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import { bar as x } from 'foo';", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import { x, } from 'foo';", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "import {\nx,\n} from 'foo';", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "export { x, } from 'foo';", options: ["always"], parserOptions: { sourceType: "module" } },
        { code: "export {\nx,\n} from 'foo';", options: ["always"], parserOptions: { sourceType: "module" } },

        // always - empty object
        { code: "var foo = {};", options: ["always"] },

        // always - objectsInObjects
        { code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 }};", options: ["always", { objectsInObjects: false }] },
        { code: "var a = { noop: function () {} };", options: ["always", { objectsInObjects: false }] },
        { code: "var { y: { z }} = x", options: ["always", { objectsInObjects: false }], parserOptions: { ecmaVersion: 6 } },

        // always - arraysInObjects
        { code: "var obj = { 'foo': [ 1, 2 ]};", options: ["always", { arraysInObjects: false }] },
        { code: "var a = { thingInList: list[0] };", options: ["always", { arraysInObjects: false }] },

        // always - arraysInObjects, objectsInObjects
        { code: "var obj = { 'qux': [ 1, 2 ], 'foo': { 'bar': 1, 'baz': 2 }};", options: ["always", { arraysInObjects: false, objectsInObjects: false }] },

        // always - arraysInObjects, objectsInObjects (reverse)
        { code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 }, 'qux': [ 1, 2 ]};", options: ["always", { arraysInObjects: false, objectsInObjects: false }] },

        // never
        { code: "var obj = {foo: bar,\nbaz: qux\n};", options: ["never"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux};", options: ["never"] },

        // never - object literals
        { code: "var obj = {foo: bar, baz: qux};", options: ["never"] },
        { code: "var obj = {foo: {bar: quxx}, baz: qux};", options: ["never"] },
        { code: "var obj = {foo: {\nbar: quxx}, baz: qux\n};", options: ["never"] },
        { code: "var obj = {foo: {\nbar: quxx\n}, baz: qux};", options: ["never"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", options: ["never"] },

        // never - destructuring
        { code: "var {x} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {x, y} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {x,y} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\nx,y\n} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {x = 10} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {x = 10, y} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {x: {z}, y} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\nx: {z\n}, y} = y", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {\ny,\n} = x", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {y,} = x", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {y:x} = x", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        // never - import / export
        { code: "import door from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import * as door from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {door} from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {door} from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {\ndoor} from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {\ndoor\n} from 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {house,mouse} from 'caravan'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {house, mouse} from 'caravan'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "var door = 0;export {door}", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import 'room'", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import x, {bar} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import x, {bar, baz} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {bar as y} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {x,} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "import {\nx,\n} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {x,} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {\nx,\n} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },


        // never - empty object
        { code: "var foo = {};", options: ["never"] },

        // never - objectsInObjects
        { code: "var obj = {'foo': {'bar': 1, 'baz': 2} };", options: ["never", { objectsInObjects: true }] },

        /*
         * https://github.com/eslint/eslint/issues/3658
         * Empty cases.
         */
        { code: "var {} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var [] = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a: {}} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a: []} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "import {} from 'foo';", parserOptions: { sourceType: "module" } },
        { code: "export {} from 'foo';", parserOptions: { sourceType: "module" } },
        { code: "export {};", parserOptions: { sourceType: "module" } },
        { code: "var {} = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [] = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {a: {}} = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var {a: []} = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "import {} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {} from 'foo';", options: ["never"], parserOptions: { sourceType: "module" } },
        { code: "export {};", options: ["never"], parserOptions: { sourceType: "module" } },

        // https://github.com/eslint/eslint/issues/6940
        {
            code: "function foo ({a, b}: Props) {\n}",
            options: ["never"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-spacing/flow-stub-parser-never-valid")
        }
    ],

    invalid: [
        {
            code: "import {bar} from 'foo.js';",
            output: "import { bar } from 'foo.js';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 8
                },
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "import { bar as y} from 'foo.js';",
            output: "import { bar as y } from 'foo.js';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "import {bar as y} from 'foo.js';",
            output: "import { bar as y } from 'foo.js';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 8
                },
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "import { bar} from 'foo.js';",
            output: "import { bar } from 'foo.js';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 13
                }
            ]
        },
        {
            code: "import x, { bar} from 'foo';",
            output: "import x, { bar } from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 16
                }

            ]
        },
        {
            code: "import x, { bar, baz} from 'foo';",
            output: "import x, { bar, baz } from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 21
                }

            ]
        },
        {
            code: "import x, {bar} from 'foo';",
            output: "import x, { bar } from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 15
                }

            ]
        },
        {
            code: "import x, {bar, baz} from 'foo';",
            output: "import x, { bar, baz } from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 20
                }
            ]
        },
        {
            code: "import {bar,} from 'foo';",
            output: "import { bar, } from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 8
                },
                {
                    message: "A space is required before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 13
                }

            ]
        },
        {
            code: "import { bar, } from 'foo';",
            output: "import {bar,} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 8
                },
                {
                    message: "There should be no space before '}'.",
                    type: "ImportDeclaration",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "var bar = 0;\nexport {bar};",
            output: "var bar = 0;\nexport { bar };",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ExportNamedDeclaration",
                    line: 2,
                    column: 8
                },
                {
                    message: "A space is required before '}'.",
                    type: "ExportNamedDeclaration",
                    line: 2,
                    column: 12
                }
            ]
        },

        // always - arraysInObjects
        {
            code: "var obj = { 'foo': [ 1, 2 ] };",
            output: "var obj = { 'foo': [ 1, 2 ]};",
            options: ["always", { arraysInObjects: false }],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { 'foo': [ 1, 2 ] , 'bar': [ 'baz', 'qux' ] };",
            output: "var obj = { 'foo': [ 1, 2 ] , 'bar': [ 'baz', 'qux' ]};",
            options: ["always", { arraysInObjects: false }],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression"
                }
            ]
        },

        // always-objectsInObjects
        {
            code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 } };",
            output: "var obj = { 'foo': { 'bar': 1, 'baz': 2 }};",
            options: ["always", { objectsInObjects: false }],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 43
                }
            ]
        },
        {
            code: "var obj = { 'foo': [ 1, 2 ] , 'bar': { 'baz': 1, 'qux': 2 } };",
            output: "var obj = { 'foo': [ 1, 2 ] , 'bar': { 'baz': 1, 'qux': 2 }};",
            options: ["always", { objectsInObjects: false }],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 61
                }
            ]
        },

        // always-destructuring trailing comma
        {
            code: "var { a,} = x;",
            output: "var { a, } = x;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "var {a, } = x;",
            output: "var {a,} = x;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "var {a:b } = x;",
            output: "var {a:b} = x;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "var { a:b } = x;",
            output: "var {a:b} = x;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 11
                }
            ]
        },

        // never-objectsInObjects
        {
            code: "var obj = {'foo': {'bar': 1, 'baz': 2}};",
            output: "var obj = {'foo': {'bar': 1, 'baz': 2} };",
            options: ["never", { objectsInObjects: true }],
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 39
                }
            ]
        },
        {
            code: "var obj = {'foo': [1, 2] , 'bar': {'baz': 1, 'qux': 2}};",
            output: "var obj = {'foo': [1, 2] , 'bar': {'baz': 1, 'qux': 2} };",
            options: ["never", { objectsInObjects: true }],
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 55
                }
            ]
        },

        // always & never
        {
            code: "var obj = {foo: bar, baz: qux};",
            output: "var obj = { foo: bar, baz: qux };",
            options: ["always"],
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "var obj = {foo: bar, baz: qux };",
            output: "var obj = { foo: bar, baz: qux };",
            options: ["always"],
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            output: "var obj = { foo: bar, baz: qux };",
            options: ["always"],
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 31
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux };",
            output: "var obj = {foo: bar, baz: qux};",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 32
                }
            ]
        },
        {
            code: "var obj = {foo: bar, baz: qux };",
            output: "var obj = {foo: bar, baz: qux};",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 31
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            output: "var obj = {foo: bar, baz: qux};",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var obj = { foo: { bar: quxx}, baz: qux};",
            output: "var obj = {foo: {bar: quxx}, baz: qux};",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var obj = {foo: {bar: quxx }, baz: qux };",
            output: "var obj = {foo: {bar: quxx}, baz: qux};",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 28
                },
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 40
                }
            ]
        },
        {
            code: "export const thing = {value: 1 };",
            output: "export const thing = { value: 1 };",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 22
                }
            ]
        },

        // destructuring
        {
            code: "var {x, y} = y",
            output: "var { x, y } = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: "A space is required before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "var { x, y} = y",
            output: "var { x, y } = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var { x, y } = y",
            output: "var {x, y} = y",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space after '{'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 5
                },
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "var {x, y } = y",
            output: "var {x, y} = y",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var { x=10} = y",
            output: "var { x=10 } = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var {x=10 } = y",
            output: "var { x=10 } = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "A space is required after '{'.",
                    type: "ObjectPattern",
                    line: 1,
                    column: 5
                }
            ]
        },

        // never - arraysInObjects
        {
            code: "var obj = {'foo': [1, 2]};",
            output: "var obj = {'foo': [1, 2] };",
            options: ["never", { arraysInObjects: true }],
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {'foo': [1, 2] , 'bar': ['baz', 'qux']};",
            output: "var obj = {'foo': [1, 2] , 'bar': ['baz', 'qux'] };",
            options: ["never", { arraysInObjects: true }],
            errors: [
                {
                    message: "A space is required before '}'.",
                    type: "ObjectExpression"
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/6940
        {
            code: "function foo ({a, b }: Props) {\n}",
            output: "function foo ({a, b}: Props) {\n}",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space before '}'.",
                    type: "ObjectPattern"
                }
            ],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-spacing/flow-stub-parser-never-invalid")
        }
    ]
});
