/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var eslintTester = new ESLintTester(eslint);

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

eslintTester.addRuleTest("lib/rules/arrow-parens", {
    valid: valid,
    invalid: invalid
});
