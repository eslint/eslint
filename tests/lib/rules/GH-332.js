/**
 * @fileoverview Require spaces following unary word operators and keywords that precede expressions
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

function invalid(code, type) {
    return D
}

eslintTester.addRuleTest("GH-332", {
    valid: [
        "delete a.b",
        "new C",
        "typeof a",
        "void 0",
        "function f(){ return; }",
        "function f(){ return f; }",
        "switch(a){ case 0: break; }",
        "throw a",

        "(void 0)",
        "(void (0))"
    ],
    invalid: [
        { code: "delete(a.b)", errors: [{ message: "Unary word operator \"delete\" must be followed by whitespace.", type: "UnaryExpression" }] },
        { code: "new[a][0]", errors: [{ message: "Unary word operator \"new\" must be followed by whitespace.", type: "NewExpression" }] },
        { code: "typeof!a", errors: [{ message: "Unary word operator \"typeof\" must be followed by whitespace.", type: "UnaryExpression" }] },
        { code: "void{a:0}", errors: [{ message: "Unary word operator \"void\" must be followed by whitespace.", type: "UnaryExpression" }] },
        { code: "function f(){ return-a; }", errors: [{ message: "Keyword \"return\" must be followed by whitespace.", type: "ReturnStatement" }] },
        { code: "switch(a){ case'a': break; }", errors: [{ message: "Keyword \"case\" must be followed by whitespace.", type: "SwitchCase" }] },
        { code: "throw~a", errors: [{ message: "Keyword \"throw\" must be followed by whitespace.", type: "ThrowStatement" }] }
    ]
});
