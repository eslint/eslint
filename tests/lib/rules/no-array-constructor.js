/**
 * @fileoverview Tests for the no-array-constructor rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-array-constructor", {
    valid: [
        "var foo = new foo.Array()"
    ],
    invalid: [
        { code: "var foo = new Array()", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] }
    ]
});
