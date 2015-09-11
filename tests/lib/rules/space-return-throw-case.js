/**
 * @fileoverview Require spaces following return, throw, and case
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-return-throw-case"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("space-return-throw-case", rule, {
    valid: [
        "function f(){ return; }",
        "function f(){ return f; }",
        "switch(a){ case 0: break; }",
        "switch(a){ default: break; }",
        "throw a"
    ],
    invalid: [
        {
            code: "function f(){ return-a; }",
            errors: [{ message: "Keyword \"return\" must be followed by whitespace.", type: "ReturnStatement" }],
            output: "function f(){ return -a; }"
        },
        {
            code: "switch(a){ case'a': break; }",
            errors: [{ message: "Keyword \"case\" must be followed by whitespace.", type: "SwitchCase" }],
            output: "switch(a){ case 'a': break; }"
        },
        {
            code: "throw~a",
            errors: [{ message: "Keyword \"throw\" must be followed by whitespace.", type: "ThrowStatement" }],
            output: "throw ~a"
        }
    ]
});
