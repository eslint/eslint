/**
 * @fileoverview Disallows or enforces spaces inside computed properties.
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/computed-property-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("computed-property-spacing", rule, {

    valid: [

        // default - never
        { code: "obj[foo]" },
        { code: "obj['foo']" },
        { code: "var x = {[b]: a}", ecmaFeatures: { objectLiteralComputedProperties: true } },

        // always
        { code: "obj[ foo ]", options: ["always"] },
        { code: "obj[\nfoo\n]", options: ["always"] },
        { code: "obj[ 'foo' ]", options: ["always"] },
        { code: "obj[ 'foo' + 'bar' ]", options: ["always"] },
        { code: "obj[ obj2[ foo ] ]", options: ["always"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'map' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'for' + 'Each' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ obj2[ foo ] ]", options: ["always"] },
        { code: "var foo = obj[ 1 ]", options: ["always"] },
        { code: "var foo = obj[ 'foo' ];", options: ["always"] },
        { code: "var foo = obj[ [1, 1] ];", options: ["always"] },

        // always - objectLiteralComputedProperties
        { code: "var x = {[ \"a\" ]: a}", options: ["always"], ecmaFeatures: { "objectLiteralComputedProperties": true } },
        { code: "var y = {[ x ]: a}", options: ["always"], ecmaFeatures: { "objectLiteralComputedProperties": true } },
        { code: "var x = {[ \"a\" ]() {}}", options: ["always"], ecmaFeatures: { objectLiteralComputedProperties: true, objectLiteralShorthandMethods: true } },
        { code: "var y = {[ x ]() {}}", options: ["always"], ecmaFeatures: { objectLiteralComputedProperties: true, objectLiteralShorthandMethods: true } },

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
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj[\nfoo]", options: ["never"] },
        { code: "obj[foo\n]", options: ["never"] },
        { code: "var foo = obj[1]", options: ["never"] },
        { code: "var foo = obj['foo'];", options: ["never"] },
        { code: "var foo = obj[[ 1, 1 ]];", options: ["never"] },

        // never - objectLiteralComputedProperties
        { code: "var x = {[\"a\"]: a}", options: ["never"], ecmaFeatures: { objectLiteralComputedProperties: true } },
        { code: "var y = {[x]: a}", options: ["never"], ecmaFeatures: { objectLiteralComputedProperties: true } },
        { code: "var x = {[\"a\"]() {}}", options: ["never"], ecmaFeatures: { objectLiteralComputedProperties: true, objectLiteralShorthandMethods: true } },
        { code: "var y = {[x]() {}}", options: ["never"], ecmaFeatures: { objectLiteralComputedProperties: true, objectLiteralShorthandMethods: true } },

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
                    message: "A space is required before ']'",
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
                    message: "A space is required after '['",
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
                    message: "There should be no space after '['",
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
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            output: "var foo = obj[ 1 ];",
            options: ["always"],
            errors: [
                {
                    message: "A space is required before ']'",
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
                    message: "A space is required after '['",
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                }
            ]
        },
        {
            code: "obj[ foo ]",
            outptu: "obj[foo]",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression",
                    column: 4,
                    line: 1
                },
                {
                    message: "There should be no space before ']'",
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
                    message: "There should be no space before ']'",
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
                    message: "There should be no space after '['",
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
                    message: "A space is required after '['",
                    type: "MemberExpression",
                    column: 14,
                    line: 1
                },
                {
                    message: "A space is required before ']'",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "A space is required after '['",
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    message: "A space is required before ']'",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "A space is required after '['",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "A space is required before ']'",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "Property",
                    column: 10,
                    line: 1
                },
                {
                    message: "There should be no space before ']'",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "There should be no space before ']'",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "There should be no space after '['",
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
            ecmaFeatures: { "objectLiteralComputedProperties": true },
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "Property",
                    column: 10,
                    line: 1
                }
            ]
        }

    ]
});
