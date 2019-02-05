/**
 * @fileoverview Tests for comma-dangle rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    rule = require("../../../lib/rules/comma-dangle"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the path to the parser of the given name.
 *
 * @param {string} name - The name of a parser to get.
 * @returns {string} The path to the specified parser.
 */
function parser(name) {
    return path.resolve(
        __dirname,
        `../../fixtures/parsers/comma-dangle/${name}.js`
    );
}

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

        { code: "[(1),]", options: ["always"] },
        { code: "var x = { foo: (1),};", options: ["always"] },
        { code: "var foo = { bar: 'baz', }", options: ["always"] },
        { code: "var foo = {\nbar: 'baz',\n}", options: ["always"] },
        { code: "var foo = {\nbar: 'baz'\n,}", options: ["always"] },
        { code: "var foo = [ 'baz', ]", options: ["always"] },
        { code: "var foo = [\n'baz',\n]", options: ["always"] },
        { code: "var foo = [\n'baz'\n,]", options: ["always"] },
        { code: "[,,]", options: ["always"] },
        { code: "[\n,\n,\n]", options: ["always"] },
        { code: "[,]", options: ["always"] },
        { code: "[\n,\n]", options: ["always"] },
        { code: "[]", options: ["always"] },
        { code: "[\n]", options: ["always"] },

        { code: "var foo = { bar: 'baz' }", options: ["always-multiline"] },
        { code: "var foo = { bar: 'baz' }", options: ["only-multiline"] },
        { code: "var foo = {\nbar: 'baz',\n}", options: ["always-multiline"] },
        { code: "var foo = {\nbar: 'baz',\n}", options: ["only-multiline"] },
        { code: "var foo = [ 'baz' ]", options: ["always-multiline"] },
        { code: "var foo = [ 'baz' ]", options: ["only-multiline"] },
        { code: "var foo = [\n'baz',\n]", options: ["always-multiline"] },
        { code: "var foo = [\n'baz',\n]", options: ["only-multiline"] },
        { code: "var foo = { bar:\n\n'bar' }", options: ["always-multiline"] },
        { code: "var foo = { bar:\n\n'bar' }", options: ["only-multiline"] },
        { code: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: ["always-multiline"] },
        { code: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: ["only-multiline"] },
        { code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: ["always-multiline"] },
        { code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: ["only-multiline"] },
        { code: "var foo = {x: {\nfoo: 'bar',\n}}", options: ["always-multiline"] },
        { code: "var foo = {x: {\nfoo: 'bar',\n}}", options: ["only-multiline"] },
        { code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: ["always-multiline"] },
        { code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: ["only-multiline"] },

        // https://github.com/eslint/eslint/issues/3627
        {
            code: "var [a, ...rest] = [];",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            options: ["always-multiline"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [\n    a,\n    ...rest\n] = [];",
            options: ["only-multiline"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "[a, ...rest] = [];",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for ([a, ...rest] of []);",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = [b, ...spread,];",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/7297
        {
            code: "var {foo, ...bar} = baz",
            options: ["always"],
            parserOptions: { ecmaVersion: 2018 }
        },

        // https://github.com/eslint/eslint/issues/3794
        {
            code: "import {foo,} from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import foo from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import foo, {abc,} from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import * as foo from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {foo,} from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {foo} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import foo from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import foo, {abc} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import * as foo from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {foo} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {foo} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {foo} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {foo} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {foo} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {\n  foo,\n} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {\n  foo,\n} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {\n  foo,\n} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export {\n  foo,\n} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {foo} from \n'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import {foo} from \n'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" }
        },


        // trailing comma in functions -- ignore by default
        {
            code: "function foo(a,) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a,)",
            options: ["never"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a)",
            options: ["always"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(\na,\nb\n) {}",
            options: ["always-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(\na,b)",
            options: ["always-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a,b,) {}",
            options: ["always-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a,b,)",
            options: ["always-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a,b,) {}",
            options: ["only-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a,b,)",
            options: ["only-multiline"],
            parserOptions: { ecmaVersion: 8 }
        },

        // trailing comma in functions
        {
            code: "function foo(a) {} ",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a)",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a,) {}",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function bar(a, ...b) {}",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a,)",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "bar(...a,)",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a) {} ",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(\na,\nb,\n) {} ",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(\na,\n...b\n) {} ",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(\na,\nb,\n)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(\na,\n...b,\n)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(a) {} ",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(a)",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(\na,\nb,\n) {} ",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(\na,\nb,\n)",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "function foo(\na,\nb\n) {} ",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo(\na,\nb\n)",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 }
        },

        // https://github.com/eslint/eslint/issues/7370
        {
            code: "function foo({a}: {a: string,}) {}",
            options: ["never"],
            parser: parser("object-pattern-1")
        },
        {
            code: "function foo({a,}: {a: string}) {}",
            options: ["always"],
            parser: parser("object-pattern-2")
        },
        {
            code: "function foo(a): {b: boolean,} {}",
            options: [{ functions: "never" }],
            parser: parser("return-type-1")
        },
        {
            code: "function foo(a,): {b: boolean} {}",
            options: [{ functions: "always" }],
            parser: parser("return-type-2")
        }
    ],
    invalid: [
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            errors: [
                {
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
                    type: "Property",
                    line: 3,
                    column: 1
                }
            ]
        },


        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = {\nbar: 'baz',\n}",
            output: "var foo = {\nbar: 'baz'\n}",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },

        {
            code: "var foo = { bar: 'baz' }",
            output: "var foo = { bar: 'baz', }",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var foo = {\nbar: 'baz'\n}",
            output: "var foo = {\nbar: 'baz',\n}",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux' });",
            output: "foo({ bar: 'baz', qux: 'quux', });",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
            output: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 3,
                    column: 12
                }
            ]
        },
        {
            code: "var foo = [ 'baz' ]",
            output: "var foo = [ 'baz', ]",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = [ 'baz'\n]",
            output: "var foo = [ 'baz',\n]",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Literal",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var foo = { bar:\n\n'bar' }",
            output: "var foo = { bar:\n\n'bar', }",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 3,
                    column: 6
                }
            ]
        },

        {
            code: "var foo = {\nbar: 'baz'\n}",
            output: "var foo = {\nbar: 'baz',\n}",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "missing",
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
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
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
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
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
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "ConditionalExpression",
                    line: 5,
                    column: 4
                }
            ]
        },
        {
            code: "var foo = { bar: 'baz', }",
            output: "var foo = { bar: 'baz' }",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
            output: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "missing",
                    type: "Property",
                    line: 3,
                    column: 12
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            output: "foo({ bar: 'baz', qux: 'quux' });",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: "var foo = [\n'baz'\n]",
            output: "var foo = [\n'baz',\n]",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "missing",
                    type: "Literal",
                    line: 2,
                    column: 6
                }
            ]
        },
        {
            code: "var foo = ['baz',]",
            output: "var foo = ['baz']",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Literal",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = ['baz',]",
            output: "var foo = ['baz']",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Literal",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = {x: {\nfoo: 'bar',\n},}",
            output: "var foo = {x: {\nfoo: 'bar',\n}}",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 3,
                    column: 2
                }
            ]
        },
        {
            code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
            output: "var foo = {a: 1, b: 2,\nc: 3, d: 4}",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
            output: "var foo = {a: 1, b: 2,\nc: 3, d: 4}",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n},]",
            output: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n}]",
            options: ["always-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "ObjectExpression",
                    line: 6,
                    column: 2
                }
            ]
        },
        {
            code: "var { a, b, } = foo;",
            output: "var { a, b } = foo;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var { a, b, } = foo;",
            output: "var { a, b } = foo;",
            options: ["only-multiline"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var [ a, b, ] = foo;",
            output: "var [ a, b ] = foo;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "Identifier",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var [ a, b, ] = foo;",
            output: "var [ a, b ] = foo;",
            options: ["only-multiline"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpected",
                    type: "Identifier",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "[(1),]",
            output: "[(1)]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Literal",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "[(1),]",
            output: "[(1)]",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Literal",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "var x = { foo: (1),};",
            output: "var x = { foo: (1)};",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Property",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "var x = { foo: (1),};",
            output: "var x = { foo: (1)};",
            options: ["only-multiline"],
            errors: [
                {
                    messageId: "unexpected",
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
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "missing", type: "ImportSpecifier" }]
        },
        {
            code: "import foo, {abc} from 'foo';",
            output: "import foo, {abc,} from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "missing", type: "ImportSpecifier" }]
        },
        {
            code: "export {foo} from 'foo';",
            output: "export {foo,} from 'foo';",
            options: ["always"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "missing", type: "ExportSpecifier" }]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ImportSpecifier" }]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ImportSpecifier" }]
        },
        {
            code: "import foo, {abc,} from 'foo';",
            output: "import foo, {abc} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ImportSpecifier" }]
        },
        {
            code: "import foo, {abc,} from 'foo';",
            output: "import foo, {abc} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ImportSpecifier" }]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            options: ["never"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ExportSpecifier" }]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            options: ["only-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ExportSpecifier" }]
        },
        {
            code: "import {foo,} from 'foo';",
            output: "import {foo} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ImportSpecifier" }]
        },
        {
            code: "export {foo,} from 'foo';",
            output: "export {foo} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "unexpected", type: "ExportSpecifier" }]
        },
        {
            code: "import {\n  foo\n} from 'foo';",
            output: "import {\n  foo,\n} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "missing", type: "ImportSpecifier" }]
        },
        {
            code: "export {\n  foo\n} from 'foo';",
            output: "export {\n  foo,\n} from 'foo';",
            options: ["always-multiline"],
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "missing", type: "ExportSpecifier" }]
        },

        // https://github.com/eslint/eslint/issues/6233
        {
            code: "var foo = {a: (1)}",
            output: "var foo = {a: (1),}",
            options: ["always"],
            errors: [{ messageId: "missing", type: "Property" }]
        },
        {
            code: "var foo = [(1)]",
            output: "var foo = [(1),]",
            options: ["always"],
            errors: [{ messageId: "missing", type: "Literal" }]
        },
        {
            code: "var foo = [\n1,\n(2)\n]",
            output: "var foo = [\n1,\n(2),\n]",
            options: ["always-multiline"],
            errors: [{ messageId: "missing", type: "Literal" }]
        },

        // trailing commas in functions
        {
            code: "function foo(a,) {}",
            output: "function foo(a) {}",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "(function foo(a,) {})",
            output: "(function foo(a) {})",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "(a,) => a",
            output: "(a) => a",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "(a,) => (a)",
            output: "(a) => (a)",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "({foo(a,) {}})",
            output: "({foo(a) {}})",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "class A {foo(a,) {}}",
            output: "class A {foo(a) {}}",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(a,)",
            output: "foo(a)",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(...a,)",
            output: "foo(...a)",
            options: [{ functions: "never" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "SpreadElement" }]
        },

        {
            code: "function foo(a) {}",
            output: "function foo(a,) {}",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "(function foo(a) {})",
            output: "(function foo(a,) {})",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "(a) => a",
            output: "(a,) => a",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "(a) => (a)",
            output: "(a,) => (a)",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "({foo(a) {}})",
            output: "({foo(a,) {}})",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "class A {foo(a) {}}",
            output: "class A {foo(a,) {}}",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "foo(a)",
            output: "foo(a,)",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "foo(...a)",
            output: "foo(...a,)",
            options: [{ functions: "always" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "SpreadElement" }]
        },

        {
            code: "function foo(a,) {}",
            output: "function foo(a) {}",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "(function foo(a,) {})",
            output: "(function foo(a) {})",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(a,)",
            output: "foo(a)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(...a,)",
            output: "foo(...a)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "SpreadElement" }]
        },
        {
            code: "function foo(\na,\nb\n) {}",
            output: "function foo(\na,\nb,\n) {}",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "foo(\na,\nb\n)",
            output: "foo(\na,\nb,\n)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "Identifier" }]
        },
        {
            code: "foo(\n...a,\n...b\n)",
            output: "foo(\n...a,\n...b,\n)",
            options: [{ functions: "always-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "missing", type: "SpreadElement" }]
        },

        {
            code: "function foo(a,) {}",
            output: "function foo(a) {}",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "(function foo(a,) {})",
            output: "(function foo(a) {})",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(a,)",
            output: "foo(a)",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "Identifier" }]
        },
        {
            code: "foo(...a,)",
            output: "foo(...a)",
            options: [{ functions: "only-multiline" }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{ messageId: "unexpected", type: "SpreadElement" }]
        },

        // separated options
        {
            code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            output: `let {a} = {a: 1};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            options: [{
                objects: "never",
                arrays: "ignore",
                imports: "ignore",
                exports: "ignore",
                functions: "ignore"
            }],
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [
                { messageId: "unexpected", line: 1 },
                { messageId: "unexpected", line: 1 }
            ]
        },
        {
            code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            output: `let {a,} = {a: 1,};
let [b] = [1];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            options: [{
                objects: "ignore",
                arrays: "never",
                imports: "ignore",
                exports: "ignore",
                functions: "ignore"
            }],
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [
                { messageId: "unexpected", line: 2 },
                { messageId: "unexpected", line: 2 }
            ]
        },
        {
            code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            output: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            options: [{
                objects: "ignore",
                arrays: "ignore",
                imports: "never",
                exports: "ignore",
                functions: "ignore"
            }],
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [
                { messageId: "unexpected", line: 3 }
            ]
        },
        {
            code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            output: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d};
(function foo(e,) {})(f,);`,
            options: [{
                objects: "ignore",
                arrays: "ignore",
                imports: "ignore",
                exports: "never",
                functions: "ignore"
            }],
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [
                { messageId: "unexpected", line: 4 }
            ]
        },
        {
            code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
            output: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e) {})(f);`,
            options: [{
                objects: "ignore",
                arrays: "ignore",
                imports: "ignore",
                exports: "ignore",
                functions: "never"
            }],
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [
                { messageId: "unexpected", line: 5 },
                { messageId: "unexpected", line: 5 }
            ]
        },

        // https://github.com/eslint/eslint/issues/7370
        {
            code: "function foo({a}: {a: string,}) {}",
            output: "function foo({a,}: {a: string,}) {}",
            options: ["always"],
            errors: [{ messageId: "missing" }],
            parser: parser("object-pattern-1")
        },
        {
            code: "function foo({a,}: {a: string}) {}",
            output: "function foo({a}: {a: string}) {}",
            options: ["never"],
            errors: [{ messageId: "unexpected" }],
            parser: parser("object-pattern-2")
        },
        {
            code: "function foo(a): {b: boolean,} {}",
            output: "function foo(a,): {b: boolean,} {}",
            options: [{ functions: "always" }],
            errors: [{ messageId: "missing" }],
            parser: parser("return-type-1")
        },
        {
            code: "function foo(a,): {b: boolean} {}",
            output: "function foo(a): {b: boolean} {}",
            options: [{ functions: "never" }],
            errors: [{ messageId: "unexpected" }],
            parser: parser("return-type-2")
        }
    ]
});
