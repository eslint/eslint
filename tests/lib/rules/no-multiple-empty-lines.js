/**
 * @fileoverview Disallows multiple blank lines.
 * @author Greg Cochard
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multiple-empty-lines"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedError(lines) {
    const message = lines === 1
        ? "More than 1 blank line not allowed."
        : `More than ${lines} blank lines not allowed.`;

    return {
        message,
        type: "Program",
        column: 1
    };
}

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedErrorEOF(lines) {
    return {
        message: `Too many blank lines at the end of file. Max of ${lines} allowed.`,
        type: "Program",
        column: 1
    };
}

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines - The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedErrorBOF(lines) {
    return {
        message: `Too many blank lines at the beginning of file. Max of ${lines} allowed.`,
        type: "Program",
        column: 1
    };
}


ruleTester.run("no-multiple-empty-lines", rule, {

    valid: [
        {
            code: "// valid 1\nvar a = 5;\nvar b = 3;\n\n",
            options: [{ max: 1 }]
        },
        {
            code: "// valid 2\n\nvar a = 5;\n\nvar b = 3;",
            options: [{ max: 1 }]
        },
        {
            code: "// valid 3\nvar a = 5;\n\nvar b = 3;\n\n\n",
            options: [{ max: 2 }]
        },
        {
            code: "// valid 4\nvar a = 5,\n    b = 3;",
            options: [{ max: 2 }]
        },
        {
            code: "// valid 5\nvar a = 5;\n\n\n\n\nvar b = 3;\n\n\n\n\n",
            options: [{ max: 4 }]
        },
        {
            code: "// valid 6\nvar a = 5;\n/* comment */\nvar b = 5;",
            options: [{ max: 0 }]
        },
        {
            code: "// valid 7\nvar a = 5;\n",
            options: [{ max: 0 }]
        },
        {
            code: "// valid 8\nvar a = 5;\n",
            options: [{ max: 0, maxEOF: 0 }]
        },
        {
            code: "// valid 9\nvar a = 1;\n\n",
            options: [{ max: 2, maxEOF: 1 }]
        },
        {
            code: "// valid 10\nvar a = 5;\n",
            options: [{ max: 0, maxBOF: 0 }]
        },
        {
            code: "\n// valid 11\nvar a = 1;\n",
            options: [{ max: 2, maxBOF: 1 }]
        },
        {
            code: "// valid 12\r\n// windows line endings\r\nvar a = 5;\r\nvar b = 3;\r\n\r\n",
            options: [{ max: 1 }]
        },

        // template strings
        {
            code: "// valid 12\nx = `\n\n\n\nhi\n\n\n\n`",
            options: [{ max: 2 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "// valid 13\n`\n\n`",
            options: [{ max: 0 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "// valid 14\nvar a = 5;`\n\n\n\n\n`",
            options: [{ max: 0, maxEOF: 0 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "`\n\n\n\n\n`\n// valid 15\nvar a = 5;",
            options: [{ max: 0, maxBOF: 0 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "\n\n\n\n// valid 16\nvar a = 5;\n",
            options: [{ max: 0, maxBOF: 4 }]
        },
        {
            code: "// valid 17\nvar a = 5;\n\n",
            options: [{ max: 0, maxEOF: 1 }]
        },
        {
            code: "var a = 5;",
            options: [{ max: 1 }]
        }
    ],

    invalid: [
        {
            code: "// invalid 1\nvar a = 5;\n\n\nvar b = 3;",
            output: "// invalid 1\nvar a = 5;\n\nvar b = 3;",
            options: [{ max: 1 }],
            errors: [getExpectedError(1)]
        },
        {
            code: "// invalid 2\n\n\n\n\nvar a = 5;",
            output: "// invalid 2\n\n\nvar a = 5;",
            options: [{ max: 2 }],
            errors: [getExpectedError(2)]
        },
        {
            code: "// invalid 3\nvar a = 5;\n\n\n\n",
            output: "// invalid 3\nvar a = 5;\n\n\n",
            options: [{ max: 2 }],
            errors: [getExpectedErrorEOF(2)]
        },
        {
            code: "// invalid 4\nvar a = 5;\n \n \n \n",
            output: "// invalid 4\nvar a = 5;\n \n \n",
            options: [{ max: 2 }],
            errors: [getExpectedErrorEOF(2)]
        },
        {
            code: "// invalid 5\nvar a=5;\n\n\n\nvar b = 3;",
            output: "// invalid 5\nvar a=5;\n\n\nvar b = 3;",
            options: [{ max: 2 }],
            errors: [getExpectedError(2)]
        },
        {
            code: "// invalid 6\nvar a=5;\n\n\n\nvar b = 3;\n",
            output: "// invalid 6\nvar a=5;\n\n\nvar b = 3;\n",
            options: [{ max: 2 }],
            errors: [getExpectedError(2)]
        },
        {
            code: "// invalid 7\nvar a = 5;\n\n\n\nb = 3;\nvar c = 5;\n\n\n\nvar d = 3;",
            output: "// invalid 7\nvar a = 5;\n\n\nb = 3;\nvar c = 5;\n\n\nvar d = 3;",
            options: [{ max: 2 }],
            errors: 2
        },
        {
            code: "// invalid 8\nvar a = 5;\n\n\n\n\n\n\n\n\n\n\n\n\n\nb = 3;",
            output: "// invalid 8\nvar a = 5;\n\n\nb = 3;",
            options: [{ max: 2 }],
            errors: [getExpectedError(2)]
        },
        {
            code: "// invalid 9\nvar a=5;\n\n\n\n\n",
            output: "// invalid 9\nvar a=5;\n\n\n",
            options: [{ max: 2 }],
            errors: [getExpectedErrorEOF(2)]
        },
        {
            code: "// invalid 10\nvar a = 5;\n\nvar b = 3;",
            output: "// invalid 10\nvar a = 5;\nvar b = 3;",
            options: [{ max: 0 }],
            errors: [getExpectedError(0)]
        },
        {
            code: "// invalid 11\nvar a = 5;\n\n\n",
            output: "// invalid 11\nvar a = 5;\n\n",
            options: [{ max: 5, maxEOF: 1 }],
            errors: [getExpectedErrorEOF(1)]
        },
        {
            code: "// invalid 12\nvar a = 5;\n\n\n\n\n\n",
            output: "// invalid 12\nvar a = 5;\n\n\n\n\n",
            options: [{ max: 0, maxEOF: 4 }],
            errors: [getExpectedErrorEOF(4)]
        },
        {
            code: "// invalid 13\n\n\n\n\n\n\n\n\nvar a = 5;\n\n\n",
            output: "// invalid 13\n\n\n\n\n\n\n\n\nvar a = 5;\n\n",
            options: [{ max: 10, maxEOF: 1 }],
            errors: [getExpectedErrorEOF(1)]
        },
        {
            code: "// invalid 14\nvar a = 5;\n\n",
            output: "// invalid 14\nvar a = 5;\n",
            options: [{ max: 2, maxEOF: 0 }],
            errors: [getExpectedErrorEOF(0)]
        },
        {
            code: "\n\n// invalid 15\nvar a = 5;\n",
            output: "\n// invalid 15\nvar a = 5;\n",
            options: [{ max: 5, maxBOF: 1 }],
            errors: [getExpectedErrorBOF(1)]
        },
        {
            code: "\n\n\n\n\n// invalid 16\nvar a = 5;\n",
            output: "\n\n\n\n// invalid 16\nvar a = 5;\n",
            options: [{ max: 0, maxBOF: 4 }],
            errors: [getExpectedErrorBOF(4)]
        },
        {
            code: "\n\n// invalid 17\n\n\n\n\n\n\n\n\nvar a = 5;\n",
            output: "\n// invalid 17\n\n\n\n\n\n\n\n\nvar a = 5;\n",
            options: [{ max: 10, maxBOF: 1 }],
            errors: [getExpectedErrorBOF(1)]
        },
        {
            code: "\n// invalid 18\nvar a = 5;\n",
            output: "// invalid 18\nvar a = 5;\n",
            options: [{ max: 2, maxBOF: 0 }],
            errors: [getExpectedErrorBOF(0)]
        },
        {
            code: "\n\n\n// invalid 19\nvar a = 5;\n\n",
            output: "// invalid 19\nvar a = 5;\n",
            options: [{ max: 2, maxBOF: 0, maxEOF: 0 }],
            errors: [getExpectedErrorBOF(0),
                getExpectedErrorEOF(0)]
        },
        {
            code: "// invalid 20\r\n// windows line endings\r\nvar a = 5;\r\nvar b = 3;\r\n\r\n\r\n",
            output: "// invalid 20\r\n// windows line endings\r\nvar a = 5;\r\nvar b = 3;\r\n\r\n",
            options: [{ max: 1 }],
            errors: [getExpectedErrorEOF(1)]
        },
        {
            code: "// invalid 21\n// unix line endings\nvar a = 5;\nvar b = 3;\n\n\n",
            output: "// invalid 21\n// unix line endings\nvar a = 5;\nvar b = 3;\n\n",
            options: [{ max: 1 }],
            errors: [getExpectedErrorEOF(1)]
        },
        {
            code:
            "'foo';\n" +
            "\n" +
            "\n" +
            "`bar`;\n" +
            "`baz`;",
            output:
            "'foo';\n" +
            "\n" +
            "`bar`;\n" +
            "`baz`;",
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6 },
            errors: [getExpectedError(1)]
        },
        {
            code: "`template ${foo\n\n\n} literal`;",
            output: "`template ${foo\n\n} literal`;",
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6 },
            errors: [getExpectedError(1)]
        },
        {

            // https://github.com/eslint/eslint/issues/7893
            code: `a\n\n\n\n${"a".repeat(1e5)}`,
            output: `a\n\n\n${"a".repeat(1e5)}`,
            errors: [getExpectedError(2)]
        },
        {

            // https://github.com/eslint/eslint/issues/8401
            code: "foo\n ",
            output: "foo\n",
            options: [{ max: 1, maxEOF: 0 }],
            errors: [getExpectedErrorEOF(0)]
        }
    ]
});
