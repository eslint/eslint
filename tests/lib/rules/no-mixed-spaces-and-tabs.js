/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-mixed-spaces-and-tabs", {

    valid: [
        {
            code: "\tvar x = 5;"
        },
        {
            code: "    var x = 5;"
        },
        {
            code: "\t/*\n\t * Hello\n\t */"
        },
        {
            code: "\tvar x = 5,\n\t    y = 2;",
            args: [2, true]
        },
        {
            code: "\tvar x = 5,\n\t    y = 2;",
            args: [2, "smart-tabs"]
        }
    ],

    invalid: [
        {
            code: "function add(x, y) {\n\t return x + y;\n}",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        },
        {
            code: "\t var x = 5, y = 2, z = 5;\n\n\t \tvar j =\t x + y;\nz *= j;",
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 1
                },
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 3
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            args: [2, true],
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        },
        {
            code: "\tvar x = 5,\n  \t  y = 2;",
            args: [2, "smart-tabs"],
            errors: [
                {
                    message: "Mixed spaces and tabs.",
                    type: "Program",
                    line: 2
                }
            ]
        }
    ]
});
