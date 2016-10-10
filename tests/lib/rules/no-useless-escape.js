/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-escape"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

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
        {code: "<foo attr='\\d'></foo>", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "var foo = `\\x123`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\u00a9`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `xs\\u2111`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `foo \\\\ bar`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\t`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `foo \\b bar`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `foo \\r bar`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\v`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\f`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\\r\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo} \\x123`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo} \\u00a9`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo} xs\\u2111`", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo} \\\\ ${bar}`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo} \\b ${bar}`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\t`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\r`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\v`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\f`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `${foo}\\\r\n`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\\``", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\\`${foo}\\\``", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `\\${{${foo}`;", parserOptions: {ecmaVersion: 6}},
        {code: "var foo = `$\\{{${foo}`;", parserOptions: {ecmaVersion: 6}}
    ],

    invalid: [
        { code: "var foo = /\\#/;", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#.", type: "Literal"}] },
        { code: "var foo = /\\;/;", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\;.", type: "Literal"}] },
        { code: "var foo = \"\\'\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\'.", type: "Literal"}] },
        { code: "var foo = \"\\#/\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#.", type: "Literal"}] },
        { code: "var foo = \"\\a\"", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\a.", type: "Literal"}] },
        { code: "var foo = \"\\B\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\B.", type: "Literal"}] },
        { code: "var foo = \"\\@\";", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\@.", type: "Literal"}] },
        { code: "var foo = \"foo \\a bar\";", errors: [{ line: 1, column: 16, message: "Unnecessary escape character: \\a.", type: "Literal"}] },
        { code: "var foo = '\\\"';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\\".", type: "Literal"}] },
        { code: "var foo = '\\#';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\#.", type: "Literal"}] },
        { code: "var foo = '\\$';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\$.", type: "Literal"}] },
        { code: "var foo = '\\p';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\p.", type: "Literal"}] },
        {
            code: "var foo = '\\p\\a\\@';",
            errors: [
                {line: 1, column: 12, message: "Unnecessary escape character: \\p.", type: "Literal"},
                {line: 1, column: 14, message: "Unnecessary escape character: \\a.", type: "Literal"},
                {line: 1, column: 16, message: "Unnecessary escape character: \\@.", type: "Literal"}
            ]
        },
        {
            code: "<foo attr={\"\\d\"}/>",
            parserOptions: {ecmaFeatures: {jsx: true}},
            errors: [{ line: 1, column: 13, message: "Unnecessary escape character: \\d.", type: "Literal"}]
        },
        { code: "var foo = '\\`';", errors: [{ line: 1, column: 12, message: "Unnecessary escape character: \\`.", type: "Literal"}] },
        { code: "var foo = `\\\"`;", parserOptions: {ecmaVersion: 6}, errors: [{ line: 1, column: 11, message: "Unnecessary escape character: \\\".", type: "TemplateElement"}] },
        { code: "var foo = `\\'`;", parserOptions: {ecmaVersion: 6}, errors: [{ line: 1, column: 11, message: "Unnecessary escape character: \\'.", type: "TemplateElement"}] },
        { code: "var foo = `\\#`;", parserOptions: {ecmaVersion: 6}, errors: [{ line: 1, column: 11, message: "Unnecessary escape character: \\#.", type: "TemplateElement"}] },
        {
            code: "var foo = '\\\`foo\\\`';",
            errors: [
                { line: 1, column: 12, message: "Unnecessary escape character: \\`.", type: "Literal"},
                { line: 1, column: 17, message: "Unnecessary escape character: \\`.", type: "Literal"},
            ]
        },
        {
            code: "var foo = `\\\"${foo}\\\"`;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                { line: 1, column: 11, message: "Unnecessary escape character: \\\".", type: "TemplateElement"},
                { line: 1, column: 19, message: "Unnecessary escape character: \\\".", type: "TemplateElement"},
            ]
        },
        {
            code: "var foo = `\\\'${foo}\\\'`;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                { line: 1, column: 11, message: "Unnecessary escape character: \\'.", type: "TemplateElement"},
                { line: 1, column: 19, message: "Unnecessary escape character: \\'.", type: "TemplateElement"}
            ]
        },
        {
            code: "var foo = `\\#${foo}`;",
            parserOptions: {ecmaVersion: 6},
            errors: [{ line: 1, column: 11, message: "Unnecessary escape character: \\#.", type: "TemplateElement"}]
        },
        {
            code: "var foo = `\\$\\{{${foo}`;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                { line: 1, column: 11, message: "Unnecessary escape character: \\$.", type: "TemplateElement"},
            ]
        },
        {
            code: "var foo = `\\$a${foo}`;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                { line: 1, column: 11, message: "Unnecessary escape character: \\$.", type: "TemplateElement"},
            ]
        },
        {
            code: "var foo = `a\\{{${foo}`;",
            parserOptions: {ecmaVersion: 6},
            errors: [
                { line: 1, column: 12, message: "Unnecessary escape character: \\{.", type: "TemplateElement"},
            ]
        }
    ]
});
