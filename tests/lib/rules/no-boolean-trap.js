/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/no-boolean-trap"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const callTemplates = [
    "someFunc({value});",
    "someFunc.apply(null, {value});",
    "someFunc.call(null, {value})",
    "someFunc.bind(someFunc, {value})"
];

const allowedValues = [
    "0",
    "1",
    "'true'",
    "'false'",
    "{}",
    "[]",
    "['true']",
    "['false']",
    "new Date(0)",
    "null",
    "undefined"
];
const disallowedValues = [
    "true",
    "false"
];

const validExpressions = [];

allowedValues.forEach(value => {
    callTemplates.forEach(template => {
        validExpressions.push(template.replace("{value}", value));
    });
});

const invalidExpressions = [];

disallowedValues.forEach(value => {
    callTemplates.forEach(template => {
        invalidExpressions.push({
            code: template.replace("{value}", value),
            errors: [{
                message: "Unexpected boolean trap",
                type: "CallExpression"
            }]
        });
    });
});

ruleTester.run("no-boolean-trap", rule, {
    valid: validExpressions,
    invalid: invalidExpressions
});
