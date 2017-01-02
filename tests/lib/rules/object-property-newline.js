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
        { code: "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4'\n};" },
        { code: "var obj = { k1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4' };" },
        { code: "var obj = { k1: 'val1' };" },
        { code: "var obj = {\nk1: 'val1'\n};" },
        { code: "var obj = {};" },
        { code: "var obj = {\n[bar]: 'baz',\nbaz\n};", parserOptions: { ecmaVersion: 6 } },
        { code: "var obj = {\nk1: 'val1',\nk2: 'val2',\n...{}\n};", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "var obj = { k1: 'val1',\nk2: 'val2',\n...{} };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "var obj = { ...{} };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "foo({ k1: 'val1',\nk2: 'val2' });" },
        { code: "foo({\nk1: 'val1',\nk2: 'val2'\n});" },
        { code: "foo({\na,\nb\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\na,\nb,\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\nbar() {},\nbaz\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\n[bar]: 'baz',\nbaz \n})", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\nk1: 'val1',\nk2: 'val2',\n...{}\n});", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "foo({ k1: 'val1',\nk2: 'val2',\n...{} });", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "foo({ ...{} });", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },

        // allowMultiplePropertiesPerLine: true
        { code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {\nk1: 'val1', k2: 'val2', k3: 'val3'\n};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = { k1: 'val1' };", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {\nk1: 'val1'\n};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = { 'k1': 'val1', k2: 'val2', ...{} };", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "var obj = {\n'k1': 'val1', k2: 'val2', ...{}\n};", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "foo({ k1: 'val1', k2: 'val2' });", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "foo({\nk1: 'val1', k2: 'val2'\n});", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "foo({ a, b });", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ bar() {}, baz });", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ [bar]: 'baz', baz })", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ 'k1': 'val1', k2: 'val2', ...{} });", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "foo({\n'k1': 'val1', k2: 'val2', ...{}\n});", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } }
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
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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

        // allowMultiplePropertiesPerLine: true
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
        },
        {
            code: "var obj = { [\nk1]: 'val1', k2: 'val2' };",
            output: "var obj = { [\nk1]: 'val1',\nk2: 'val2' };",
            options: [{ allowMultiplePropertiesPerLine: true }],
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
            options: [{ allowMultiplePropertiesPerLine: true }],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            options: [{ allowMultiplePropertiesPerLine: true }],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            options: [{ allowMultiplePropertiesPerLine: true }],
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
            options: [{ allowMultiplePropertiesPerLine: true }],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            options: [{ allowMultiplePropertiesPerLine: true }],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
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
            output: "({ foo: 1, /* comment */ bar: 2 })", // not fixed due to comment
            errors: [
                {
                    message: "Object properties must go on a new line.",
                    type: "ObjectExpression",
                    line: 1,
                    column: 26
                }
            ]
        }
    ]
});
