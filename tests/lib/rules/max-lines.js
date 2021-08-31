/**
 * @fileoverview enforce a maximum file length
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-lines"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-lines", rule, {
    valid: [
        "var x;",
        "var xy;\nvar xy;",
        { code: "A", options: [1] },
        { code: "A\n", options: [1] },
        { code: "A\r", options: [1] },
        { code: "A\r\n", options: [1] },
        { code: "var xy;\nvar xy;", options: [2] },
        { code: "var xy;\nvar xy;\n", options: [2] },
        { code: "var xy;\nvar xy;", options: [{ max: 2 }] },
        { code: "// comment\n", options: [{ max: 0, skipComments: true }] },
        { code: "foo;\n /* comment */\n", options: [{ max: 1, skipComments: true }] },
        {
            code: [
                "//a single line comment",
                "var xy;",
                "var xy;",
                " /* a multiline",
                " really really",
                " long comment*/ "
            ].join("\n"),
            options: [{ max: 2, skipComments: true }]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */ var z;"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */",
                "var z;"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }]
        },
        {
            code: [
                "var x;",
                "",
                "\t",
                "\t  ",
                "var y;"
            ].join("\n"),
            options: [{ max: 2, skipBlankLines: true }]
        },
        {
            code: [
                "//a single line comment",
                "var xy;",
                " ",
                "var xy;",
                " ",
                " /* a multiline",
                " really really",
                " long comment*/"
            ].join("\n"),
            options: [{ max: 2, skipComments: true, skipBlankLines: true }]
        }
    ],
    invalid: [
        {
            code: "var xyz;\nvar xyz;\nvar xyz;",
            options: [2],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 9
                }
            ]
        },
        {
            code: "/* a multiline comment\n that goes to many lines*/\nvar xy;\nvar xy;",
            options: [2],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 8
                }
            ]
        },
        {
            code: "//a single line comment\nvar xy;\nvar xy;",
            options: [2],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 8
                }
            ]
        },
        {
            code: [
                "var x;",
                "",
                "",
                "",
                "var y;"
            ].join("\n"),
            options: [{ max: 2 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 5 },
                    line: 3,
                    column: 1,
                    endLine: 5,
                    endColumn: 7
                }
            ]
        },
        {
            code: [
                "//a single line comment",
                "var xy;",
                " ",
                "var xy;",
                " ",
                " /* a multiline",
                " really really",
                " long comment*/"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 4,
                    column: 1,
                    endLine: 8,
                    endColumn: 16
                }
            ]
        },
        {
            code: [
                "var x; // inline comment",
                "var y;",
                "var z;"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 7
                }
            ]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */",
                "var y;",
                "var z;"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 4,
                    column: 1,
                    endLine: 4,
                    endColumn: 7
                }
            ]
        },
        {
            code: [
                "//a single line comment",
                "var xy;",
                " ",
                "var xy;",
                " ",
                " /* a multiline",
                " really really",
                " long comment*/"
            ].join("\n"),
            options: [{ max: 2, skipBlankLines: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 6 },
                    line: 4,
                    column: 1,
                    endLine: 8,
                    endColumn: 16
                }
            ]
        },
        {
            code: "AAAAAAAA\n".repeat(301).trim(),
            options: [{}],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 300, actual: 301 },
                    line: 301,
                    column: 1,
                    endLine: 301,
                    endColumn: 9
                }
            ]
        },
        {

            // Questionable. Makes sense to report this, and makes sense to not report this.
            code: "",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 1 },
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 1
                }
            ]
        },
        {
            code: " ",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 1 },
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                }
            ]
        },
        {
            code: "\n",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 1 },
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "A",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 1 },
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 2
                }
            ]
        },
        {
            code: "A\n",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 1 },
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "A\n ",
            options: [{ max: 0 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 0, actual: 2 },
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "A\n ",
            options: [{ max: 1 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 1, actual: 2 },
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "A\n\n",
            options: [{ max: 1 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 1, actual: 2 },
                    line: 2,
                    column: 1,
                    endLine: 3,
                    endColumn: 1
                }
            ]
        },
        {
            code: ["var a = 'a'; ", "var x", "var c;", "console.log"].join(
                "\n"
            ),
            options: [{ max: 2 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 12
                }
            ]
        },
        {
            code: "var a = 'a',\nc,\nx;\r",
            options: [{ max: 2 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "var a = 'a',\nc,\nx;\n",
            options: [{ max: 2 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 1
                }
            ]
        },
        {
            code: "\n\nvar a = 'a',\nc,\nx;\n",
            options: [{ max: 2, skipBlankLines: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 5,
                    column: 1,
                    endLine: 6,
                    endColumn: 1
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "var x",
                "var c;",
                "console.log",
                "// some block ",
                "// comments"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 6,
                    endColumn: 12
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "var x",
                "var c;",
                "console.log",
                "/* block comments */"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 5,
                    endColumn: 21
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "var x",
                "var c;",
                "console.log",
                "/* block comments */\n"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 6,
                    endColumn: 1
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "var x",
                "var c;",
                "console.log",
                "/** block \n\n comments */"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 7,
                    endColumn: 13
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "",
                "",
                "// comment"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 3 },
                    line: 3,
                    column: 1,
                    endLine: 4,
                    endColumn: 11
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "var x",
                "\n",
                "var c;",
                "console.log",
                "\n"
            ].join("\n"),
            options: [{ max: 2, skipBlankLines: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 5,
                    column: 1,
                    endLine: 8,
                    endColumn: 1
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "\n",
                "var x",
                "var c;",
                "console.log",
                "\n"
            ].join("\n"),
            options: [{ max: 2, skipBlankLines: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 5,
                    column: 1,
                    endLine: 8,
                    endColumn: 1
                }
            ]
        },
        {
            code: [
                "var a = 'a'; ",
                "//",
                "var x",
                "var c;",
                "console.log",
                "//"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 4,
                    column: 1,
                    endLine: 6,
                    endColumn: 3
                }
            ]
        },
        {
            code: ["// hello world", "/*hello", " world 2 */", "var a,", "b", "// hh", "c,", "e,", "f;"].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [{
                data: { max: 2, actual: 5 },
                messageId: "exceed",
                line: 7,
                column: 1,
                endLine: 9,
                endColumn: 3

            }]
        },
        {
            code: ["", "var x = '';", "", "// comment", "", "var b = '',", "c,", "d,", "e", "", "// comment"].join("\n"),
            options: [{ max: 2, skipComments: true, skipBlankLines: true }],
            errors: [{
                data: { max: 2, actual: 5 },
                messageId: "exceed",
                line: 7,
                column: 1,
                endLine: 11,
                endColumn: 11
            }]
        }

    ]
});
