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

var ruleTester = new RuleTester();

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {object} the expected error message object
 * @private
 */
function getExpectedError(lines) {
    var message = lines === 1
        ? "More than 1 blank line not allowed."
        : "More than " + lines + " blank lines not allowed.";

    return {
        message: message,
        type: "Program"
    };
}

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {object} the expected error message object
 * @private
 */
function getExpectedErrorEOF(lines) {
    if (typeof lines !== "number") {
        lines = 0;
    }

    return {
        message: "Too many blank lines at the end of file. Max of " + lines + " allowed.",
        type: "Program"
    };
}

ruleTester.run("no-multiple-empty-lines", rule, {

    valid: [
        {
            code: "// valid 1\nvar a = 5;\nvar b = 3;",
            options: [ { max: 1 } ]
        },
        {
            code: "// valid 1\n\nvar a = 5;\n\nvar b = 3;",
            options: [ { max: 1 } ]
        },
        {
            code: "// valid 1\nvar a = 5;\n\nvar b = 3;",
            options: [ { max: 2 } ]
        },
        {
            code: "// valid 2\nvar a = 5,\n    b = 3;",
            options: [ { max: 2 } ]
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
            options: [ { max: 0 } ]
        },

        // template strings
        {
            code: "x = `\n\n\n\nhi\n\n\n\n`",
            options: [ { max: 2 } ],
            ecmaFeatures: { templateStrings: true }
        },
        {
            code: "`\n\n`",
            options: [ { max: 0 } ],
            ecmaFeatures: { templateStrings: true }
        },

        {
            code: "// valid 5\nvar a = 5;\n\n\n\n",
            options: [ { max: 0, maxEOF: 4 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n\n\n\n",
            options: [ { max: 3 } ]
        }
    ],

    invalid: [
        {
            code: "// invalid 1\nvar a = 5;\n\n\nvar b = 3;",
            errors: [ getExpectedError(1) ],
            options: [ { max: 1 } ]
        },
        {
            code: "// invalid 1\n\n\n\n\nvar a = 5;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 2\nvar a = 5;\n\n\n\n",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 2\nvar a = 5;\n \n \n \n",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 3\nvar a=5;\n\n\n\nvar b = 3;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 3\nvar a=5;\n\n\n\nvar b = 3;\n",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 4\nvar a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            errors: 2,
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 5\nvar a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 6\nvar a=5;\n\n\n\n\n",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 7\nvar a = 5;\n\nvar b = 3;",
            errors: [ getExpectedError(0) ],
            options: [ { max: 0 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n\n",
            errors: [ getExpectedErrorEOF(1) ],
            options: [ { max: 5, maxEOF: 1 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n\n\n\n\n",
            errors: [ getExpectedErrorEOF(4) ],
            options: [ { max: 0, maxEOF: 4 } ]
        },
        {
            code: "// valid 5\n\n\n\n\n\n\n\n\nvar a = 5;\n\n",
            errors: [ getExpectedErrorEOF(1) ],
            options: [ { max: 10, maxEOF: 1 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n",
            errors: [ getExpectedErrorEOF(0) ],
            options: [ { max: 2, maxEOF: 0 } ]
        }
    ]
});
