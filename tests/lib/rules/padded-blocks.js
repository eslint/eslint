/**
 * @fileoverview Tests for padded-blocks rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2014 Mathias Schreck. All rights reserved.
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
    ALWAYS_MESSAGE = "Block must be padded by blank lines.",
    NEVER_MESSAGE = "Block must not be padded by blank lines.";

eslintTester.addRuleTest("lib/rules/padded-blocks", {
    valid: [
        {code: "{\n\na();\n\n}" },
        {code: "{\n\na();\n\n}" },
        {code: "{\n\n\na();\n\n\n}" },
        {code: "{\n\n//comment\na();\n\n}" },
        {code: "{\n\na();\n//comment\n\n}" },
        {code: "{\n\na()\n//comment\n\n}" },
        {code: "{\n\na = 1\n\n}" },
        {code: "{\na();\n}", options: ["never"]},
        {code: "{\na();}", options: ["never"]},
        {code: "{a();\n}", options: ["never"]},
        {code: "{a();}", options: ["never"]},
        {code: "{//comment\na();}", options: ["never"]},
        {code: "{\n//comment\na()\n}", options: ["never"]},
        {code: "{a();//comment\n}", options: ["never"]},
        {code: "{\na();\n//comment\n}", options: ["never"]},
        {code: "{\na()\n//comment\n}", options: ["never"]},
        {code: "{\na()\n//comment\nb()\n}", options: ["never"]},
        {code: "function a() {\n/* comment */\nreturn;\n/* comment*/\n}", options: ["never"] },
        {code: "{\n// comment\ndebugger;\n// comment\n}", options: ["never"] },
        {code: "{\n\n// comment\nif (\n// comment\n a) {}\n\n }", options: ["always"] },
        {code: "{\n// comment\nif (\n// comment\n a) {}\n }", options: ["never"] }
    ],
    invalid: [
        {
            code: "{\n//comment\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\na();\n//comment\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 2
                }
            ]
        },
        {
            code: "{\n\na()\n//comment\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 0
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\na();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 3
                }
            ]
        },
        {
            code: "{\na();}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 2
                }
            ]
        },
        {
            code: "{a();}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\na()\n//comment\n\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 5
                }
            ]
        },
        {
            code: "{\n\na();\n\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 5
                }
            ]
        },
        {
            code: "{\n\n\na();\n\n\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 7
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\n// comment\nif (\n// comment\n a) {}\n\n}",
            options: ["always"],
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "{\n\n// comment\nif (\n// comment\n a) {}\n}",
            options: ["never"],
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 1,
                    column: 1
                }
            ]
        }
    ]
});
