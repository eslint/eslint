/**
 * @fileoverview Tests for no-div-regex rule.
 * @author Matt DuVall <http://www.mattduvall.com>
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
eslintTester.addRuleTest("lib/rules/no-div-regex", {
    valid: [
        "var f = function() { return /foo/ig.test('bar'); };",
        "var f = function() { return /\\=foo/; };"
    ],
    invalid: [
        { code: "var f = function() { return /=foo/; };", errors: [{ message: "A regular expression literal can be confused with '/='.", type: "Literal"}] }
    ]
});
