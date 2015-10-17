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
        "var foo = 0; foo=+1;",
        // With "allowForLoopAfterthoughts" allowed
        { code: "var foo = 0; foo=+1;", options: [{allowForLoopAfterthoughts: true}] },
        { code: "for (i = 0; i < l; i++) { console.log(i); }", options: [{allowForLoopAfterthoughts: true}] }
    ],
    invalid: [
        { code: "var foo = 0; foo++;", errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        { code: "var foo = 0; foo--;", errors: [{ message: "Unary operator '--' used.", type: "UpdateExpression"}] },
        { code: "for (i = 0; i < l; i++) { console.log(i); }", errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        // With "allowForLoopAfterthoughts" allowed
        { code: "var foo = 0; foo++;", options: [{allowForLoopAfterthoughts: true}], errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        { code: "for (i = 0; i < l; i++) { v++; }", options: [{allowForLoopAfterthoughts: true}], errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] }
    ]
});
