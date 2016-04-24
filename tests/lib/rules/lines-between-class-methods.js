/**
 * @fileoverview Tests for lines-between-class-methods rule.
 * @author Linus Unnebäck <https://github.com/LinusU>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/lines-between-class-methods"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    ALWAYS_MESSAGE = "Class methods must be separated by at least one blank line.",
    NEVER_MESSAGE = "Class methods must not be separated by blank lines.";

ruleTester.run("lines-between-class-methods", rule, {
    valid: [
        {
            code: "class T {\na() {}\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\nb() {}\nc() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\nb() {}\n\nc() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\nb() {}\nc() {}\nd() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\nb() {}\n\nc() {}\n\nd() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\n// b\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\n/*\n\n\n*/\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/*\n\n\n*/\n\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/*\n\n\n*/\n\n/*\n\n\n*/\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\n/**/ b() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n// b\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/*\n\n\n*/\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/*\n\n\n*/\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/*\n\n\n*/\n/*\n\n\n*/\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n/**/ b() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class T {\na() {}\n\n\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "class T {\na() {}\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\nb() {}\nc() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\nb() {}\nc() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\nb() {}\nc() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 3,
                    column: 1
                },
                {
                    message: ALWAYS_MESSAGE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\nb() {}\n\nc() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 3,
                    column: 1
                },
                {
                    message: NEVER_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\n\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n// 1\n// 2\nb() {}\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: ALWAYS_MESSAGE,
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n// 1\n\n// 3\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            code: "class T {\na() {}\n\n// 2\n// 3\nb() {}\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: NEVER_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        }
    ]
});
