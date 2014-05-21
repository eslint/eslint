/**
 * @fileoverview Require spaces following unary word operators
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-unary-word-ops", {
    valid: [
        "delete a.b",
        "new C",
        "typeof a",
        "void 0",

        "(void 0)",
        "(void (0))",
        "!a"
    ],
    invalid: [
        { code: "delete(a.b)", errors: [{ message: "Unary word operator \"delete\" must be followed by whitespace.", type: "UnaryExpression" }] },
        { code: "new[a][0]", errors: [{ message: "Unary word operator \"new\" must be followed by whitespace.", type: "NewExpression" }] },
        { code: "typeof!a", errors: [{ message: "Unary word operator \"typeof\" must be followed by whitespace.", type: "UnaryExpression" }] },
        { code: "void{a:0}", errors: [{ message: "Unary word operator \"void\" must be followed by whitespace.", type: "UnaryExpression" }] }
    ]
});
