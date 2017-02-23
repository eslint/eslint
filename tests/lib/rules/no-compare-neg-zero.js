/**
 * @fileoverview The rule should warn against code that tries to compare against -0.
 * @author Aladdin-ADD<hh_2013@foxmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-compare-neg-zero");

const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-compare-neg-zero", rule, {

    valid: [
        { code: "x === 0" },
        { code: "0 === x" },
        { code: "x == 0" },
        { code: "0 == x" },
        { code: "x === '0'" },
        { code: "'0' === x" },
        { code: "x == '0'" },
        { code: "'0' == x" },
        { code: "x === '-0'" },
        { code: "'-0' === x" },
        { code: "x == '-0'" },
        { code: "'-0' == x" },
        { code: "x === -1" },
        { code: "-1 === x" },
        { code: "x < 0" },
        { code: "0 < x" },
        { code: "x <= 0" },
        { code: "x <= 0" },
        { code: "0 <= x" },
        { code: "x > 0" },
        { code: "0 > x" },
        { code: "x >= 0" },
        { code: "0 >= x" },
        { code: "x != 0" },
        { code: "0 != x" },
        { code: "x !== 0" },
        { code: "0 !== x" },
        { code: "Object.is(x, -0)" }
    ],

    invalid: [
        {
            code: "x === -0",
            errors: [{
                message: "Do not use the '===' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 === x",
            errors: [{
                message: "Do not use the '===' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "x == -0",
            errors: [{
                message: "Do not use the '==' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 == x",
            errors: [{
                message: "Do not use the '==' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "x > -0",
            errors: [{
                message: "Do not use the '>' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 > x",
            errors: [{
                message: "Do not use the '>' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "x >= -0",
            errors: [{
                message: "Do not use the '>=' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 >= x",
            errors: [{
                message: "Do not use the '>=' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "x < -0",
            errors: [{
                message: "Do not use the '<' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 < x",
            errors: [{
                message: "Do not use the '<' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "x <= -0",
            errors: [{
                message: "Do not use the '<=' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "-0 <= x",
            errors: [{
                message: "Do not use the '<=' operator to compare against -0.",
                type: "BinaryExpression"
            }]
        }
    ]
});
