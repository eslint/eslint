/**
 * @fileoverview Disallows multiple blank lines.
 * @author Greg Cochard
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

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {object} the expected error message object
 * @private
 */
function getExpectedErrorBOF(lines) {
    if (typeof lines !== "number") {
        lines = 0;
    }

    return {
        message: "Too many blank lines at the beginning of file. Max of " + lines + " allowed.",
        type: "Program"
    };
}


ruleTester.run("no-multiple-empty-lines", rule, {

    valid: [
        {
            code: "// valid 1\nvar a = 5;\nvar b = 3;\n\n",
            options: [ { max: 1 } ]
        },
        {
            code: "// valid 2\n\nvar a = 5;\n\nvar b = 3;",
            options: [ { max: 1 } ]
        },
        {
            code: "// valid 3\nvar a = 5;\n\nvar b = 3;\n\n\n",
            options: [ { max: 2 } ]
        },
        {
            code: "// valid 4\nvar a = 5,\n    b = 3;",
            options: [ { max: 2 } ]
        },
        {
            code: "// valid 5\nvar a = 5;\n\n\n\n\nvar b = 3;\n\n\n\n\n",
            options: [ { max: 4 } ]
        },
        {
            code: "// valid 6\nvar a = 5;\n/* comment */\nvar b = 5;",
            options: [ { max: 0 } ]
        },
        {
            code: "// valid 7\nvar a = 5;\n",
            options: [ { max: 0 } ]
        },
        {
            code: "// valid 8\nvar a = 5;\n",
            options: [ { max: 0, maxEOF: 0 } ]
        },
        {
            code: "// valid 9\nvar a = 1;\n\n",
            options: [{ max: 2, maxEOF: 1 }]
        },
        {
            code: "// valid 10\nvar a = 5;\n",
            options: [ { max: 0, maxBOF: 0 } ]
        },
        {
            code: "\n// valid 11\nvar a = 1;\n",
            options: [{ max: 2, maxBOF: 1 }]
        },

        // template strings
        {
            code: "// valid 12\nx = `\n\n\n\nhi\n\n\n\n`",
            options: [ { max: 2 } ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "// valid 13\n`\n\n`",
            options: [ { max: 0 } ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "// valid 14\nvar a = 5;`\n\n\n\n\n`",
            options: [ { max: 0, maxEOF: 0 } ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "`\n\n\n\n\n`\n// valid 15\nvar a = 5;",
            options: [ { max: 0, maxBOF: 0 } ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "\n\n\n\n// valid 16\nvar a = 5;\n",
            options: [ { max: 0, maxBOF: 4 } ]
        },
        {
            code: "// valid 17\nvar a = 5;\n\n",
            options: [ { max: 0, maxEOF: 1 } ]
        }
    ],

    invalid: [
        {
            code: "// invalid 1\nvar a = 5;\n\n\nvar b = 3;",
            errors: [ getExpectedError(1) ],
            options: [ { max: 1 } ]
        },
        {
            code: "// invalid 2\n\n\n\n\nvar a = 5;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 3\nvar a = 5;\n\n\n\n",
            errors: [ getExpectedErrorEOF(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 4\nvar a = 5;\n \n \n \n",
            errors: [ getExpectedErrorEOF(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 5\nvar a=5;\n\n\n\nvar b = 3;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 6\nvar a=5;\n\n\n\nvar b = 3;\n",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 7\nvar a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            errors: 2,
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 8\nvar a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            errors: [ getExpectedError(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 9\nvar a=5;\n\n\n\n\n",
            errors: [ getExpectedErrorEOF(2) ],
            options: [ { max: 2 } ]
        },
        {
            code: "// invalid 10\nvar a = 5;\n\nvar b = 3;",
            errors: [ getExpectedError(0) ],
            options: [ { max: 0 } ]
        },
        {
            code: "// invalid 11\nvar a = 5;\n\n\n",
            errors: [ getExpectedErrorEOF(1) ],
            options: [ { max: 5, maxEOF: 1 } ]
        },
        {
            code: "// invalid 12\nvar a = 5;\n\n\n\n\n\n",
            errors: [ getExpectedErrorEOF(4) ],
            options: [ { max: 0, maxEOF: 4 } ]
        },
        {
            code: "// invalid 13\n\n\n\n\n\n\n\n\nvar a = 5;\n\n\n",
            errors: [ getExpectedErrorEOF(1) ],
            options: [ { max: 10, maxEOF: 1 } ]
        },
        {
            code: "// invalid 14\nvar a = 5;\n\n",
            errors: [ getExpectedErrorEOF(0) ],
            options: [ { max: 2, maxEOF: 0 } ]
        },
        {
            code: "\n\n// invalid 15\nvar a = 5;\n",
            errors: [ getExpectedErrorBOF(1) ],
            options: [ { max: 5, maxBOF: 1 } ]
        },
        {
            code: "\n\n\n\n\n// invalid 16\nvar a = 5;\n",
            errors: [ getExpectedErrorBOF(4)],
            options: [ { max: 0, maxBOF: 4 } ]
        },
        {
            code: "\n\n// invalid 17\n\n\n\n\n\n\n\n\nvar a = 5;\n",
            errors: [ getExpectedErrorBOF(1) ],
            options: [ { max: 10, maxBOF: 1 } ]
        },
        {
            code: "\n// invalid 18\nvar a = 5;\n",
            errors: [ getExpectedErrorBOF(0) ],
            options: [ { max: 2, maxBOF: 0 } ]
        },
        {
            code: "\n\n\n// invalid 19\nvar a = 5;\n\n",
            errors: [ getExpectedErrorBOF(0),
                      getExpectedErrorEOF(0) ],
            options: [ { max: 2, maxBOF: 0, maxEOF: 0 } ]
        }
    ]
});
