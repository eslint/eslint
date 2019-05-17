/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/max-len"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = { ecmaVersion: 6 };

const ruleTester = new RuleTester();

ruleTester.run("max-len", rule, {
    valid: [
        "var x = 5;\nvar x = 2;",
        {
            code: "var x = 5;\nvar x = 2;",
            options: [80, 4]
        }, {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            options: [15, 1]
        }, {
            code: "var one\t\t= 1;\nvar three\t= 3;",
            options: [16, 4]
        }, {
            code: "\tvar one\t\t= 1;\n\tvar three\t= 3;",
            options: [20, 4]
        }, {
            code: "var i = 1;\r\nvar i = 1;\n",
            options: [10, 4]
        }, {
            code: "\n// Blank line on top\nvar foo = module.exports = {};\n",
            options: [80, 4]
        },
        "\n// Blank line on top\nvar foo = module.exports = {};\n",
        {
            code: "var foo = module.exports = {}; // really long trailing comment",
            options: [40, 4, { ignoreComments: true }]
        }, {
            code: "foo(); \t// strips entire comment *and* trailing whitespace",
            options: [6, 4, { ignoreComments: true }]
        }, {
            code: "// really long comment on its own line sitting here",
            options: [40, 4, { ignoreComments: true }]
        },
        "var /*inline-comment*/ i = 1;",
        {
            code: "var /*inline-comment*/ i = 1; // with really long trailing comment",
            options: [40, 4, { ignoreComments: true }]
        }, {
            code: "foo('http://example.com/this/is/?a=longish&url=in#here');",
            options: [40, 4, { ignoreUrls: true }]
        }, {
            code: "foo(bar(bazz('this is a long'), 'line of'), 'stuff');",
            options: [40, 4, { ignorePattern: "foo.+bazz\\(" }]
        }, {
            code:
                "/* hey there! this is a multiline\n" +
                "   comment with longish lines in various places\n" +
                "   but\n" +
                "   with a short line-length */",
            options: [10, 4, { ignoreComments: true }]
        }, {
            code:
                "// I like short comments\n" +
                "function butLongSourceLines() { weird(eh()) }",
            options: [80, { tabWidth: 4, comments: 30 }]
        }, {
            code:
                "// I like longer comments and shorter code\n" +
                "function see() { odd(eh()) }",
            options: [30, { tabWidth: 4, comments: 80 }]
        }, {
            code:
                "// Full line comment\n" +
                "someCode(); // With a long trailing comment.",
            options: [{ code: 30, tabWidth: 4, comments: 20, ignoreTrailingComments: true }]
        }, {
            code: "var foo = module.exports = {}; // really long trailing comment",
            options: [40, 4, { ignoreTrailingComments: true }]
        }, {
            code: "var foo = module.exports = {}; // really long trailing comment",
            options: [40, 4, { ignoreComments: true, ignoreTrailingComments: false }]
        },

        // ignoreStrings, ignoreTemplateLiterals and ignoreRegExpLiterals options
        {
            code: "var foo = veryLongIdentifier;\nvar bar = 'this is a very long string';",
            options: [29, 4, { ignoreStrings: true }]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = \"this is a very long string\";",
            options: [29, 4, { ignoreStrings: true }]
        },
        {
            code: "var str = \"this is a very long string\\\nwith continuation\";",
            options: [29, 4, { ignoreStrings: true }]
        },
        {
            code: "var str = \"this is a very long string\\\nwith continuation\\\nand with another very very long continuation\\\nand ending\";",
            options: [29, 4, { ignoreStrings: true }]
        },
        {
            code: "var foo = <div className=\"this is a very long string\"></div>;",
            options: [29, 4, { ignoreStrings: true }],
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = `this is a very long string`;",
            options: [29, 4, { ignoreTemplateLiterals: true }],
            parserOptions
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = `this is a very long string\nand this is another line that is very long`;",
            options: [29, 4, { ignoreTemplateLiterals: true }],
            parserOptions
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = `this is a very long string\nand this is another line that is very long\nand here is another\n and another!`;",
            options: [29, 4, { ignoreTemplateLiterals: true }],
            parserOptions
        },
        {
            code: "var foo = /this is a very long pattern/;",
            options: [29, 4, { ignoreRegExpLiterals: true }]
        },

        // check indented comment lines - https://github.com/eslint/eslint/issues/6322
        {
            code: "function foo() {\n" +
                  "//this line has 29 characters\n" +
                  "}",
            options: [40, 4, { comments: 29 }]
        }, {
            code: "function foo() {\n" +
                  "    //this line has 33 characters\n" +
                  "}",
            options: [40, 4, { comments: 33 }]
        }, {
            code: "function foo() {\n" +
                  "/*this line has 29 characters\n" +
                  "and this one has 21*/\n" +
                  "}",
            options: [40, 4, { comments: 29 }]
        }, {
            code: "function foo() {\n" +
                  "    /*this line has 33 characters\n" +
                  "    and this one has 25*/\n" +
                  "}",
            options: [40, 4, { comments: 33 }]
        }, {
            code: "function foo() {\n" +
                  "    var a; /*this line has 40 characters\n" +
                  "    and this one has 36 characters*/\n" +
                  "}",
            options: [40, 4, { comments: 36 }]
        }, {
            code: "function foo() {\n" +
                  "    /*this line has 33 characters\n" +
                  "    and this one has 43 characters*/ var a;\n" +
                  "}",
            options: [43, 4, { comments: 33 }]
        },

        // blank line
        "",

        // Multi-code-point unicode glyphs
        {
            code: "'🙂😀😆😎😊😜😉👍'",
            options: [10]
        }
    ],

    invalid: [
        {
            code: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar i = 1;",
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 80 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "var x = 5, y = 2, z = 5;",
            options: [10, 4],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 10 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;",
            options: [15, 4],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 15 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;",
            options: [15, 4],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 15 },
                    type: "Program",
                    line: 1,
                    column: 1
                },
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 15 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var /*this is a long non-removed inline comment*/ i = 1;",
            options: [20, 4, { ignoreComments: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 20 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code:
                "var foobar = 'this line isn\\'t matched by the regexp';\n" +
                "var fizzbuzz = 'but this one is matched by the regexp';\n",
            options: [20, 4, { ignorePattern: "fizzbuzz" }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 20 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "var longLine = 'will trigger'; // even with a comment",
            options: [10, 4, { ignoreComments: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 10 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = module.exports = {}; // really long trailing comment",
            options: [40, 4], // ignoreComments is disabled
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 40 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "foo('http://example.com/this/is/?a=longish&url=in#here');",
            options: [40, 4], // ignoreUrls is disabled
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 40 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }, {
            code: "foo(bar(bazz('this is a long'), 'line of'), 'stuff');",
            options: [40, 4], // ignorePattern is disabled
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 40 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }, {
            code: "// A comment that exceeds the max comment length.",
            options: [80, 4, { comments: 20 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 1, maxCommentLength: 20 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }, {
            code: "// A comment that exceeds the max comment length and the max code length, but will fail for being too long of a comment",
            options: [40, 4, { comments: 80 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 1, maxCommentLength: 80 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }, {
            code: "// A comment that exceeds the max comment length.",
            options: [{ code: 20 }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 20 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }, {
            code: "//This is very long comment with more than 40 characters which is invalid",
            options: [40, 4, { ignoreTrailingComments: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 40 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },

        // check indented comment lines - https://github.com/eslint/eslint/issues/6322
        {
            code: "function foo() {\n" +
                  "//this line has 29 characters\n" +
                  "}",
            options: [40, 4, { comments: 28 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 2, maxCommentLength: 28 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        }, {
            code: "function foo() {\n" +
                  "    //this line has 33 characters\n" +
                  "}",
            options: [40, 4, { comments: 32 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 2, maxCommentLength: 32 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        }, {
            code: "function foo() {\n" +
                  "/*this line has 29 characters\n" +
                  "and this one has 32 characters*/\n" +
                  "}",
            options: [40, 4, { comments: 28 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 2, maxCommentLength: 28 },
                    type: "Program",
                    line: 2,
                    column: 1
                },
                {
                    messageId: "maxComment",
                    data: { lineNumber: 3, maxCommentLength: 28 },
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        }, {
            code: "function foo() {\n" +
                  "    /*this line has 33 characters\n" +
                  "    and this one has 36 characters*/\n" +
                  "}",
            options: [40, 4, { comments: 32 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 2, maxCommentLength: 32 },
                    type: "Program",
                    line: 2,
                    column: 1
                },
                {
                    messageId: "maxComment",
                    data: { lineNumber: 3, maxCommentLength: 32 },
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        }, {
            code: "function foo() {\n" +
                  "    var a; /*this line has 40 characters\n" +
                  "    and this one has 36 characters*/\n" +
                  "}",
            options: [39, 4, { comments: 35 }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 39 },
                    type: "Program",
                    line: 2,
                    column: 1
                },
                {
                    messageId: "maxComment",
                    data: { lineNumber: 3, maxCommentLength: 35 },
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        }, {
            code: "function foo() {\n" +
                  "    /*this line has 33 characters\n" +
                  "    and this one has 43 characters*/ var a;\n" +
                  "}",
            options: [42, 4, { comments: 32 }],
            errors: [
                {
                    messageId: "maxComment",
                    data: { lineNumber: 2, maxCommentLength: 32 },
                    type: "Program",
                    line: 2,
                    column: 1
                },
                {
                    messageId: "max",
                    data: { lineNumber: 3, maxLength: 42 },
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        },

        // check comments with the same length as non-comments - https://github.com/eslint/eslint/issues/6564
        {
            code: "// This commented line has precisely 51 characters.\n" +
                  "var x = 'This line also has exactly 51 characters';",
            options: [20, { ignoreComments: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 20 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },

        // ignoreStrings and ignoreTemplateLiterals options
        {
            code: "var foo = veryLongIdentifier;\nvar bar = 'this is a very long string';",
            options: [29, { ignoreStrings: false, ignoreTemplateLiterals: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = /this is a very very long pattern/;",
            options: [29, { ignoreStrings: false, ignoreRegExpLiterals: false }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = new RegExp('this is a very very long pattern');",
            options: [29, { ignoreStrings: false, ignoreRegExpLiterals: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = \"this is a very long string\";",
            options: [29, { ignoreStrings: false, ignoreTemplateLiterals: true }],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = `this is a very long string`;",
            options: [29, { ignoreStrings: false, ignoreTemplateLiterals: false }],
            parserOptions,
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = veryLongIdentifier;\nvar bar = `this is a very long string\nand this is another line that is very long`;",
            options: [29, { ignoreStrings: false, ignoreTemplateLiterals: false }],
            parserOptions,
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 2, maxLength: 29 },
                    type: "Program",
                    line: 2,
                    column: 1
                },
                {
                    messageId: "max",
                    data: { lineNumber: 3, maxLength: 29 },
                    type: "Program",
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "var foo = <div>this is a very very very long string</div>;",
            options: [29, 4, { ignoreStrings: true }],
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 29 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Multi-code-point unicode glyphs
        {
            code: "'🙁😁😟☹️😣😖😩😱👎'",
            options: [10],
            errors: [
                {
                    messageId: "max",
                    data: { lineNumber: 1, maxLength: 10 },
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }
    ]
});
