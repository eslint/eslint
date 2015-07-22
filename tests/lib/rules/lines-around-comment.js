/**
 * @fileoverview Test enforcement of lines around comments.
 * @author Jamund Ferguson
 * @copyright 2015 Mathieu M-Gosselin. All rights reserved.
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

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
        },

        // check for block start comments
        {
            code: "var a,\n\n// line\nb;",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "var foo = function(){\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "var foo = function(){\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "while(true){\n\n/* \nblock comment at block start\n */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "class A {\n/**\n* hi\n */\nconstructor() {}\n}",
            options: [{ allowBlockStart: true }],
            ecmaFeatures: {classes: true}
        },
        {
            code: "class A {\nconstructor() {\n/**\n* hi\n */\n}\n}",
            options: [{ allowBlockStart: true }],
            ecmaFeatures: {classes: true}
        },

        // check for block end comments
        {
            code: "var a,\n// line\n\nb;",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 91;\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 61;\n\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "var foo = function(){\nvar g = 1;\n\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                beforeLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 1;\n/* block comment at block end */}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "var foo = function(){\nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n\n/* block comment at block end */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n\nvar g = 1;\n\n/* \nblock comment at block end\n */}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "class B {\nconstructor() {}\n\n/**\n* hi\n */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }],
            ecmaFeatures: {classes: true}
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
            errors: [{ message: afterMessage, type: "Line", line: 1, column: 1 }]
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
        },
        {
            code: "var a,\n// line\nb;",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ message: beforeMessage, type: "Line", line: 2 }]
        },
        {
            code: "function foo(){\nvar a = 1;\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ message: beforeMessage, type: "Line", line: 3 }]
        },
        {
            code: "var a,\n// line\nb;",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ message: afterMessage, type: "Line", line: 2 }]
        },
        {
            code: "function foo(){\nvar a = 1;\n\n// line at block start\nvar g = 1;\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ message: afterMessage, type: "Line", line: 4 }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ message: afterMessage, type: "Line", line: 2 }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ message: beforeMessage, type: "Line", line: 2 }]
        }
    ]

});
