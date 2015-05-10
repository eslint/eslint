/**
 * @fileoverview Require spaces following return, throw, and case
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/space-return-throw-case", {
    valid: [
        "function f(){ return; }",
        "function f(){ return f; }",
        "switch(a){ case 0: break; }",
        "switch(a){ default: break; }",
        "throw a"
    ],
    invalid: [
        { code: "function f(){ return-a; }", errors: [{ message: "Keyword \"return\" must be followed by whitespace.", type: "ReturnStatement" }] },
        { code: "switch(a){ case'a': break; }", errors: [{ message: "Keyword \"case\" must be followed by whitespace.", type: "SwitchCase" }] },
        { code: "throw~a", errors: [{ message: "Keyword \"throw\" must be followed by whitespace.", type: "ThrowStatement" }] }
    ]
});
