/**
 * @fileoverview Tests for comma-dangle rule.
 * @author Ian Christian Myers
 * @copyright 2015 Mathias Schreck
 * @copyright 2013 Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);

eslintTester.addRuleTest("lib/rules/comma-dangle", {
    valid: [
        "var foo = { bar: 'baz' }",
        "var foo = [ 'baz' ]",
        "[,,]",
        "[,]",
        "[]",

        { code: "var foo = { bar: 'baz', }", options: [ "always" ] },
        { code: "var foo = [ 'baz', ]", options: [ "always" ] },
        { code: "[,,]", options: [ "always" ] },
        { code: "[,]", options: [ "always" ] },
        { code: "[]", options: [ "always" ] }
    ],
    invalid: [
        {
            code: "var foo = { bar: 'baz', }",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 22
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux', });",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 29
                }
            ]
        },
        {
            code: "var foo = [ 'baz', ]",
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
            code: "var foo = { bar: 'bar'\n\n, }",
            errors: [
                {
                    message: "Unexpected trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 0
                }
            ]
        },

        {
            code: "var foo = { bar: 'baz' }",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 22
                }
            ]
        },
        {
            code: "foo({ bar: 'baz', qux: 'quux' });",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 1,
                    column: 29
                }
            ]
        },
        {
            code: "var foo = [ 'baz' ]",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Literal",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "var foo = { bar:\n\n'bar' }",
            options: [ "always" ],
            errors: [
                {
                    message: "Missing trailing comma.",
                    type: "Property",
                    line: 3,
                    column: 5
                }
            ]
        }
    ]
});
