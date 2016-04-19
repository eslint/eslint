/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 * @copyright 2016 Onur Temizkan. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-useless-escape"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();

ruleTester.run("no-useless-escape", rule, {
    valid: [
        "var foo = /\\./",
        "var foo = /\\//g",
        "var foo = /\"\"/",
        "var foo = /''/",
        "var foo = /([A-Z])\\t+/g",
        "var foo = /([A-Z])\\n+/g",
        "var foo = /([A-Z])\\v+/g",
        "var foo = /\\D/",
        "var foo = /\\W/",
        "var foo = /\\w/",
        "var foo = /\\B/",
        "var foo = /\\\\/g",
        "var foo = /\\w\\$\\*\\./",
        "var foo = /\\^\\+\\./",
        "var foo = /\\|\\}\\{\\./",
        "var foo = /\\]\\[\\(\\)\\//",
        "var foo = \"\\x123\"",
        "var foo = \"\\u00a9\"",
        "var foo = \"\\377\"",
        "var foo = \"\\\"\"",
        "var foo = \"xs\\u2111\"",
        "var foo = \"foo \\\\ bar\";",
        "var foo = \"\\t\";",
        "var foo = \"foo \\b bar\";",
        "var foo = '\\n';",
        "var foo = 'foo \\r bar';",
        "var foo = '\\v';",
        "var foo = '\\f';",
        "var foo = '\\\n';",
        "var foo = '\\\r\n';",
        {code: "<foo attr=\"\\d\"/>", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<foo attr='\\d'></foo>", parserOptions: {ecmaFeatures: {jsx: true}}}
    ],

    invalid: [
        { code: "var foo = /\\#/;", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#", type: "Literal"}] },
        { code: "var foo = /\\;/;", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\;", type: "Literal"}] },
        { code: "var foo = \"\\'\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\'", type: "Literal"}] },
        { code: "var foo = \"\\#/\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#", type: "Literal"}] },
        { code: "var foo = \"\\a\"", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\a", type: "Literal"}] },
        { code: "var foo = \"\\B\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\B", type: "Literal"}] },
        { code: "var foo = \"\\@\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\@", type: "Literal"}] },
        { code: "var foo = \"foo \\a bar\";", errors: [{ line: 1, column: 16, message: "Unnecessary escape character: \\a", type: "Literal"}] },
        { code: "var foo = '\\\"';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\\"", type: "Literal"}] },
        { code: "var foo = '\\#';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#", type: "Literal"}] },
        { code: "var foo = '\\$';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\$", type: "Literal"}] },
        { code: "var foo = '\\p';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\p", type: "Literal"}] },
        {
            code: "var foo = '\\p\\a\\@';",
            errors: [
                {line: 1, column: 12, message: "Unnecessary escape character: \\p", type: "Literal"},
                {line: 1, column: 14, message: "Unnecessary escape character: \\a", type: "Literal"},
                {line: 1, column: 16, message: "Unnecessary escape character: \\@", type: "Literal"}
            ]
        },
        {
            code: "<foo attr={\"\\d\"}/>",
            parserOptions: {ecmaFeatures: {jsx: true}},
            errors: [{ line: 1, column: 13, message: "Unnecessary escape character: \\d", type: "Literal"}]
        }
    ]
});
