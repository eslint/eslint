/**
 * @fileoverview Tests for consistent-this rule.
 * @author Raphael Pigulla
 * @copyright 2015 Timothy Jones. All rights reserved.
 * @copyright 2015 David Aurelio. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
function destructuringTest(code) {
    return {
        code: code,
        args: [1, "self"],
        env: { es6: true },
        ecmaFeatures: { destructuring: true }
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/consistent-this", {
    valid: [
        { code: "var foo = 42, self = this", args: [1, "self"] },
        { code: "var self = 42", args: [1, "that"] },
        { code: "var self", args: [1, "that"] },
        { code: "var self; self = this", args: [1, "self"] },
        { code: "var foo, self; self = this", args: [1, "self"] },
        { code: "var foo, self; foo = 42; self = this", args: [1, "self"] },
        { code: "self = 42", args: [1, "that"] },
        { code: "var foo = {}; foo.bar = this", args: [1, "self"] },
        destructuringTest("var {foo, bar} = this"),
        destructuringTest("({foo, bar} = this)"),
        destructuringTest("var [foo, bar] = this"),
        destructuringTest("[foo, bar] = this")
    ],
    invalid: [
        { code: "var context = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'context' for 'this'.", type: "VariableDeclarator"}] },
        { code: "var that = this", args: [1, "self"], errors: [{ message: "Unexpected alias 'that' for 'this'.", type: "VariableDeclarator"}] },
        { code: "var foo = 42, self = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'self' for 'this'.", type: "VariableDeclarator"}] },
        { code: "var self = 42", args: [1, "self"], errors: [{ message: "Designated alias 'self' is not assigned to 'this'.", type: "VariableDeclarator"}] },
        { code: "var self", args: [1, "self"], errors: [{ message: "Designated alias 'self' is not assigned to 'this'.", type: "VariableDeclarator"}] },
        { code: "var self; self = 42", args: [1, "self"], errors: [{ message: "Designated alias 'self' is not assigned to 'this'.", type: "VariableDeclarator"}, { message: "Designated alias 'self' is not assigned to 'this'.", type: "AssignmentExpression"}] },
        { code: "context = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'context' for 'this'.", type: "AssignmentExpression"}] },
        { code: "that = this", args: [1, "self"], errors: [{ message: "Unexpected alias 'that' for 'this'.", type: "AssignmentExpression"}] },
        { code: "self = this", args: [1, "that"], errors: [{ message: "Unexpected alias 'self' for 'this'.", type: "AssignmentExpression"}] },
        { code: "self += this", args: [1, "self"], errors: [{ message: "Designated alias 'self' is not assigned to 'this'.", type: "AssignmentExpression"}] },
        { code: "var self; (function () { self = this; }())", args: [1, "self"], errors: [{ message: "Designated alias 'self' is not assigned to 'this'.", type: "VariableDeclarator"}] }
    ]
});
