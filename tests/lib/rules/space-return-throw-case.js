/**
 * @fileoverview Require spaces following return, throw, and case
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

function invalid(code, type) {
    return D
}

eslintTester.addRuleTest("space-return-throw-case", {
    valid: [
        "function f(){ return; }",
        "function f(){ return f; }",
        "switch(a){ case 0: break; }",
        "throw a"
    ],
    invalid: [
        { code: "function f(){ return-a; }", errors: [{ message: "Keyword \"return\" must be followed by whitespace.", type: "ReturnStatement" }] },
        { code: "switch(a){ case'a': break; }", errors: [{ message: "Keyword \"case\" must be followed by whitespace.", type: "SwitchCase" }] },
        { code: "throw~a", errors: [{ message: "Keyword \"throw\" must be followed by whitespace.", type: "ThrowStatement" }] }
    ]
});
