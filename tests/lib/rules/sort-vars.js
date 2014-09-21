/**
 * @fileoverview Tests for sort-vars rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint),
    expectedError = {
        message: "Variables within the same declaration block should be sorted alphabetically",
        type: "VariableDeclarator"
    },
    ignoreCaseArgs = [ 1, { ignoreCase: true } ];

eslintTester.addRuleTest("lib/rules/sort-vars", {
    valid: [
        "var a=10, b=4, c='abc'",
        "var a, b, c, d",
        "var b; var a; var d;",
        "var _a, a",
        "var A, a",
        "var A, b",
        { code: "var a, A;", args: ignoreCaseArgs },
        { code: "var A, a;", args: ignoreCaseArgs },
        { code: "var a, B, c;", args: ignoreCaseArgs },
        { code: "var A, b, C;", args: ignoreCaseArgs }

    ],
    invalid: [
        { code: "var b, a", errors: [ expectedError ] },
        { code: "var b=10, a=20;", errors: [ expectedError ] },
        { code: "var all=10, a = 1", errors: [ expectedError ] },
        { code: "var b, c, a, d", errors: [ expectedError ] },
        { code: "var c, d, a, b", errors: 2 },
        { code: "var a, A;", errors: [ expectedError ] },
        { code: "var a, B;", errors: [ expectedError ] },
        { code: "var a, B, c;", errors: [ expectedError ] },
        { code: "var B, a;", args: ignoreCaseArgs, errors: [ expectedError ] },
        { code: "var B, A, c;", args: ignoreCaseArgs, errors: [ expectedError ] }
    ]
});
