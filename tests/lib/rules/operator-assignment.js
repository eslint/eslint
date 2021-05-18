/**
 * @fileoverview Tests for operator-assignment rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/operator-assignment"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 7 } });

const EXPECTED_OPERATOR_ASSIGNMENT = [{ messageId: "replaced", type: "AssignmentExpression" }];
const UNEXPECTED_OPERATOR_ASSIGNMENT = [{ messageId: "unexpected", type: "AssignmentExpression" }];

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
        "x **= y",
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
        {
            code: "x = x ** y",
            options: ["never"]
        },
        "x = y ** x",
        "x = x * y + z"
    ],

    invalid: [{
        code: "x = x + y",
        output: "x += y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x - y",
        output: "x -= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x * y",
        output: "x *= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = y * x",
        output: null, // not fixed (possible change in behavior if y and x have valueOf() functions)
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = (y * z) * x",
        output: null, // not fixed (possible change in behavior if y/z and x have valueOf() functions)
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x / y",
        output: "x /= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x % y",
        output: "x %= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x << y",
        output: "x <<= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x >> y",
        output: "x >>= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x >>> y",
        output: "x >>>= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x & y",
        output: "x &= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x ^ y",
        output: "x ^= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x | y",
        output: "x |= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x[0] = x[0] - y",
        output: "x[0] -= y",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x.y[z['a']][0].b = x.y[z['a']][0].b * 2",
        output: null, // not fixed; might activate getters more than before
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x + y",
        output: "x += y",
        options: ["always"],
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = (x + y)",
        output: "x += y",
        options: ["always"],
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x = x + (y)",
        output: "x += (y)",
        options: ["always"],
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x += (y)",
        output: "x = x + (y)",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "x += y",
        output: "x = x + y",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo.bar = foo.bar + baz",
        output: "foo.bar += baz",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo.bar += baz",
        output: "foo.bar = foo.bar + baz",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo.bar.baz = foo.bar.baz + qux",
        output: null, // not fixed; fixing would cause a foo.bar getter to activate once rather than twice
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo.bar.baz += qux",
        output: null, // not fixed; fixing would cause a foo.bar getter to activate twice rather than once
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo[bar] = foo[bar] + baz",
        output: null, // not fixed; fixing would cause bar.toString() to get called once instead of twice
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo[bar] >>>= baz",
        output: null, // not fixed; fixing would cause bar.toString() to get called twice instead of once
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo[5] = foo[5] / baz",
        output: "foo[5] /= baz", // this is ok because 5 is a literal, so toString won't get called
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "(foo.bar) ^= ((((((((((((((((baz))))))))))))))))",
        output: "(foo.bar) = (foo.bar) ^ ((((((((((((((((baz))))))))))))))))",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo = foo ** bar",
        output: "foo **= bar",
        errors: EXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo **= bar",
        output: "foo = foo ** bar",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo *= bar + 1",
        output: "foo = foo * (bar + 1)",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo -= bar - baz",
        output: "foo = foo - (bar - baz)",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo += bar + baz",
        output: "foo = foo + (bar + baz)", // addition is not associative in JS, e.g. (1 + 2) + '3' !== 1 + (2 + '3')
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo += bar = 1",
        output: "foo = foo + (bar = 1)",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }, {
        code: "foo *= (bar + 1)",
        output: "foo = foo * (bar + 1)",
        options: ["never"],
        errors: UNEXPECTED_OPERATOR_ASSIGNMENT
    }]

});
