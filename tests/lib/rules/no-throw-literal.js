/**
 * @fileoverview Tests for no-throw-literal rule.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-throw-literal", {
    valid: [
        "throw new Error();",
        "throw new Error('error');",
        "throw Error('error');",
        "throw {};",
        "throw [];",
        "var e = new Error(); throw e;",
        "try {throw new Error();} catch (e) {throw e;};"
    ],
    invalid: [
        {
            code: "throw 'error';",
            errors: [{
                message: "Do not throw a literal.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw 0;",
            errors: [{
                message: "Do not throw a literal.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw false;",
            errors: [{
                message: "Do not throw a literal.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw null;",
            errors: [{
                message: "Do not throw a literal.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw undefined;",
            errors: [{
                message: "Do not throw undefined.",
                type: "ThrowStatement"
            }]
        }
    ]
});
