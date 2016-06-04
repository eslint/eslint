/**
 * @fileoverview enforce a maximum file length
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-lines"),

    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

/**
 * Returns the error message with the specified max number of lines
 * @param {number} lines Maximum number of lines
 * @returns {string} error message
 */
function errorMessage(lines) {
    return "File must be at most " + lines + " lines long";
}

ruleTester.run("max-lines", rule, {
    valid: [
        {code: "var x;" },
        {code: "var xy;\nvar xy;" },
        {code: "var xy;\nvar xy;", options: [2] },
        {code: "var xy;\nvar xy;", options: [{max: 2}] },
        {
            code: [
                "//a single line comment",
                "var xy;",
                "var xy;",
                " /* a multiline",
                " really really",
                " long comment*/ "
            ].join("\n"),
            options: [{max: 2, skipComments: true} ]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */ var z;"
            ].join("\n"),
            options: [{max: 2, skipComments: true} ]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */",
                "var z;"
            ].join("\n"),
            options: [{max: 2, skipComments: true} ]
        },
        {
            code: [
                "var x;",
                "",
                "\t",
                "\t  ",
                "var y;"
            ].join("\n"),
            options: [{max: 2, skipBlankLines: true} ]
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
            options: [{max: 2, skipComments: true, skipBlankLines: true} ]
        }
    ],
    invalid: [
        {
            code: "var xyz;\nvar xyz;\nvar xyz;",
            options: [2],
            errors: [{message: errorMessage(2)}]
        },
        {
            code: "/* a multiline comment\n that goes to many lines*/\nvar xy;\nvar xy;",
            options: [2],
            errors: [{message: errorMessage(2)}]
        },
        {
            code: "//a single line comment\nvar xy;\nvar xy;",
            options: [2],
            errors: [{message: errorMessage(2)}]
        },
        {
            code: [
                "var x;",
                "",
                "",
                "",
                "var y;"
            ].join("\n"),
            options: [{max: 2} ],
            errors: [{message: errorMessage(2)}]
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
            options: [{max: 2, skipComments: true } ],
            errors: [{message: errorMessage(2)}]
        },
        {
            code: [
                "var x; // inline comment",
                "var y;",
                "var z;"
            ].join("\n"),
            options: [{max: 2, skipComments: true} ],
            errors: [{message: errorMessage(2)}]
        },
        {
            code: [
                "var x; /* inline comment",
                " spanning multiple lines */",
                "var y;",
                "var z;"
            ].join("\n"),
            options: [{max: 2, skipComments: true} ],
            errors: [{message: errorMessage(2)}]
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
            options: [{max: 2, skipBlankLines: true } ],
            errors: [{message: errorMessage(2)}]
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
            options: [{max: 2, skipComments: true } ],
            errors: [{message: errorMessage(2)}]
        }
    ]
});
