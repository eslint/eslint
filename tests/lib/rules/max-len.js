/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

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
        {
            code: "var x = 5;\nvar x = 2;",
            args: [1, 80, 4]
        }, {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            args: [1, 15, 1]
        }, {
            code: "var i = 1;\r\nvar i = 1;\n",
            args: [1, 10, 4]
        },
        {
            code: "\n// Blank line on top\nvar foo = module.exports = {};\n",
            args: [1, 80, 4]
        },
        ""
    ],

    invalid: [
        {
            code: "var x = 5, y = 2, z = 5;",
            args: [1, 10, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 10.",
                    type: "Program",
                    line: 1
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;",
            args: [1, 15, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 1
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            args: [1, 15, 4],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 1
                },
                {
                    message: "Line 2 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 2
                }
            ]
        }
    ]
});
