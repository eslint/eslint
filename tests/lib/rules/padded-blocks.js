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
    expectedPaddingError = { message: "Block must be padded by blank lines." },
    expectedNoPaddingError = { message: "Block must not be padded by blank lines."};

eslintTester.addRuleTest("lib/rules/padded-blocks", {
    valid: [
        { code: "{\n\na();\n\n}" },
        { code: "{\n\na();\n\n}" },
        { code: "{\n\n\na();\n\n\n}" },
        { code: "{\n\n//comment\na();\n\n}" },
        { code: "{\n\na();\n//comment\n\n}" },
        { code: "{\na();\n}", args: [1, "never"]},
        { code: "{\na();}", args: [1, "never"]},
        { code: "{a();\n}", args: [1, "never"]},
        { code: "{a();}", args: [1, "never"]},
        { code: "{//comment\na();}", args: [1, "never"]},
        { code: "{a();//comment\n}", args: [1, "never"]}
    ],
    invalid: [
        { code: "{\n//comment\na();\n\n}", errors: [expectedPaddingError] },
        { code: "{\n\na();\n//comment\n}", errors: [expectedPaddingError] },
        { code: "{\na();\n\n}", errors: [expectedPaddingError] },
        { code: "{\n\na();\n}", errors: [expectedPaddingError] },
        { code: "{\na();\n}", errors: [expectedPaddingError] },
        { code: "{\na();}", errors: [expectedPaddingError] },
        { code: "{a();\n}", errors: [expectedPaddingError] },
        { code: "{a();}", errors: [expectedPaddingError] },
        { code: "{\n\na();\n\n}", args: [1, "never"], errors: [expectedNoPaddingError] },
        { code: "{\n\n\na();\n\n\n}", args: [1, "never"], errors: [expectedNoPaddingError] },
        { code: "{\n\na();\n}", args: [1, "never"], errors: [expectedNoPaddingError] },
        { code: "{\na();\n\n}", args: [1, "never"], errors: [expectedNoPaddingError] }
    ]
});
