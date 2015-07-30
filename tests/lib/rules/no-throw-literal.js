/**
 * @fileoverview Tests for no-throw-literal rule.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-throw-literal"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-throw-literal", rule, {
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
