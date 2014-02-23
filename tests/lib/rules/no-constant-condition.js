/**
 * @fileoverview Tests for no-constant-condition rule.
 * @author Christian Schulz <http://rndm.de>
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
        "var r = q > 0 ? 1 : 2;",
        "if(x == 0){ doSomething(); }",
        "if(x = readBuf()){ doSomething(); }",
        "while(isTrue()){}",
        "while(x = y){}",
        "for(;x < 10;){ doSomething(); }",
        "do{ doSomething(); }while(x)"
    ],
    invalid: [
        { code: "for(;true;){}", errors: [{ message: "Unexpected constant condition.", type: "ForStatement"}] },
        { code: "do{}while(true)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement"}] },
        { code: "do{}while(t = -2)", errors: [{ message: "Unexpected constant condition.", type: "DoWhileStatement"}] },
        { code: "var r = true ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "var r = q = 0 ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "var r = (q = 0) ? 1 : 2;", errors: [{ message: "Unexpected constant condition.", type: "ConditionalExpression"}] },
        { code: "if(-2){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if(true){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "if({}){}", errors: [{ message: "Unexpected constant condition.", type: "IfStatement"}] },
        { code: "while([]){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(42){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(x = 1){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] },
        { code: "while(function(){}){}", errors: [{ message: "Unexpected constant condition.", type: "WhileStatement"}] }
    ]
});
