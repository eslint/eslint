/**
 * @fileoverview Disallow Labeled Statements
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-labels", {

    valid: [

        "var f = { label: foo ()}",
        "while (true) {}",
        "while (true) { break; }",
        "while (true) { continue; }"
    ],

    invalid: [
        {
            code: "label: while(true) {}",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }]
        },
        {
            code: "label: while (true) { break label; }",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }, {
                message: "Unexpected label in break statement.",
                type: "BreakStatement"
            }]
        },
        {
            code: "label: while (true) { continue label; }",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }, {
                message: "Unexpected label in continue statement.",
                type: "ContinueStatement"
            }]
        }
    ]
});
