/**
 * @fileoverview Disallow trailing spaces at the end of lines.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-trailing-spaces"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-trailing-spaces", rule, {

    valid: [
        {
            code: "var a = 5;",
            options: [{}]
        },
        {
            code: "var a = 5,\n    b = 3;",
            options: [{}]
        },
        "var a = 5;",
        "var a = 5,\n    b = 3;",
        {
            code: "var a = 5,\n    b = 3;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "     ",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\t",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "     \n    var c = 1;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\t\n\tvar c = 2;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\n   var c = 3;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\n\tvar c = 4;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "let str = `${a}\n   \n${b}`;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let str = `${a}\n   \n${b}`;\n   \n   ",
            options: [{ skipBlankLines: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "// Trailing comment test. ",
            options: [{ ignoreComments: true }]
        },
        {
            code: "// Trailing comment test.",
            options: [{ ignoreComments: false }]
        },
        {
            code: "// Trailing comment test.",
            options: []
        },
        {
            code: "/* \nTrailing comments test. \n*/",
            options: [{ ignoreComments: true }]
        },
        {
            code: "#!/usr/bin/env node ",
            options: [{ ignoreComments: true }]
        }
    ],

    invalid: [
        {
            code:
            "var short2 = true;\r\n" +
            "\r\n" +
            "module.exports = {\r\n" +
            "  short: short,    \r\n" +
            "  short2: short\r\n" +
            "}",
            output:
            "var short2 = true;\r\n" +
            "\r\n" +
            "module.exports = {\r\n" +
            "  short: short,\r\n" +
            "  short2: short\r\n" +
            "}",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code:
            "var short2 = true;\n" +
            "\r\n" +
            "module.exports = {\r\n" +
            "  short: short,    \r\n" +
            "  short2: short\n" +
            "}",
            output:
            "var short2 = true;\n" +
            "\r\n" +
            "module.exports = {\r\n" +
            "  short: short,\r\n" +
            "  short2: short\n" +
            "}",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code:
            "var short2 = true;\n" +
            "\n" +
            "module.exports = {\n" +
            "  short: short,    \n" +
            "  short2: short\n" +
            "}\n",
            output:
            "var short2 = true;\n" +
            "\n" +
            "module.exports = {\n" +
            "  short: short,\n" +
            "  short2: short\n" +
            "}\n",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code:
            "var short2 = true;\n" +
            "\n" +
            "module.exports = {\n" +
            "  short,    \n" +
            "  short2\n" +
            "}\n",
            output:
            "var short2 = true;\n" +
            "\n" +
            "module.exports = {\n" +
            "  short,\n" +
            "  short2\n" +
            "}\n",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code:
            "\n" +
            "measAr.push(\"<dl></dl>\",  \n" +
            "         \" </dt><dd class ='pta-res'>\");",
            output:
            "\n" +
            "measAr.push(\"<dl></dl>\",\n" +
            "         \" </dt><dd class ='pta-res'>\");",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code:
            "measAr.push(\"<dl></dl>\",  \n" +
            "         \" </dt><dd class ='pta-res'>\");",
            output:
            "measAr.push(\"<dl></dl>\",\n" +
            "         \" </dt><dd class ='pta-res'>\");",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;      \n",
            output: "var a = 5;\n",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5; \n b = 3; ",
            output: "var a = 5;\n b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5; \n\n b = 3; ",
            output: "var a = 5;\n\n b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;\t\n  b = 3;",
            output: "var a = 5;\n  b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "     \n    var c = 1;",
            output: "\n    var c = 1;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "\t\n\tvar c = 2;",
            output: "\n\tvar c = 2;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;      \n",
            output: "var a = 5;\n",
            options: [{}],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5; \n b = 3; ",
            output: "var a = 5;\n b = 3;",
            options: [{}],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 1,
                column: 11
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 2,
                column: 8
            }]
        },
        {
            code: "var a = 5;\t\n  b = 3;",
            output: "var a = 5;\n  b = 3;",
            options: [{}],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 1,
                column: 11
            }]
        },
        {
            code: "     \n    var c = 1;",
            output: "\n    var c = 1;",
            options: [{}],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 1,
                column: 1
            }]
        },
        {
            code: "\t\n\tvar c = 2;",
            output: "\n\tvar c = 2;",
            options: [{}],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 'bar';  \n \n\t",
            output: "var a = 'bar';\n \n\t",
            options: [{
                skipBlankLines: true
            }],
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 1,
                column: 15 // there are invalid spaces in columns 15 and 16
            }]
        },
        {
            code: "var a = 'foo';   \nvar b = 'bar';  \n  \n",
            output: "var a = 'foo';\nvar b = 'bar';\n  \n",
            options: [{
                skipBlankLines: true
            }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 15
                },
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 2,
                    column: 15
                }
            ]
        },
        {
            code: "let str = `${a}\n  \n${b}`;  \n",
            output: "let str = `${a}\n  \n${b}`;\n",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 3,
                column: 7
            }]
        },
        {
            code: "let str = `\n${a}\n  \n${b}`;  \n\t",
            output: "let str = `\n${a}\n  \n${b}`;\n",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 4,
                    column: 7
                },
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 5,
                    column: 1
                }
            ]
        },
        {
            code: "let str = `  \n  ${a}\n  \n${b}`;  \n",
            output: "let str = `  \n  ${a}\n  \n${b}`;\n",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 4,
                    column: 7
                }
            ]
        },
        {
            code: "let str = `${a}\n  \n${b}`;  \n  \n",
            output: "let str = `${a}\n  \n${b}`;\n  \n",
            options: [{
                skipBlankLines: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 3,
                    column: 7
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/6933
        {
            code: "    \nabcdefg ",
            output: "    \nabcdefg",
            options: [{ skipBlankLines: true }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 2,
                    column: 8
                }
            ]
        },
        {
            code: "    \nabcdefg ",
            output: "\nabcdefg",
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 1
                },
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 2,
                    column: 8
                }
            ]
        },

        // Tests for ignoreComments flag.
        {
            code: "var foo = 'bar'; ",
            output: "var foo = 'bar';",
            options: [{ ignoreComments: true }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "// Trailing comment test. ",
            output: "// Trailing comment test.",
            options: [{ ignoreComments: false }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 26
                }
            ]
        },
        {
            code: "/* \nTrailing comments test. \n*/",
            output: "/*\nTrailing comments test.\n*/",
            options: [{ ignoreComments: false }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 3
                },
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 2,
                    column: 24
                }
            ]
        },
        {
            code: "#!/usr/bin/env node ",
            output: "#!/usr/bin/env node",
            options: [{ ignoreComments: false }],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 20
                }
            ]
        },
        {
            code: "// Trailing comment default test. ",
            output: "// Trailing comment default test.",
            options: [],
            errors: [
                {
                    message: "Trailing spaces not allowed.",
                    type: "Program",
                    line: 1,
                    column: 34
                }
            ]
        }
    ]
});
