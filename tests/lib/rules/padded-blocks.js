/**
 * @fileoverview Tests for padded-blocks rule.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2014 Mathias Schreck. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/padded-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    ALWAYS_MESSAGE = "Block must be padded by blank lines.",
    NEVER_MESSAGE = "Block must not be padded by blank lines.";

ruleTester.run("padded-blocks", rule, {
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
            output: "{\n\n//comment\na();\n\n}",
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
            output: "{\n\na();\n//comment\n\n}",
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
            output: "{\n\na()\n//comment\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 2
                }
            ]
        },
        {
            code: "{\na();\n\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 1
                }
            ]
        },
        {
            code: "{\n\na();\n}",
            output: "{\n\na();\n\n}",
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 4
                }
            ]
        },
        {
            code: "{\na();\n}",
            output: "{\n\na();\n\n}",
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
            output: "{\n\na();\n\n}",
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
            output: "{\n\na();\n\n}",
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
            output: "{\n\na();\n\n}",
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
            output: "{\na()\n//comment\n}",
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
            output: "{\na();\n}",
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
            output: "{\na();\n}",
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
            output: "{\na();\n}",
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
            output: "{\na();\n}",
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
            output: "{\n\n// comment\nif (\n// comment\n a) {}\n\n}",
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
            output: "{\n// comment\nif (\n// comment\n a) {}\n}",
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
