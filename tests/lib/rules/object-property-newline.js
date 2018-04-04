/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/object-property-newline"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("object-property-newline", rule, {

    valid: [

        // default-case
        "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4'\n};",
        "var obj = {\nk1: 'val1'\n, k2: 'val2'\n, k3: 'val3'\n, k4: 'val4'\n};",
        "var obj = { k1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4' };",
        "var obj = { k1: 'val1'\n, k2: 'val2'\n, k3: 'val3'\n, k4: 'val4' };",
        "var obj = { k1: 'val1' };",
        "var obj = {\nk1: 'val1'\n};",
        "var obj = {};",
        { code: "var obj = {\n[bar]: 'baz',\nbaz\n};", parserOptions: { ecmaVersion: 6 } },
        { code: "var obj = {\nk1: 'val1',\nk2: 'val2',\n...{}\n};", parserOptions: { ecmaVersion: 2018 } },
        { code: "var obj = { k1: 'val1',\nk2: 'val2',\n...{} };", parserOptions: { ecmaVersion: 2018 } },
        { code: "var obj = { ...{} };", parserOptions: { ecmaVersion: 2018 } },
        "foo({ k1: 'val1',\nk2: 'val2' });",
        "foo({\nk1: 'val1',\nk2: 'val2'\n});",
        { code: "foo({\na,\nb\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\na,\nb,\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\nbar() {},\nbaz\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\n[bar]: 'baz',\nbaz \n})", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\nk1: 'val1',\nk2: 'val2',\n...{}\n});", parserOptions: { ecmaVersion: 2018 } },
        { code: "foo({ k1: 'val1',\nk2: 'val2',\n...{} });", parserOptions: { ecmaVersion: 2018 } },
        { code: "foo({ ...{} });", parserOptions: { ecmaVersion: 2018 } },

        // allowAllPropertiesOnSameLine: true
        { code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = {\nk1: 'val1', k2: 'val2', k3: 'val3'\n};", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = { k1: 'val1' };", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = {\nk1: 'val1'\n};", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = {};", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = { 'k1': 'val1', k2: 'val2', ...{} };", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 2018 } },
        { code: "var obj = {\n'k1': 'val1', k2: 'val2', ...{}\n};", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 2018 } },
        { code: "foo({ k1: 'val1', k2: 'val2' });", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "foo({\nk1: 'val1', k2: 'val2'\n});", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "foo({ a, b });", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ bar() {}, baz });", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ [bar]: 'baz', baz })", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ 'k1': 'val1', k2: 'val2', ...{} });", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 2018 } },
        { code: "foo({\n'k1': 'val1', k2: 'val2', ...{}\n});", options: [{ allowAllPropertiesOnSameLine: true }], parserOptions: { ecmaVersion: 2018 } },
        { code: "var obj = {k1: ['foo', 'bar'], k2: 'val1', k3: 'val2'};", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = {\nk1: ['foo', 'bar'], k2: 'val1', k3: 'val2'\n};", options: [{ allowAllPropertiesOnSameLine: true }] },
        { code: "var obj = {\nk1: 'val1', k2: {e1: 'foo', e2: 'bar'}, k3: 'val2'\n};", options: [{ allowAllPropertiesOnSameLine: true }] },

        // allowMultiplePropertiesPerLine: true (deprecated)
        { code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };", options: [{ allowMultiplePropertiesPerLine: true }] }
    ],

    invalid: [

        // default-case
        {
            code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };",
            output: "var obj = { k1: 'val1',\nk2: 'val2',\nk3: 'val3' };",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 25
                },
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 37
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: 'val2'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: 'val2'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: 'val2',\nk3: 'val3', k4: 'val4'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                },
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {k1: ['foo', 'bar'], k2: 'val1'};",
            output: "var obj = {k1: ['foo', 'bar'],\nk2: 'val1'};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 32
                }
            ]
        },
        {
            code: "var obj = {k1: [\n'foo', 'bar'\n], k2: 'val1'};",
            output: "var obj = {k1: [\n'foo', 'bar'\n],\nk2: 'val1'};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: {e1: 'foo', e2: 'bar'}, k3: 'val2'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: {e1: 'foo',\ne2: 'bar'},\nk3: 'val2'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                },
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 29
                },
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 41
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1',\nk2: {e1: 'foo', e2: 'bar'},\nk3: 'val2'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: {e1: 'foo',\ne2: 'bar'},\nk3: 'val2'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: "var obj = { k1: 'val1',\nk2: [\n'val2a', 'val2b', 'val2c'\n], k3: 'val3' };",
            output: "var obj = { k1: 'val1',\nk2: [\n'val2a', 'val2b', 'val2c'\n],\nk3: 'val3' };",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 4,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = { k1: 'val1', [\nk2]: 'val2' };",
            output: "var obj = { k1: 'val1',\n[\nk2]: 'val2' };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "var obj = { k1: 'val1', ...{} };",
            output: "var obj = { k1: 'val1',\n...{} };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', ...{}\n};",
            output: "var obj = {\nk1: 'val1',\n...{}\n};",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "foo({ k1: 'val1', k2: 'val2' });",
            output: "foo({ k1: 'val1',\nk2: 'val2' });",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "foo({\nk1: 'val1', k2: 'val2'\n});",
            output: "foo({\nk1: 'val1',\nk2: 'val2'\n});",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "foo({ a, b });",
            output: "foo({ a,\nb });",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "foo({\na, b\n});",
            output: "foo({\na,\nb\n});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 4
                }
            ]
        },
        {
            code: "foo({\nbar() {}, baz\n});",
            output: "foo({\nbar() {},\nbaz\n});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({\n[bar]: 'baz', baz\n})",
            output: "foo({\n[bar]: 'baz',\nbaz\n})",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 15
                }
            ]
        },
        {
            code: "foo({ k1: 'val1', [\nk2]: 'val2' })",
            output: "foo({ k1: 'val1',\n[\nk2]: 'val2' })",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "foo({ k1: 'val1', ...{} })",
            output: "foo({ k1: 'val1',\n...{} })",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "foo({\nk1: 'val1', ...{}\n})",
            output: "foo({\nk1: 'val1',\n...{}\n})",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\na: {\nb: 1,\nc: 2\n}, d: 2\n};",
            output: "var obj = {\na: {\nb: 1,\nc: 2\n},\nd: 2\n};",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 5,
                    column: 4
                }
            ]
        },
        {
            code: "({ foo: 1 /* comment */, bar: 2 })",
            output: "({ foo: 1 /* comment */,\nbar: 2 })",
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 26
                }
            ]
        },
        {
            code: "({ foo: 1, /* comment */ bar: 2 })",
            output: null, // not fixed due to comment
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 26
                }
            ]
        },

        // allowAllPropertiesOnSameLine: true
        {
            code: "var obj = {\nk1: 'val1',\nk2: 'val2', k3: 'val3'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3'\n};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\nk1:\n'val1', k2: 'val2', k3:\n'val3'\n};",
            output: "var obj = {\nk1:\n'val1',\nk2: 'val2',\nk3:\n'val3'\n};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 9
                },
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 21
                }
            ]
        },
        {
            code: "var obj = {k1: [\n'foo',\n'bar'\n], k2: 'val1'};",
            output: "var obj = {k1: [\n'foo',\n'bar'\n],\nk2: 'val1'};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 4,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = {k1: [\n'foo', 'bar'\n], k2: 'val1'};",
            output: "var obj = {k1: [\n'foo', 'bar'\n],\nk2: 'val1'};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: {\ne1: 'foo', e2: 'bar'\n}, k3: 'val2'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: {\ne1: 'foo', e2: 'bar'\n},\nk3: 'val2'\n};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                },
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 4,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = { k1: 'val1',\nk2: [\n'val2a', 'val2b', 'val2c'\n], k3: 'val3' };",
            output: "var obj = { k1: 'val1',\nk2: [\n'val2a', 'val2b', 'val2c'\n],\nk3: 'val3' };",
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 4,
                    column: 4
                }
            ]
        },
        {
            code: "var obj = { [\nk1]: 'val1', k2: 'val2' };",
            output: "var obj = { [\nk1]: 'val1',\nk2: 'val2' };",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 14
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1',\nk2: 'val2', ...{}\n};",
            output: "var obj = {\nk1: 'val1',\nk2: 'val2',\n...{}\n};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\n...{},\nk1: 'val1', k2: 'val2'\n};",
            output: "var obj = {\n...{},\nk1: 'val1',\nk2: 'val2'\n};",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "foo({ [\nk1]: 'val1', k2: 'val2' })",
            output: "foo({ [\nk1]: 'val1',\nk2: 'val2' })",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 2,
                    column: 14
                }
            ]
        },
        {
            code: "foo({\nk1: 'val1',\nk2: 'val2', ...{}\n})",
            output: "foo({\nk1: 'val1',\nk2: 'val2',\n...{}\n})",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "foo({\n...{},\nk1: 'val1', k2: 'val2'\n})",
            output: "foo({\n...{},\nk1: 'val1',\nk2: 'val2'\n})",
            options: [{ allowAllPropertiesOnSameLine: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },

        // allowMultiplePropertiesPerLine: true (deprecated)
        {
            code: "var obj = {\nk1: 'val1',\nk2: 'val2', k3: 'val3'\n};",
            output: "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3'\n};",
            options: [{ allowMultiplePropertiesPerLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line.",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        }
    ]
});
