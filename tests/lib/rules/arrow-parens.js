/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/arrow-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var ruleTester = new RuleTester();

var valid = [
    { code: "() => {}", ecmaFeatures: { arrowFunctions: true } },
    { code: "(a) => {}", ecmaFeatures: { arrowFunctions: true } },
    { code: "(a) => a", ecmaFeatures: { arrowFunctions: true } },
    { code: "(a) => {\n}", ecmaFeatures: { arrowFunctions: true } },
    { code: "a.then((foo) => {});", ecmaFeatures: { arrowFunctions: true } },
    { code: "a.then((foo) => { if (true) {}; });", ecmaFeatures: { arrowFunctions: true } }
];

var message = message;
var type = type;

var invalid = [
    {
        code: "a => {}",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a => a",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a => {\n}",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a.then(foo => {});",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 8,
            message: message,
            type: type
        }]
    },
    {
        code: "a.then(foo => a);",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 8,
            message: message,
            type: type
        }]
    },
    {
        code: "a(foo => { if (true) {}; });",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 3,
            message: message,
            type: type
        }]
    }
];

ruleTester.run("arrow-parens", rule, {
    valid: valid,
    invalid: invalid
});
