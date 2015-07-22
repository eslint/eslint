/**
 * @fileoverview Tests for the no-array-constructor rule
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
eslintTester.addRuleTest("lib/rules/no-array-constructor", {
    valid: [
        "new Array(x)",
        "Array(x)",
        "new Array(9)",
        "Array(9)",
        "new foo.Array()",
        "foo.Array()",
        "new Array.foo",
        "Array.foo()"
    ],
    invalid: [
        { code: "new Array()", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] },
        { code: "new Array", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] },
        { code: "new Array(x, y)", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] },
        { code: "new Array(0, 1, 2)", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] }
    ]
});
