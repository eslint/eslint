/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
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
eslintTester.addRuleTest("lib/rules/no-new-object", {
    valid: [
        "var foo = new foo.Object()"
    ],
    invalid: [
        { code: "var foo = new Object()", errors: [{ message: "The object literal notation {} is preferrable.", type: "NewExpression"}] }
    ]
});
