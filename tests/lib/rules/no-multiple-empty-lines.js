/**
 * @fileoverview Disallows multiple blank lines.
 * @author Greg Cochard
 * @copyright 2014 Greg Cochard. All rights reserved.
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

var eslintTester = new ESLintTester(eslint),
    expectedError = {
        messsage: "Multiple blank lines not allowed.",
        type: "Program"
    },
    ruleArgs = [
        2,
        {
            max: 2
        }
    ];

eslintTester.addRuleTest("lib/rules/no-multiple-empty-lines", {

    valid: [
        {
            code: "var a = 5;\n\nvar b = 3;",
            args: ruleArgs
        },
        {
            code: "var a = 5,\n    b = 3;",
            args: ruleArgs
        },
        {
            code: "var a = 5;\n\n\n\n\nvar b = 3;",
            args: [ 2, { max: 4 } ]
        },
        {
            code: "var a = 5;\n/* comment */\nvar b = 5;",
            args: [ 2, { max: 0 } ]
        }
    ],

    invalid: [
        {
            code: "\n\n\n\nvar a = 5;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "var a = 5;\n \n \n \n",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "var a=5;\n\n\n\nvar b = 3;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "var a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            errors: 2,
            args: ruleArgs
        },
        {
            code: "var a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "var a=5;\n\n\n\n\n",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "var a = 5;\n\nvar b = 3;",
            errors: [ expectedError ],
            args: [ 2, { max: 0 } ]
        }
    ]
});
