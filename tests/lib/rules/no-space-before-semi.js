/**
 * @fileoverview Tests for no-space-before-semi rule.
 * @author Jonathan Kingston
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-space-before-semi", {
    valid: [
        "var thing = 'test';",
        "var thing = 'test ; thing';",
        "var thing = \"test ; thing\";",
        "var thing = function () {};",
        "var thing = function () {\n var thing = 'test ; '; };",
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
