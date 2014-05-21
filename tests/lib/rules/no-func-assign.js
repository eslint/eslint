/**
 * @fileoverview Tests for no-func-assign.
 * @author Ian Christian Myers
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
eslintTester.addRuleTest("lib/rules/no-func-assign", {
    valid: [
        "function foo() { var foo = bar; }",
        "function foo(foo) { foo = bar; }",
        "function foo() { var foo; foo = bar; }",
        "var foo = function() {}; foo = bar;",
        "var foo = function() { foo = bar; };"
    ],
    invalid: [
        { code: "function foo() {}; foo = bar;", errors: [{ message: "'foo' is a function.", type: "AssignmentExpression"}] },
        { code: "function foo() { foo = bar; }", errors: [{ message: "'foo' is a function.", type: "AssignmentExpression"}] },
        { code: "foo = bar; function foo() { };", errors: [{ message: "'foo' is a function.", type: "AssignmentExpression"}] }
    ]
});
