/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-object"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-object", rule, {
    valid: [
        "var foo = new foo.Object()",
        {
            code: "var foo = new Object(BigInt('1n'))",
            options: [
                { allowWithArguments: true }
            ]
        }
    ],
    invalid: [
        { code: "var foo = new Object()", errors: [{ message: "The object literal notation {} is preferrable.", type: "NewExpression" }] },
        { code: "var foo = new Object(BigInt('1n'))", errors: [{ message: "The object literal notation {} is preferrable.", type: "NewExpression" }] }
    ]
});
