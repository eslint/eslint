/**
 * @fileoverview Tests for consistent-this rule.
 * @author Raphael Pigulla
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
eslintTester.addRuleTest("lib/rules/consistent-this", {
    valid: [
        { code: "var foo = 42, self = this", args: [1, "self"] },
        { code: "var self = 42", args: [1, "that"] },
        { code: "var self", args: [1, "that"] }
    ],
    invalid: [
        { code: "var context = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'context' for 'this'.", type: "VariableDeclaration"}] },
        { code: "var that = this", args: [1, "self"], errors: [{ message: "Unexpected alias 'that' for 'this'.", type: "VariableDeclaration"}] },
        { code: "var foo = 42, self = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'self' for 'this'.", type: "VariableDeclaration"}] },
        { code: "var self = 42", args: [1, "self"], errors: [{ message: "Designated 'this' alias 'self' is not assigned to the current execution context.", type: "VariableDeclaration"}] },
        { code: "var self", args: [1, "self"], errors: [{ message: "Designated 'this' alias 'self' is not assigned to the current execution context.", type: "VariableDeclaration"}] }
    ]
});
