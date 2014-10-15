/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-infix-ops", {
    valid: [
        "a + b",
        "a     + b",
        "(a) + (b)",
        "a + (b)",
        "a + +(b)",
        "a + (+(b))",
        "(a + b) + (c + d)",
        "a = b",
        "a ? b : c",
        "var a = b"
    ],
    invalid: [
        { code: "a+b", errors: [{ message: "Infix operators must be spaced.", type: "BinaryExpression" }] },
        { code: "a +b", errors: [{ message: "Infix operators must be spaced.", type: "BinaryExpression" }] },
        { code: "a+ b", errors: [{ message: "Infix operators must be spaced.", type: "BinaryExpression" }] },
        { code: "a||b", errors: [{ message: "Infix operators must be spaced.", type: "LogicalExpression" }] },
        { code: "a ||b", errors: [{ message: "Infix operators must be spaced.", type: "LogicalExpression" }] },
        { code: "a|| b", errors: [{ message: "Infix operators must be spaced.", type: "LogicalExpression" }] },
        { code: "a=b", errors: [{ message: "Infix operators must be spaced.", type: "AssignmentExpression" }] },
        { code: "a= b", errors: [{ message: "Infix operators must be spaced.", type: "AssignmentExpression" }] },
        { code: "a =b", errors: [{ message: "Infix operators must be spaced.", type: "AssignmentExpression" }] },
        { code: "a?b:c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a?b : c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a ? b:c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a? b : c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a ?b : c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a ? b: c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "a ? b :c", errors: [{ message: "Infix operators must be spaced.", type: "ConditionalExpression" }] },
        { code: "var a=b;", errors: [{ message: "Infix operators must be spaced.", type: "VariableDeclarator" }] },
        { code: "var a= b;", errors: [{ message: "Infix operators must be spaced.", type: "VariableDeclarator" }] },
        { code: "var a =b;", errors: [{ message: "Infix operators must be spaced.", type: "VariableDeclarator" }] },
        { code: "var a = b, c=d;", errors: [{ message: "Infix operators must be spaced.", type: "VariableDeclarator" }] }
    ]
});
