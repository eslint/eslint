/**
 * @fileoverview Test enforcement of lines around comments.
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var afterMessage = "Expected line after comment.",
    beforeMessage = "Expected line before comment.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/lines-around-comment", {

    valid: [

        // default rules
        { code: "bar()\n\n/** block block block\n * block \n */\n\nvar a = 1;" },
        { code: "bar()\n\n/** block block block\n * block \n */\nvar a = 1;" },
        { code: "bar()\n// line line line \nvar a = 1;" },
        { code: "bar()\n\n// line line line\nvar a = 1;" },
        { code: "bar()\n// line line line\n\nvar a = 1;" },

        // line comments
        {
            code: "bar()\n// line line line\n\nvar a = 1;",
            options: [{ afterLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\nvar a = 1;",
            options: [{ beforeLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\n// line line\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },
        {
            code: "// line line line\n// line line",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },

        // block comments
        {
            code: "bar()\n\n/** A Block comment with a an empty line after\n *\n */\nvar a = 1;",
            options: [{ afterBlockComment: false, beforeBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\nvar a = 1;",
            options: [{ afterBlockComment: false }]
        },
        {
            code: "/** \nblock \nblock block\n */\n/* block \n block \n */",
            options: [{ afterBlockComment: true, beforeBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }]
        },

        // inline comments (should not ever warn)
        {
            code: "foo() // An inline comment with a an empty line after\nvar a = 1;",
            options: [{ afterLineComment: true, beforeLineComment: true }]
        },
        {
            code: "foo();\nbar() /* An inline block comment with a an empty line after\n *\n */\nvar a = 1;",
            options: [{ beforeBlockComment: true }]
        },

        // mixed comment (some block & some line)
        {
            code: "bar()\n\n/** block block block\n * block \n */\n//line line line\nvar a = 1;",
            options: [{ afterBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\n//line line line\nvar a = 1;",
            options: [{ beforeLineComment: true }]
        }

    ],

    invalid: [

        // default rules
        {
            code: "bar()\n/** block block block\n * block \n */\nvar a = 1;",
            errors: [{ message: beforeMessage, type: "Block" }]
        },

        // line comments
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            options: [{ afterLineComment: true }],
            errors: [{ message: afterMessage, type: "Line" }]
        },
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: false }],
            errors: [{ message: beforeMessage, type: "Line" }]
        },
        {
            code: "// A line comment with no empty line after\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }],
            errors: [{ message: afterMessage, type: "Line", line: 1, column: 0 }]
        },
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }],
            errors: [{ message: beforeMessage, type: "Line", line: 2 }, { message: afterMessage, type: "Line", line: 2 }]
        },

        // block comments
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }],
            errors: [{ message: beforeMessage, type: "Block", line: 2 }, { message: afterMessage, type: "Block", line: 2 }]
        },
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: false }],
            errors: [{ message: afterMessage, type: "Block", line: 2 }]
        },
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            options: [{ afterBlockComment: false, beforeBlockComment: true }],
            errors: [{ message: beforeMessage, type: "Block", line: 2 }]
        }
    ]

});
