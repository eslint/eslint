/**
 * @fileoverview Disallow reassignment of function parameters.
 * @author Nat Burns
 * @copyright 2014 Nat Burns. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-param-reassign", {

    valid: [
        "function foo(a) { var b = a; }",
        "function foo(a) { a.prop = 'value'; }",
        "function foo(a) { (function() { var a = 12; a++; })(); }",
        { code: "function foo() { global = 13; }", globals: ["global"] }
    ],

    invalid: [
        { code: "function foo(bar) { bar = 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar += 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { (function() { bar = 13; })(); }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ++bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar++; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { --bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar--; }", errors: [{ message: "Assignment to function parameter 'bar'." }] }
    ]
});
