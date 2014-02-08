/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/func-names", {
    valid: [
        "function Foo() {}; Foo.prototype.bar = function bar(){};"
    ],
    invalid: [
        { code: "function Foo() {}; Foo.prototype.bar = function (){};", errors: [{ message: "The function expression does not have a name. Named function expressions aid in debugging.", type: "FunctionExpression"}] }
    ]
});
