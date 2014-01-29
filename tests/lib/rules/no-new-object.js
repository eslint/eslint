/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-new-object", {
    valid: [
        "var foo = new foo.Object()"
    ],
    invalid: [
        { code: "var foo = new Object()", errors: [{ message: "The object literal notation {} is preferrable.", type: "NewExpression"}] }
    ]
});
