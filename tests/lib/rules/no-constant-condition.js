/**
 * @fileoverview Tests for no-constant-condition rule.
 * @author Christian Schulz <http://rndm.de>
 * @copyright 2014 Christian Schulz. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-constant-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-constant-condition", rule, {
    valid: [
        "if(a);",
        "if(a == 0);",
        "if(a = f());",
        "if(1, a);",
        "while(~!a);",
        "while(a = b);",
        "for(;x < 10;);",
        "for(;;);",
        "do{ }while(x)",
        "q > 0 ? 1 : 2;",
        "while(x += 3) {}"
    ],
    invalid: [
        { code: "for(;true;);", errors: [{ message: "Unexpected constant condition.", type: "ForStatement"}] },
        { code: "do{}while(true)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement"}] },
        { code: "do{}while(t = -2)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement"}] },
        { code: "true ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "q = 0 ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "(q = 0) ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "if(-2);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(true);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if({});", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(0 < 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(0 || 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(a, 1);", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "while([]);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(~!0);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(x = 1);", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(function(){});", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(() => {});", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] }
    ]
});
