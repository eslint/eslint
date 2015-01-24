/**
 * @fileoverview Test enforcement of space always/never beginning a line comment.
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
    alwaysError = {
        messsage: "Expected space or tab after // in comment.",
        type: "Line"
    },
    alwaysArgs = [
        2,
        "always"
    ],
    alwaysExceptionArgs = [
        2,
        "always",
        {exceptions: ["-", "=", "*", "#", "!@#"] }
    ],
    alwaysExceptionError = {
        message: "Expected exception block, space or tab after // in comment.",
        type: "Line"
    },
    neverError = {
        message: "Unexpected space or tab after // in comment.",
        type: "Line"
    },
    neverArgs = [
        2,
        "never"
    ],
    validShebangProgram = "#!/path/to/node\nvar a = 3;",
    invalidShebangProgram = "#!/path/to/node\n#!/second/shebang\nvar a = 3;";

eslintTester.addRuleTest("lib/rules/spaced-line-comment", {

    valid: [
        {
            code: "// A valid comment starting with space\nvar a = 1;",
            args: alwaysArgs
        },
        {
            code: "//   A valid comment starting with tab\nvar a = 1;",
            args: alwaysArgs
        },
        {
            code: "//A valid comment NOT starting with space\nvar a = 2;",
            args: neverArgs
        },
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            args: alwaysExceptionArgs
        },
        {
            code: "//===========\n// A comment\n//*************",
            args: alwaysExceptionArgs
        },
        {
            code: "//######\n// A comment",
            args: alwaysExceptionArgs
        },
        {
            code: "//!@#!@#!@#\n// A comment\n//!@#",
            args: alwaysExceptionArgs
        },
        {
            code: validShebangProgram,
            args: alwaysArgs
        },
        {
            code: validShebangProgram,
            args: neverArgs
        },
        {
            code: "//",
            args: alwaysArgs
        }
    ],

    invalid: [
        {
            code: "//An invalid comment NOT starting with space\nvar a = 1;",
            errors: [ alwaysError ],
            args: alwaysArgs
        },
        {
            code: "// An invalid comment starting with space\nvar a = 2;",
            errors: [ neverError ],
            args: neverArgs
        },
        {
            code: "//   An invalid comment starting with tab\nvar a = 2;",
            errors: [ neverError ],
            args: neverArgs
        },
        {
            code: "//*********************-\n// Comment Block 3\n//***********************",
            errors: [ alwaysExceptionError ],
            args: alwaysExceptionArgs
        },
        {
            code: "//-=-=-=-=-=-=\n// A comment\n//-=-=-=-=-=-=",
            errors: [ alwaysExceptionError, alwaysExceptionError ],
            args: alwaysExceptionArgs
        },
        {
            code: invalidShebangProgram,
            errors: 1,
            args: alwaysArgs
        },
        {
            code: invalidShebangProgram,
            errors: 1,
            args: neverArgs
        }
    ]

});
