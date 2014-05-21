/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/one-var", {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function () { var bar = true; baz(); }"
    ],
    invalid: [
        { code: "function foo() { var bar = true; var baz = false; }",
          errors: [{ message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"}] },
        { code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
          errors: [
              { message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"},
              { message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"}
          ] },
        { code: "var foo = function () { var bar = true; var baz = false; }",
          errors: [{ message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"}] },
        { code: "var foo = function () { var bar = true; if (qux) { var baz = false; } }",
          errors: [{ message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"}] },
        { code: "var foo; var bar;",
          errors: [{ message: "Combine this with the previous 'var' statement.", type: "VariableDeclaration"}] }
    ]
});
