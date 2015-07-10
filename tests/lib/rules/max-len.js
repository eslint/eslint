/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
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
eslintTester.addRuleTest("lib/rules/max-len", {
    valid: [
        "var x = 5;\nvar x = 2;",
        {
            code: "var x = 5;\nvar x = 2;",
            options: [80, 4]
        }, {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            options: [15, 1]
        }, {
            code: "var i = 1;\r\nvar i = 1;\n",
            options: [10, 4]
        },
        {
            code: "\n// Blank line on top\nvar foo = module.exports = {};\n",
            options: [80, 4]
        },
        "\n// Blank line on top\nvar foo = module.exports = {};\n",
        ""
    ],

    invalid: [
        {
            code: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar i = 1;",
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 80.",
                    type: "Program",
                    line: 1,
                    column: 0
                }
            ]
        },
        {
            code: "var x = 5, y = 2, z = 5;",
            options: [10, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 10.",
                    type: "Program",
                    line: 1,
                    column: 0
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;",
            options: [15, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 1,
                    column: 0
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            options: [15, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 1,
                    column: 0
                },
                {
                    message: "Line 2 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 2,
                    column: 0
                }
            ]
        }
    ]
});
