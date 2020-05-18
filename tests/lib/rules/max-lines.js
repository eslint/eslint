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
        { code: "var xy;\nvar xy;", options: [2] },
        { code: "var xy;\nvar xy;", options: [{ max: 2 }] },
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
                    endLine: 3
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
                    endLine: 4
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
                    endLine: 3
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
                    endLine: 5
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
                    line: 3,
                    endLine: 4
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
                    endLine: 3
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
                    line: 3,
                    endLine: 3
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
                    line: 3,
                    endLine: 6
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
                    endLine: 301
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
                    endLine: 1
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
                    endColumn: 1
                }
            ]
        },
        {
            code: "var a = 'a',\nc,\nx;\r",
            options: [{ max: 2 }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
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
                    data: { max: 2, actual: 4 },
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
                    line: 3,
                    column: 1,
                    endLine: 3,
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
                    endLine: 4,
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
                "/* block comments */"
            ].join("\n"),
            options: [{ max: 2, skipComments: true }],
            errors: [
                {
                    messageId: "exceed",
                    data: { max: 2, actual: 4 },
                    line: 3,
                    column: 1,
                    endLine: 4,
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
                    endLine: 4,
                    endColumn: 1
                }
            ]
        }
    ]
});
