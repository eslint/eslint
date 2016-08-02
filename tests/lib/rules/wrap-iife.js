/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/wrap-iife"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


const ruleTester = new RuleTester();

ruleTester.run("wrap-iife", rule, {
    valid: [
        {
            code: "(function(){ }());",
            options: ["any"]
        },
        {
            code: "(function(){ })();",
            options: ["any"]
        },
        {
            code: "(function a(){ }());",
            options: ["any"]
        },
        {
            code: "(function a(){ })();",
            options: ["any"]
        },
        {
            code: "(function a(){ }());",
            options: ["outside"]
        },
        {
            code: "(function a(){ })();",
            options: ["inside"]
        }
    ],
    invalid: [
        {
            code: "0, function(){ }();",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "[function(){ }()];",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "var a = function(){ }();",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "(function(){ }(), 0);",
            errors: [{ message: "Wrap an immediate function invocation in parentheses.", type: "CallExpression"}]
        },
        {
            code: "(function a(){ })();",
            options: ["outside"],
            errors: [{ message: "Move the invocation into the parens that contain the function.", type: "CallExpression" }]
        },
        {
            code: "(function a(){ }());",
            options: ["inside"],
            errors: [{ message: "Wrap only the function expression in parens.", type: "CallExpression" }]
        }
    ]
});
