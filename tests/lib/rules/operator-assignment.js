/**
 * @fileoverview Tests for operator-assignment rule.
 * @author Brandon Mills
 * @copyright 2014 Brandon Mills. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/operator-assignment"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("operator-assignment", rule, {

    valid: [
        "x = y",
        "x = y + x",
        "x += x + y",
        "x = (x + y) - z",
        "x -= y",
        "x = y - x",
        "x *= x",
        "x = y * z",
        "x = (x * y) * z",
        "x = y / x",
        "x /= y",
        "x %= y",
        "x <<= y",
        "x >>= x >> y",
        "x >>>= y",
        "x &= y",
        "x ^= y ^ z",
        "x |= x | y",
        "x = x && y",
        "x = x || y",
        "x = x < y",
        "x = x > y",
        "x = x <= y",
        "x = x >= y",
        "x = x instanceof y",
        "x = x in y",
        "x = x == y",
        "x = x != y",
        "x = x === y",
        "x = x !== y",
        "x[y] = x['y'] + z",
        "x.y = x['y'] / z",
        "x.y = z + x.y",
        "x[fn()] = x[fn()] + y",
        {
            code: "x += x + y",
            options: ["always"]
        },
        {
            code: "x = x + y",
            options: ["never"]
        },
        "x = x < y",
        "x = x > y",
        "x = x <= y",
        "x = x >= y",
        "x = x == y",
        "x = x != y",
        "x = x === y",
        "x = x !== y",
        "x = x && y",
        "x = x || y"
    ],

    invalid: [{
        code: "x = x + y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x - y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x * y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = y * x",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = (y * z) * x",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x / y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x % y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x << y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x >> y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x >>> y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x & y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x ^ y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x | y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x[0] = x[0] - y",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x.y[z['a']][0].b = x.y[z['a']][0].b * 2",
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x = x + y",
        options: ["always"],
        errors: [{
            message: "Assignment can be replaced with operator assignment.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "x += y",
        options: ["never"],
        errors: [{
            message: "Unexpected operator assignment shorthand.",
            type: "AssignmentExpression"
        }]
    }]

});
