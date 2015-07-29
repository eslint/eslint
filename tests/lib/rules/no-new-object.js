/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-new-object"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-new-object", rule, {
    valid: [
        "var foo = new foo.Object()"
    ],
    invalid: [
        { code: "var foo = new Object()", errors: [{ message: "The object literal notation {} is preferrable.", type: "NewExpression"}] }
    ]
});
