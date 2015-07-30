/**
 * @fileoverview Disallows multiple blank lines.
 * @author Greg Cochard
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-multiple-empty-lines"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    expectedError = {
        messsage: "Multiple blank lines not allowed.",
        type: "Program"
    },
    ruleArgs = [
        {
            max: 2
        }
    ];

ruleTester.run("no-multiple-empty-lines", rule, {

    valid: [
        {
            code: "// valid 1\nvar a = 5;\n\nvar b = 3;",
            options: ruleArgs
        },
        {
            code: "// valid 2\nvar a = 5,\n    b = 3;",
            options: ruleArgs
        },
        {
            code: "// valid 3\nvar a = 5;\n\n\n\n\nvar b = 3;",
            options: [ { max: 4 } ]
        },
        {
            code: "// valid 4\nvar a = 5;\n/* comment */\nvar b = 5;",
            options: [ { max: 0 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n",
            options: [{ max: 0 } ]
        },

        // template strings
        {
            code: "x = `\n\n\n\nhi\n\n\n\n`",
            options: ruleArgs,
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
            options: ruleArgs
        },
        {
            code: "// invalid 2\nvar a = 5;\n \n \n \n",
            errors: [ expectedError ],
            options: ruleArgs
        },
        {
            code: "// invalid 3\nvar a=5;\n\n\n\nvar b = 3;",
            errors: [ expectedError ],
            options: ruleArgs
        },
        {
            code: "// invalid 4\nvar a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            errors: 2,
            options: ruleArgs
        },
        {
            code: "// invalid 5\nvar a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            errors: [ expectedError ],
            options: ruleArgs
        },
        {
            code: "// invalid 6\nvar a=5;\n\n\n\n\n",
            errors: [ expectedError ],
            options: ruleArgs
        },
        {
            code: "// invalid 7\nvar a = 5;\n\nvar b = 3;",
            errors: [ expectedError ],
            options: [ { max: 0 } ]
        }
    ]
});
