/**
 * @fileoverview tests for checking multiple spaces.
 * @author Vignesh Anand aka vegetableman
 * @copyright 2014 Vignesh Anand. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-multi-spaces", {

    valid: [
        "var a = 1;",
        "var a=1;",
        "var a = 1, b = 2;",
        "var arr = [1, 2];",
        "var arr = {'a': 1, 'b': 2};",
        "a, b",
        "a >>> b",
        "a ^ b",
        "a | b",
        "a & b",
        "a << b",
        "a >> b",
        "a |= b",
        "a &= b",
        "if (a & b) { }",
        "function foo(a,b) {}",
        "function foo(a, b) {}",
        "if ( a === 3 && b === 4) {}",
        "if ( a === 3||b === 4) {}",
        "if ( a <= 4) {}",
        "var foo = bar === 1 ? 2: 3"
    ],

    invalid: [
        {
            code: "var a =  1",
            errors: [{
                message: "Multiple spaces found around '='.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var a = 1,  b = 2;",
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "a <<  b",
            errors: [{
                message: "Multiple spaces found around '<<'.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var arr = {'a': 1,  'b': 2};",
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "Property"
            }]
        },
        {
            code: "if (a &  b) { }",
            errors: [{
                message: "Multiple spaces found around '&'.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "if ( a === 3  &&  b === 4) {}",
            errors: [{
                message: "Multiple spaces found around '&&'.",
                type: "LogicalExpression"
            }]
        },
        {
            code: "var foo = bar === 1 ?  2:  3",
            errors: [{
                message: "Multiple spaces found around '?'.",
                type: "ConditionalExpression"
            }, {
                message: "Multiple spaces found around ':'.",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "var a = [1,  2,  3,  4]",
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "Literal"
            }, {
                message: "Multiple spaces found around ','.",
                type: "Literal"
            }, {
                message: "Multiple spaces found around ','.",
                type: "Literal"
            }]
        },
        {
            code: "var arr = [1,  2];",
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "Literal"
            }]
        },
        {
            code: "a >>>  b",
            errors: [{
                message: "Multiple spaces found around '>>>'.",
                type: "BinaryExpression"
            }]
        }
    ]
});
