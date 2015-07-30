/**
 * @fileoverview Ensures that the results of typeof are compared against a valid string
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/valid-typeof"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("valid-typeof", rule, {

    valid: [
        "typeof foo === 'string'",
        "typeof foo === 'object'",
        "typeof foo === 'function'",
        "typeof foo === 'undefined'",
        "typeof foo === 'boolean'",
        "typeof foo === 'number'",
        "'string' === typeof foo",
        "'object' === typeof foo",
        "'function' === typeof foo",
        "'undefined' === typeof foo",
        "'boolean' === typeof foo",
        "'number' === typeof foo",
        "typeof foo === typeof bar",
        "typeof foo === baz",
        "typeof foo !== someType",
        "typeof bar != someType",
        "someType === typeof bar",
        "someType == typeof bar",
        "typeof foo == 'string'",
        "typeof(foo) === 'string'",
        "typeof(foo) !== 'string'",
        "typeof(foo) == 'string'",
        "typeof(foo) != 'string'",
        "var oddUse = typeof foo + 'thing'"
    ],

    invalid: [
        {
            code: "typeof foo === 'strnig'",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "'strnig' === typeof foo",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "if (typeof bar === 'umdefined') {}",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "typeof foo !== 'strnig'",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "'strnig' !== typeof foo",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "if (typeof bar !== 'umdefined') {}",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "typeof foo != 'strnig'",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "'strnig' != typeof foo",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "if (typeof bar != 'umdefined') {}",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "typeof foo == 'strnig'",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "'strnig' == typeof foo",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        },
        {
            code: "if (typeof bar == 'umdefined') {}",
            errors: [{ message: "Invalid typeof comparison value", type: "Literal" }]
        }
    ]
});
