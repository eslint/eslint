/**
 * @fileoverview disallow functions that share a name with a variable
 * @author Vladimir
 * @copyright 2014 Vladimir. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-func-var", {

    valid: [
        "var blah = function notblah() {};",
        "var q, i, blah = function notblah() {};"

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "var blah = function blah() {};",
            errors: [{
                message: "function share a name with a variable blah",
                type: "FunctionExpression"
            }]
        }, {
            code: "var blah, q = function blah() {};",
            errors: [{
                message: "function share a name with a variable blah",
                type: "FunctionExpression"
            }]
        }, {
            code: "var ere, blah = function blah() {};",
            errors: [{
                message: "function share a name with a variable blah",
                type: "FunctionExpression"
            }]
        }
    ]
});
