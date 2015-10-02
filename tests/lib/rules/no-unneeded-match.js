/**
 * @fileoverview Test for no-unneeded-match rule
 * @author Dany Shaanan <http://www.danyshaanan.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unneeded-match"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
var useTest = "Use `Regex.test() instead`";

ruleTester.run("no-unneeded-match", rule, {
    valid: [
        "''.match(/a/)",
        "var m = ''.match(/a/)"
    ],
    invalid: [
        {code: "if (''.match(/a/)) {}", errors: [{message: useTest}]},
        {code: "while (''.match(/a/)) {}", errors: [{message: useTest}]},
        {code: "for (;''.match(/a/);) {}", errors: [{message: useTest}]},
        {code: "''.match(/a/) ? a : b", errors: [{message: useTest}]},
        {code: "!(''.match(/a/))", errors: [{message: useTest}]},
        {code: "!!(''.match(/a/))", errors: [{message: useTest}]},
        {code: "Boolean(''.match(/a/))", errors: [{message: useTest}]}
    ]
});
