/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require("../../../lib/rules/max-len"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
            code: "var i = 1;\r\nvar i = 1;\n",
            options: [10, 4]
        }, {
            code: "\n// Blank line on top\nvar foo = module.exports = {};\n",
            options: [80, 4]
        },
        "\n// Blank line on top\nvar foo = module.exports = {};\n",
        {
            code: "var foo = module.exports = {}; // really long trailing comment",
            options: [40, 4, {ignoreComments: true}]
        }, {
            code: "foo(); \t// strips entire comment *and* trailing whitespace",
            options: [6, 4, {ignoreComments: true}]
        }, {
            code: "// really long comment on its own line sitting here",
            options: [40, 4, {ignoreComments: true}]
        },
        "var /*inline-comment*/ i = 1;",
        {
            code: "var /*inline-comment*/ i = 1; // with really long trailing comment",
            options: [40, 4, {ignoreComments: true}]
        }, {
            code: "foo('http://example.com/this/is/?a=longish&url=in#here');",
            options: [40, 4, {ignoreUrls: true}]
        }, {
            code: "foo(bar(bazz('this is a long'), 'line of'), 'stuff');",
            options: [40, 4, {ignorePattern: "foo.+bazz\\("}]
        }, {
            code:
                "/* hey there! this is a multiline\n" +
                "   comment with longish lines in various places\n" +
                "   but\n" +
                "   with a short line-length */",
            options: [10, 4, {ignoreComments: true}]
        },
        // blank line
        ""
    ],

    invalid: [
        {
            code: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar i = 1;",
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 80.",
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
                    message: "Line 1 exceeds the maximum line length of 10.",
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
                    message: "Line 1 exceeds the maximum line length of 15.",
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
                    message: "Line 1 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 1,
                    column: 1
                },
                {
                    message: "Line 2 exceeds the maximum line length of 15.",
                    type: "Program",
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            code: "var /*this is a long non-removed inline comment*/ i = 1;",
            options: [20, 4, {ignoreComments: true}],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 20.",
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
            options: [20, 4, {ignorePattern: "fizzbuzz"}],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 20.",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "var longLine = 'will trigger'; // even with a comment",
            options: [10, 4, {ignoreComments: true}],
            errors: [
                {
                    message: "Line 1 exceeds the maximum line length of 10.",
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
                    message: "Line 1 exceeds the maximum line length of 40.",
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
                    message: "Line 1 exceeds the maximum line length of 40.",
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
                    message: "Line 1 exceeds the maximum line length of 40.",
                    type: "Program",
                    line: 1,
                    column: 1
                }
            ]
        }
    ]
});
