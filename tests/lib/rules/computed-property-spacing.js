/**
 * @fileoverview Disallows or enforces spaces inside computed properties.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/computed-property-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("computed-property-spacing", rule, {

    valid: [

        // default - never
        "obj[foo]",
        "obj['foo']",
        { code: "var x = {[b]: a}", parserOptions: { ecmaVersion: 6 } },

        // always
        { code: "obj[ foo ]", options: ["always"] },
        { code: "obj[\nfoo\n]", options: ["always"] },
        { code: "obj[ 'foo' ]", options: ["always"] },
        { code: "obj[ 'foo' + 'bar' ]", options: ["always"] },
        { code: "obj[ obj2[ foo ] ]", options: ["always"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'map' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'for' + 'Each' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "var foo = obj[ 1 ]", options: ["always"] },
        { code: "var foo = obj[ 'foo' ];", options: ["always"] },
        { code: "var foo = obj[ [1, 1] ];", options: ["always"] },

        // always - objectLiteralComputedProperties
        { code: "var x = {[ \"a\" ]: a}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[ x ]: a}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {[ \"a\" ]() {}}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[ x ]() {}}", options: ["always"], parserOptions: { ecmaVersion: 6 } },

        // always - unrelated cases
        { code: "var foo = {};", options: ["always"] },
        { code: "var foo = [];", options: ["always"] },

        // never
        { code: "obj[foo]", options: ["never"] },
        { code: "obj['foo']", options: ["never"] },
        { code: "obj['foo' + 'bar']", options: ["never"] },
        { code: "obj['foo'+'bar']", options: ["never"] },
        { code: "obj[obj2[foo]]", options: ["never"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['map'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj[\nfoo]", options: ["never"] },
        { code: "obj[foo\n]", options: ["never"] },
        { code: "var foo = obj[1]", options: ["never"] },
        { code: "var foo = obj['foo'];", options: ["never"] },
        { code: "var foo = obj[[ 1, 1 ]];", options: ["never"] },

        // never - objectLiteralComputedProperties
        { code: "var x = {[\"a\"]: a}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[x]: a}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var x = {[\"a\"]() {}}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var y = {[x]() {}}", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        // never - unrelated cases
        { code: "var foo = {};", options: ["never"] },
        { code: "var foo = [];", options: ["never"] }
    ],

    invalid: [
        {
            code: "var foo = obj[ 1];",
            output: "var foo = obj[ 1 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 17,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            output: "var foo = obj[ 1 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            output: "var foo = obj[1];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            output: "var foo = obj[1];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[ foo ]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 4,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "obj[foo ]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 9,
                    line: 1
                }
            ]
        },
        {
            code: "obj[ foo]",
            output: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 4,
                    line: 1
                }
            ]
        },
        {
            code: "var foo = obj[1]",
            output: "var foo = obj[ 1 ]",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "MemberExpression",
                    column: 16,
                    line: 1
                }
            ]
        },

        // always - objectLiteralComputedProperties
        {
            code: "var x = {[a]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 12,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[a ]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a]: b}",
            output: "var x = {[ a ]: b}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 13,
                    line: 1
                }
            ]
        },

        // never - objectLiteralComputedProperties
        {
            code: "var x = {[ a ]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[a ]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: { tokenValue: "]" },
                    type: "Property",
                    column: 13,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a]: b}",
            output: "var x = {[a]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        },
        {
            code: "var x = {[ a\n]: b}",
            output: "var x = {[a\n]: b}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: { tokenValue: "[" },
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        }

    ]
});
