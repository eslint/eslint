/**
 * @fileoverview enforce position of line comments
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/line-comment-position"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("line-comment-position", rule, {

    valid: [
        "// valid comment\n1 + 1;",
        "/* block comments are skipped */\n1 + 1;",
        "1 + 1; /* block comments are skipped */",
        "1 + 1; /* eslint eqeqeq: 'error' */",
        "1 + 1; /* eslint-disable */",
        "1 + 1; /* eslint-enable */",
        "1 + 1; // eslint-disable-line",
        "// eslint-disable-next-line\n1 + 1;",
        "1 + 1; // global MY_GLOBAL, ANOTHER",
        "1 + 1; // globals MY_GLOBAL: true",
        "1 + 1; // exported MY_GLOBAL, ANOTHER",
        "1 + 1; // fallthrough",
        "1 + 1; // fall through",
        "1 + 1; // falls through",
        "1 + 1; // jslint vars: true",
        "1 + 1; // jshint ignore:line",
        "1 + 1; // istanbul ignore next",
        {
            code: "1 + 1; // linter excepted comment",
            options: [{ position: "above", ignorePattern: "linter" }]
        },
        {
            code: "// Meep\nconsole.log('Meep');",
            options: ["above"]
        },
        {
            code: "1 + 1; // valid comment",
            options: ["beside"]
        },
        {
            code: "// jscs: disable\n1 + 1;",
            options: ["beside"]
        },
        {
            code: "// jscs: enable\n1 + 1;",
            options: ["beside"]
        },
        {
            code: "/* block comments are skipped */\n1 + 1;",
            options: ["beside"]
        },
        {
            code: "/*block comment*/\n/*block comment*/\n1 + 1;",
            options: ["beside"]
        },
        {
            code: "1 + 1; /* block comment are skipped */",
            options: ["beside"]
        },
        {
            code: "1 + 1; // jshint strict: true",
            options: ["beside"]
        },
        {
            code: "// pragma valid comment\n1 + 1;",
            options: [{ position: "beside", ignorePattern: "pragma|linter" }]
        },
        {
            code: "// above\n1 + 1; // ignored",
            options: [{ ignorePattern: "ignored" }]
        },
        {
            code: "foo; // eslint-disable-line no-alert",
            options: [{ position: "above" }]
        }
    ],

    invalid: [
        {
            code: "1 + 1; // invalid comment",
            errors: [{
                messageId: "above",
                type: "Line",
                line: 1,
                column: 8
            }]
        },
        {
            code: "1 + 1; // globalization is a word",
            errors: [{
                messageId: "above",
                type: "Line",
                line: 1,
                column: 8
            }]
        },
        {
            code: "// jscs: disable\n1 + 1;",
            options: [{ position: "beside", applyDefaultIgnorePatterns: false }],
            errors: [{
                messageId: "beside",
                type: "Line",
                line: 1,
                column: 1
            }]
        },
        { // deprecated option still works
            code: "// jscs: disable\n1 + 1;",
            options: [{ position: "beside", applyDefaultPatterns: false }],
            errors: [{
                messageId: "beside",
                type: "Line",
                line: 1,
                column: 1
            }]
        },
        { // new option name takes precedence
            code: "// jscs: disable\n1 + 1;",
            options: [{ position: "beside", applyDefaultIgnorePatterns: false, applyDefaultPatterns: true }],
            errors: [{
                messageId: "beside",
                type: "Line",
                line: 1,
                column: 1
            }]
        },
        {
            code: "1 + 1; // mentioning falls through",
            errors: [{
                messageId: "above",
                type: "Line",
                line: 1,
                column: 8
            }]
        },
        {
            code: "// invalid comment\n1 + 1;",
            options: ["beside"],
            errors: [{
                messageId: "beside",
                type: "Line",
                line: 1,
                column: 1
            }]
        },
        {
            code: "// pragma\n// invalid\n1 + 1;",
            options: [{ position: "beside", ignorePattern: "pragma" }],
            errors: [{
                messageId: "beside",
                type: "Line",
                line: 2,
                column: 1
            }]
        },
        {
            code: "1 + 1; // linter\n2 + 2; // invalid comment",
            options: [{ position: "above", ignorePattern: "linter" }],
            errors: [{
                messageId: "above",
                type: "Line",
                line: 2,
                column: 8
            }]
        }
    ]
});
