/**
 * @fileoverview Tests for no-div-regex rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-div-regex"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();

ruleTester.run("no-div-regex", rule, {
    valid: [
        "var f = function() { return /foo/ig.test('bar'); };",
        "var f = function() { return /\\=foo/; };"
    ],
    invalid: [
        { code: "var f = function() { return /=foo/; };", errors: [{ message: "A regular expression literal can be confused with '/='.", type: "Literal"}] }
    ]
});
