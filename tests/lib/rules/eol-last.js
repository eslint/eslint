/**
 * @fileoverview Check, that file is ended with newline, and there are no multiple empty lines at the end.
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
eslintTester.addRuleTest("lib/rules/eol-last", {

    valid: [
        "var a = 123;\n"
    ],

    invalid: [
        {
            code: "var a = 123;",
            errors: [{ message: "Unexpected end of file - newline needed.", type: "Program" }]
        },
        {
            code: "var a = 123;\n\n",
            errors: [{ message: "Multiple empty lines at the end of file.", type: "Program" }]
        },
        {
            code: "var a = 123;\n   \n",
            errors: [{ message: "Multiple empty lines at the end of file.", type: "Program" }]
        }
    ]
});
