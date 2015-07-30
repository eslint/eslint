/**
 * @fileoverview Tests for no-plusplus.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-plusplus"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-plusplus", rule, {
    valid: [
        "var foo = 0; foo=+1;"
    ],
    invalid: [
        { code: "var foo = 0; foo++;", errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        { code: "var foo = 0; foo--;", errors: [{ message: "Unary operator '--' used.", type: "UpdateExpression"}] }
    ]
});
