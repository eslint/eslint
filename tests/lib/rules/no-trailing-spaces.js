/**
 * @fileoverview Disallow trailing spaces at the end of lines.
 * @author Nodeca Team <https://github.com/nodeca>
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
eslintTester.addRuleTest("lib/rules/no-trailing-spaces", {

    valid: [
        "var a = 5;",
        "var a = 5,\n    b = 3;"
    ],

    invalid: [
        {
            code: "var a = 5;      \n",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5; \n b = 3; ",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;\t\n  b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        }
    ]
});
