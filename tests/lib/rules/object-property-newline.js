/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/object-property-newline"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("object-property-newline", rule, {

    valid: [

        // default-case
        { code: "var obj = {\nk1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4'\n};" },
        { code: "var obj = { k1: 'val1',\nk2: 'val2',\nk3: 'val3',\nk4: 'val4' };" },
        { code: "var obj = { k1: 'val1' };" },
        { code: "var obj = {\nk1: 'val1'\n};" },
        { code: "var obj = {};" },
        { code: "foo({ k1: 'val1',\nk2: 'val2' });" },
        { code: "foo({\nk1: 'val1',\nk2: 'val2'\n});" },
        { code: "foo({\na,\nb\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\na,\nb,\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\nbar() {},\nbaz\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "foo({\n[bar]: 'baz',\nbaz \n})", parserOptions: { ecmaVersion: 6 } },

        // allowMultiplePropertiesPerLine: true
        { code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {\nk1: 'val1', k2: 'val2', k3: 'val3'\n};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = { k1: 'val1' };", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {\nk1: 'val1'\n};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "var obj = {};", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "foo({ k1: 'val1', k2: 'val2' });", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "foo({\nk1: 'val1', k2: 'val2'\n});", options: [{ allowMultiplePropertiesPerLine: true }] },
        { code: "foo({ a, b });", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ bar() {}, baz });", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo({ [bar]: 'baz', baz })", options: [{ allowMultiplePropertiesPerLine: true }], parserOptions: { ecmaVersion: 6 } }
    ],

    invalid: [

        // default-case
        {
            code: "var obj = { k1: 'val1', k2: 'val2', k3: 'val3' };",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 1,
                    column: 25
                },
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 1,
                    column: 37
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: 'val2'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1', k2: 'val2',\nk3: 'val3', k4: 'val4'\n};",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                },
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "foo({ k1: 'val1', k2: 'val2' });",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "foo({\nk1: 'val1', k2: 'val2'\n});",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 13
                }
            ]
        },
        {
            code: "foo({ a, b });",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            code: "foo({\na, b\n});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 4
                }
            ]
        },
        {
            code: "foo({\nbar() {}, baz\n});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 11
                }
            ]
        },
        {
            code: "foo({\n[bar]: 'baz', baz\n})",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 2,
                    column: 15
                }
            ]
        },
        {
            code: "var obj = {\na: {\nb: 1,\nc: 2\n}, d: 2\n};",
            errors: [
                {
                    message: "Object properties must go on a new line",
                    type: "ObjectExpression",
                    line: 5,
                    column: 4
                }
            ]
        },

        // allowMultiplePropertiesPerLine: true
        {
            code: "var obj = {\nk1: 'val1',\nk2: 'val2', k3: 'val3'\n};",
            options: [{ allowMultiplePropertiesPerLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: "var obj = {\nk1: 'val1',\nk2: 'val2', k3: 'val3'\n};",
            options: [{ allowMultiplePropertiesPerLine: true }],
            errors: [
                {
                    message: "Object properties must go on a new line if they aren't all on the same line",
                    type: "ObjectExpression",
                    line: 3,
                    column: 13
                }
            ]
        }
    ]
});
