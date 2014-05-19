/**
 * @fileoverview Tests for always-return rule.
 * @author Justin Falcone
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/always-return", {
    valid: [
        "function f(){ return; }",
        "var x = function (y){ return y + 1;}",
        "function g(){ throw new Error(); }",
        "function Ctr(x){ this.value = x; }"
    ],
    invalid: [
        {
            code: "function f(){ }",
            errors: [{
                message: "Function must have return statement.",
                type: "FunctionDeclaration"
            }]
        }, {
            code: "var x = function (y){ y + 1 }",
            errors: [{
                message: "Function must have return statement.",
                type: "FunctionExpression"
            }]
        }
    ]
});
