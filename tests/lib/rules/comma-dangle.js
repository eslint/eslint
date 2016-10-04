/**
 * @fileoverview Tests for comma-dangle rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/comma-dangle"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("comma-dangle", rule, {
    valid: [
        "var foo = { bar: 'baz' }",
        "var foo = {\nbar: 'baz'\n}",
        "var foo = [ 'baz' ]",
        "var foo = [\n'baz'\n]",
        "[,,]",
        "[\n,\n,\n]",
        "[,]",
        "[\n,\n]",
        "[]",
        "[\n]",
        { code: "var foo = [\n      (bar ? baz : qux),\n    ];", options: ["always-multiline"] },
        { code: "var foo = { bar: 'baz' }", options: ["never"] },
        { code: "var foo = {\nbar: 'baz'\n}", options: ["never"] },
        { code: "var foo = [ 'baz' ]", options: ["never"] },
        { code: "var { a, b } = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ a, b ] = foo;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var { a,\n b, \n} = foo;", options: ["only-multiline"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ a,\n b, \n] = foo;", options: ["only-multiline"], parserOptions: { ecmaVersion: 6 } },

        { code: "[(1),]", options: [ "always" ] },
        { code: "var x = { foo: (1),};", options: [ "always" ] },
        { code: "var foo = { bar: 'baz', }", options: [ "always" ] },
        { code: "var foo = {\nbar: 'baz',\n}", options: [ "always" ] },
        { code: "var foo = {\nbar: 'baz'\n,}", options: [ "always" ] },
        { code: "var foo = [ 'baz', ]", options: [ "always" ] },
        { code: "var foo = [\n'baz',\n]", options: [ "always" ] },
        { code: "var foo = [\n'baz'\n,]", options: [ "always" ] },
        { code: "[,,]", options: [ "always" ] },
        { code: "[\n,\n,\n]", options: [ "always" ] },
        { code: "[,]", options: [ "always" ] },
        { code: "[\n,\n]", options: [ "always" ] },
        { code: "[]", options: [ "always" ] },
        { code: "[\n]", options: [ "always" ] },

        { code: "var foo = { bar: 'baz' }", options: [ "always-multiline" ] },
        { code: "var foo = { bar: 'baz' }", options: [ "only-multiline" ] },
        { code: "var foo = {\nbar: 'baz',\n}", options: [ "always-multiline" ] },
        { code: "var foo = {\nbar: 'baz',\n}", options: [ "only-multiline" ] },
        { code: "var foo = [ 'baz' ]", options: [ "always-multiline" ] },
        { code: "var foo = [ 'baz' ]", options: [ "only-multiline" ] },
        { code: "var foo = [\n'baz',\n]", options: [ "always-multiline" ] },
        { code: "var foo = [\n'baz',\n]", options: [ "only-multiline" ] },
        { code: "var foo = { bar:\n\n'bar' }", options: [ "always-multiline" ] },
        { code: "var foo = { bar:\n\n'bar' }", options: [ "only-multiline" ] },
        { code: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: [ "always-multiline" ]},
        { code: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: [ "only-multiline" ]},
        { code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: [ "always-multiline" ]},
        { code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: [ "only-multiline" ]},
        { code: "var foo = {x: {\nfoo: 'bar',\n}}", options: [ "always-multiline" ]},
        { code: "var foo = {x: {\nfoo: 'bar',\n}}", options: [ "only-multiline" ]},
        { code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: [ "always-multiline" ]},
        { code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: [ "only-multiline" ]},
        { code: "[,,]", options: [ "always" ] },
        { code: "[\n,\n,\n]", options: [ "always" ] },
        { code: "[,]", options: [ "always" ] },
        { code: "[\n,\n]", options: [ "always" ] },
        { code: "[]", options: [ "always" ] },
        { code: "[\n]", options: [ "always" ] },

        // https://github.com/eslint/eslint/issues/3627
        {
            code: "var [a, ...rest] = [];",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            parserOptions: { ecmaVersion: 6 },
            options: ["always-multiline"]
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            parserOptions: { ecmaVersion: 6 },
            options: ["only-multiline"]
        },
        {
            code: "[a, ...rest] = [];",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "for ([a, ...rest] of []);",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "var a = [b, ...spread,];",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },

        // https://github.com/eslint/eslint/issues/7297
        {
            code: "var {foo, ...bar} = baz",
            parserOptions: { ecmaVersion: 8, ecmaFeatures: { experimentalObjectRestSpread: true } },
            options: ["always"]
        },

        // https://github.com/eslint/eslint/issues/3794
        {
            code: "import {foo,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"]
        },
        {
            code: "import foo from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"]
        },
        {
            code: "import foo, {abc,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"]
        },
        {
            code: "import * as foo from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"]
        },
        {
            code: "export {foo,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"]
        },
        {
            code: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"]
        },
        {
            code: "import foo from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"]
        },
        {
            code: "import foo, {abc} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"]
        },
        {
            code: "import * as foo from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"]
        },
        {
            code: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"]
        },
        {
            code: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"]
        },
        {
            code: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"]
        },
        {
            code: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"]
        },
        {
            code: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"]
        },
        {
            code: "import {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"]
        },
        {
            code: "import {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"]
        },
        {
            code: "export {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"]
        },
        {
            code: "export {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"]
        },
        {
            code: "import {foo} from \n'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"]
        },
        {
            code: "import {foo} from \n'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"]
        }
    ],
    invalid: [
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = {\nbar: 'baz',\n}",
            output: "var foo = {\nbar: 'baz'\n}",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
            output: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = [ 'baz', ]",
            output: "var foo = [ 'baz' ]",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [ 'baz',\n]",
            output: "var foo = [ 'baz'\n]",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = { bar: 'bar'\n\n, }",
            output: "var foo = { bar: 'bar'\n\n }",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 1
                }
            ]
        },


        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: [ "never" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = {\nbar: 'baz',\n}",
            output: "var foo = {\nbar: 'baz'\n}",
            options: [ "never" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: [ "never" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },

        {
            code: "var foo = { bar: 'baz' }",
            output: "var foo = { bar: 'baz', }",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = {\nbar: 'baz'\n}",
            output: "var foo = {\nbar: 'baz',\n}",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux' });",
            output: "foo({ bar: 'baz', qux: 'quux', });",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
            output: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = [ 'baz' ]",
            output: "var foo = [ 'baz', ]",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [ 'baz'\n]",
            output: "var foo = [ 'baz',\n]",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = { bar:\n\n'bar' }",
            output: "var foo = { bar:\n\n'bar', }",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 6
                }
            ]
        },

        {
            code: "var foo = {\nbar: 'baz'\n}",
            output: "var foo = {\nbar: 'baz',\n}",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code:
            "var foo = [\n" +
            "  bar,\n" +
            "  (\n" +
            "    baz\n" +
            "  )\n" +
            "];",
            output:
            "var foo = [\n" +
            "  bar,\n" +
            "  (\n" +
            "    baz\n" +
            "  ),\n" +
            "];",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Identifier",
                    line: 5,
                    column: 4
                }
            ]
        },
        {
            code:
            "var foo = {\n" +
            "  foo: 'bar',\n" +
            "  baz: (\n" +
            "    qux\n" +
            "  )\n" +
            "};",
            output:
            "var foo = {\n" +
            "  foo: 'bar',\n" +
            "  baz: (\n" +
            "    qux\n" +
            "  ),\n" +
            "};",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 5,
                    column: 4
                }
            ]
        },
        {

            // https://github.com/eslint/eslint/issues/7291
            code:
            "var foo = [\n" +
            "  (bar\n" +
            "    ? baz\n" +
            "    : qux\n" +
            "  )\n" +
            "];",
            output:
            "var foo = [\n" +
            "  (bar\n" +
            "    ? baz\n" +
            "    : qux\n" +
            "  ),\n" +
            "];",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "ConditionalExpression",
                    line: 5,
                    column: 4
                }
            ]
        },
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = { bar: 'baz', }",
            ouput: "var foo = { bar: 'baz' }",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
            output: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 12
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            ouput: "foo({ bar: 'baz', qux: 'quux' });",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "var foo = [\n'baz'\n]",
            output: "var foo = [\n'baz',\n]",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Literal",
                    line: 2,
                    column: 6
                }
            ]
        },
        {
            code: "var foo = ['baz',]",
            output: "var foo = ['baz']",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = ['baz',]",
            output: "var foo = ['baz']",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = {x: {\nfoo: 'bar',\n},}",
            output: "var foo = {x: {\nfoo: 'bar',\n}}",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
            output: "var foo = {a: 1, b: 2,\nc: 3, d: 4}",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
            output: "var foo = {a: 1, b: 2,\nc: 3, d: 4}",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n},]",
            output: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n}]",
            options: [ "always-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "ObjectExpression",
                    line: 6,
                    column: 2
                }
            ]
        },
        {
            code: "var { a, b, } = foo;",
            output: "var { a, b } = foo;",
            options: [ "never" ],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var { a, b, } = foo;",
            output: "var { a, b } = foo;",
            options: [ "only-multiline" ],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var [ a, b, ] = foo;",
            output: "var [ a, b ] = foo;",
            options: [ "never" ],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Identifier",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var [ a, b, ] = foo;",
            output: "var [ a, b ] = foo;",
            options: [ "only-multiline" ],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Identifier",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "[(1),]",
            output: "[(1)]",
            options: [ "never" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "[(1),]",
            output: "[(1)]",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "var x = { foo: (1),};",
            output: "var x = { foo: (1)};",
            options: [ "never" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "var x = { foo: (1),};",
            output: "var x = { foo: (1)};",
            options: [ "only-multiline" ],
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 19
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/3794
        {
            code: "import {foo} from 'foo';",
            output: "import {foo,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"],
            errors: [{message: "Missing trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "import foo, {abc} from 'foo';",
            output: "import foo, {abc,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"],
            errors: [{message: "Missing trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "export {foo} from 'foo';",
            output: "export {foo,} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always"],
            errors: [{message: "Missing trailing comma.", type: "ExportSpecifier"}]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "import foo, {abc,} from 'foo';",
            output: "import foo, {abc} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "import foo, {abc,} from 'foo';",
            output: "import foo, {abc} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["never"],
            errors: [{message: "Unexpected trailing comma.", type: "ExportSpecifier"}]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ExportSpecifier"}]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ExportSpecifier"}]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["only-multiline"],
            errors: [{message: "Unexpected trailing comma.", type: "ExportSpecifier"}]
        },
        {
            code: "import {\n  foo\n} from 'foo';",
            output: "import {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"],
            errors: [{message: "Missing trailing comma.", type: "ImportSpecifier"}]
        },
        {
            code: "export {\n  foo\n} from 'foo';",
            output: "export {\n  foo,\n} from 'foo';",
            parserOptions: { sourceType: "module" },
            options: ["always-multiline"],
            errors: [{message: "Missing trailing comma.", type: "ExportSpecifier"}]
        },

        // https://github.com/eslint/eslint/issues/6233
        {
            code: "var foo = {a: (1)}",
            output: "var foo = {a: (1),}",
            options: ["always"],
            errors: [{message: "Missing trailing comma.", type: "Property"}]
        },
        {
            code: "var foo = [(1)]",
            output: "var foo = [(1),]",
            options: ["always"],
            errors: [{message: "Missing trailing comma.", type: "Literal"}]
        },
        {
            code: "var foo = [\n1,\n(2)\n]",
            output: "var foo = [\n1,\n(2),\n]",
            options: ["always-multiline"],
            errors: [{message: "Missing trailing comma.", type: "Literal"}]
        }
    ]
});
