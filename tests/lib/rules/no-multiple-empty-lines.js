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
    ESLintTester = require("../../../lib/testers/eslint-tester");

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
            code: "// valid 1\nvar a = 5;\n\nvar b = 3;",
            args: ruleArgs
        },
        {
            code: "// valid 2\nvar a = 5,\n    b = 3;",
            args: ruleArgs
        },
        {
            code: "// valid 3\nvar a = 5;\n\n\n\n\nvar b = 3;",
            args: [ 2, { max: 4 } ]
        },
        {
            code: "// valid 4\nvar a = 5;\n/* comment */\nvar b = 5;",
            args: [ 2, { max: 0 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n",
            args: [2, { max: 0 } ]
        },

        // template strings
        {
            code: "x = `\n\n\n\nhi\n\n\n\n`",
            args: ruleArgs,
            ecmaFeatures: { templateStrings: true }
        },
        {
            code: "`\n\n`",
            options: [{ max: 0 }],
            ecmaFeatures: { templateStrings: true }
        }

    ],

    invalid: [
        {
            code: "// invalid 1\n\n\n\n\nvar a = 5;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "// invalid 2\nvar a = 5;\n \n \n \n",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "// invalid 3\nvar a=5;\n\n\n\nvar b = 3;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "// invalid 4\nvar a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            errors: 2,
            args: ruleArgs
        },
        {
            code: "// invalid 5\nvar a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "// invalid 6\nvar a=5;\n\n\n\n\n",
            errors: [ expectedError ],
            args: ruleArgs
        },
        {
            code: "// invalid 7\nvar a = 5;\n\nvar b = 3;",
            errors: [ expectedError ],
            args: [ 2, { max: 0 } ]
        }
    ]
});
