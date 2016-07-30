/**
 * @fileoverview Tests for the no-array-constructor rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-array-constructor"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-array-constructor", rule, {
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
