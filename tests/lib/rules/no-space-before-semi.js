/**
 * @fileoverview Tests for no-space-before-semi rule.
 * @author Jonathan Kingston
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-space-before-semi", {
    valid: [
        "var thing = 'test';",
        "var thing = function () {};",
        ";(function(){}());"
    ],
    invalid: [
        { code: "var foo = \"bar\" ;", errors: [{ message: "Variable declared with trailing whitespace before semicolon", type: "VariableDeclaration"}] },
        { code: "var foo = function() {} ;", errors: [{ message: "Variable declared with trailing whitespace before semicolon", type: "VariableDeclaration"}] },
        { code: "var foo = function() {\n} ;", errors: [{ message: "Variable declared with trailing whitespace before semicolon", type: "VariableDeclaration"}] },
        { code: "var thing = 'test' ;", errors: [{ message: "Variable declared with trailing whitespace before semicolon", type: "VariableDeclaration"}] },
        { code: "var foo = 1 + 2 ;", errors: [{ message: "Variable declared with trailing whitespace before semicolon", type: "VariableDeclaration"}] },
        { code: "/^thing$/.test('thing') ;", errors: [{ message: "Expression called with trailing whitespace before semicolon", type: "ExpressionStatement"}] },
        { code: ";(function(){}()) ;", errors: [{ message: "Expression called with trailing whitespace before semicolon", type: "ExpressionStatement"}] }
    ]
});
