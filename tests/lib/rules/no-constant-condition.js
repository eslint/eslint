/**
 * @fileoverview Tests for no-console rule.
 * @author Christian
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-constant-condition", {
    valid: [
        "if(x){}",
        "switch(x){case 1: break;}",
        "if(x == 0){ doSomething(); }",
        "if(x = readBuf()){ doSomething(); }",
        "while(isTrue()){}"
    ],
    invalid: [
        { code: "var r = true ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "var r = q = 0 ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "var r = (q = 0) ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "if(-2){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(true){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if({}){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "switch(2){case 1: break;}", errors: [{ message: "Unexpected constant condition.", type: "SwitchStatement"}] },
        { code: "while([]){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(42){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(x = 1){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(x = y){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(function(){}){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] }
    ]
});
