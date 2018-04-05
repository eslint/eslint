/**
 * @fileoverview Tests for max-lines-per-function rule.
 * @author Pete Ward <peteward44@gmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/max-lines-per-function");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = { ecmaVersion: 6 };

const ruleTester = new RuleTester();

ruleTester.run("max-lines-per-function", rule, {
    valid: [
        {
            code: "var x = 5;\nvar x = 2;\n",
            options: [1]
        },
        {
            code: "function name() {}",
            options: [1]
        },
        {
            code: "function name() {\nvar x = 5;\nvar x = 2;\n}",
            options: [4]
        },
        {
            code: "const bar = () => 2",
            options: [1],
            parserOptions
        },
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [4],
            parserOptions
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 7, ignoreComments: false, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\nvar x = 2; // end of line comment\n}",
            options: [{ max: 4, ignoreComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, ignoreComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\n// and another line comment\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, ignoreComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n/* a \n multi \n line \n comment \n*/\n\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, ignoreComments: true, skipBlankLines: false }]
        }
    ],

    invalid: [
        {
            code: "function name() {\n}",
            options: [1],
            errors: [
                "function 'name' has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "var func = function() {\n}",
            options: [1],
            errors: [
                "function has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "const bar = () =>\n 2",
            options: [1],
            parserOptions,
            errors: [
                "arrow function has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [3],
            parserOptions,
            errors: [
                "arrow function has too many lines (4). Maximum allowed is 3."
            ]
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, ignoreComments: false, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, ignoreComments: true, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, ignoreComments: true, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, ignoreComments: true, skipBlankLines: true }],
            errors: [
                "function 'name' has too many lines (4). Maximum allowed is 1."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, ignoreComments: false, skipBlankLines: true }],
            errors: [
                "function 'name' has too many lines (5). Maximum allowed is 1."
            ]
        }
    ]
});
