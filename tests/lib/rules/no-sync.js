/**
 * @fileoverview Tests for no-sync.
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
eslintTester.addRuleTest("lib/rules/no-sync", {
    valid: [
        "var foo = fs.foo.foo();"
    ],
    invalid: [
        { code: "var foo = fs.fooSync();", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] },
        { code: "var foo = fs.fooSync;", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] }
    ]
});
